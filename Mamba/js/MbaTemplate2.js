function MbaTemplate2(){
    this._rootDom;
    this._templateTree;
    this._templateNodeMap;
    this._isReadyToRender;
};

MbaTemplate2.prototype.init = function(rootDom, domMultipliersSelectors){
    checkType(rootDom, MbaDom);
    checkType(domMultipliersSelectors, 'array', 'string');
    this._rootDom = rootDom;
    this.addIdToAllDomElements();
    this.constructTemplateTree(domMultipliersSelectors);
    this.constructTemplateNodeMap();
    this._isReadyToRender = false;
    return this;
};

MbaTemplate2.prototype.addIdToAllDomElements = function(){
    var rootDomElements = this._rootDom.getElements();
    var domIdentifier = new MbaDomIdentifier().init(rootDomElements);
    domIdentifier.addIdsLevelOrder();
};

MbaTemplate2.prototype.constructTemplateTree = function(domMultipliersSelectors){
    checkType(domMultipliersSelectors, 'array', 'string');
    var templateNodeInstanciator = this.createTemplateNodeInstanciator(domMultipliersSelectors);
    this._templateTree = new MbaTemplateTree().init(this._rootDom.getElements(), templateNodeInstanciator);
};

MbaTemplate2.prototype.createTemplateNodeInstanciator = function(domMultipliersSelectors){
    checkType(domMultipliersSelectors, 'array', 'string');
    var multipliableDomElmentsIds = this.getMultipliableDomElementsIds(domMultipliersSelectors);
    return new MbaTemplateNodeInstanciator().init(multipliableDomElmentsIds);
};

MbaTemplate2.prototype.getMultipliableDomElementsIds = function(domMultipliersSelectors){
    checkType(domMultipliersSelectors, 'array', 'string');
    var multipliableDomElmentsIds = [];
    for(var i=0 ; i<domMultipliersSelectors.length ; i++){
        var selector = domMultipliersSelectors[i];
        Uti.array(multipliableDomElmentsIds).pushAll(this.getDomElementsIdsForSelector(selector));
    }
    return multipliableDomElmentsIds;
};

MbaTemplate2.prototype.getDomElementsIdsForSelector = function(selector){
    checkType(selector, 'string');
    var domElements = this.findForSelector(selector);
    var domElementsIds = [];
    for(var i=0 ; i<domElements.length ; i++){
        domElementsIds.push(domElements[i]._mbaId);
    }
    return domElementsIds;
};

MbaTemplate2.prototype.findForSelector = function(cssSelector){
    checkType(cssSelector, 'string');
    return this._rootDom.select(cssSelector);
};

MbaTemplate2.prototype.constructTemplateNodeMap = function(){
    this._templateNodeMap = {};
    this.registerDomElementsRecursively(this._templateTree.getChildNodes());
};

MbaTemplate2.prototype.registerDomElementsRecursively = function(templateNodes){
    checkType(templateNodes, 'array', MbaTemplateNode);
    for(var i=0 ; i<templateNodes.length ; i++){
        var currentNode = templateNodes[i];
        this._templateNodeMap[currentNode.getTemplateDomId()] = currentNode;
        this.registerDomElementsRecursively(currentNode.getChildNodes());
    }
}

MbaTemplate2.prototype.initRenderedDom = function(){
    var modelAccessorChain = new MbaAccessorChain2().initFromMemberChain([]);
    var modelRoute = new MbaRoute2().init();
    this._templateTree.createDomForRoute(modelRoute);
    this._isReadyToRender = true;
};

MbaTemplate2.prototype.createDomForRoute = function(domId, modelRoute){
    checkType(domId, 'string');
    checkType(modelRoute, MbaRoute2);
    var templateNode = this._templateNodeMap[domId];
    templateNode.createDomForRoute(modelRoute);
};

MbaTemplate2.prototype.deleteDomForRoute = function(domId, modelRoute){
    checkType(domId, 'string');
    checkType(modelRoute, MbaRoute2);
    var templateNode = this._templateNodeMap[domId];
    templateNode.deleteDomForRoute(modelRoute);
};

MbaTemplate2.prototype.getRenderedDom = function(){
    return this._templateTree.getRenderedDom();
};

MbaTemplate2.prototype.isReadyToRender = function(){
    return this._isReadyToRender;
};
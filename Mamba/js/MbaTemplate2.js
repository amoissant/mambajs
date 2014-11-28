function MbaTemplate2(){
    this._rootDom;
    this._domMultipliersSelectors;
    this._templateNodeInstanciator;
    this._templateTree;
    this._templateNodeMap;
};

MbaTemplate2.prototype.init = function(rootDom, domMultipliersSelectors){
    checkType(rootDom, MbaDom);
    checkType(domMultipliersSelectors, 'array', 'string');
    this._rootDom = rootDom;
    this._domMultipliersSelectors = domMultipliersSelectors;
    this.addIdToAllDomElements();
    this.createTemplateNodeInstanciator();
    this.constructTemplateTree();
    this.constructTemplateNodeMap();
    return this;
};

MbaTemplate2.prototype.findForSelector = function(cssSelector){
    checkType(cssSelector, 'string');
    return this._rootDom.select(cssSelector);
};

MbaTemplate2.prototype.addIdToAllDomElements = function(){
    var rootDomElements = this._rootDom.getElements();
    var domIdentifier = new MbaDomIdentifier().init(rootDomElements);
    domIdentifier.addIdsLevelOrder();
};

MbaTemplate2.prototype.createTemplateNodeInstanciator = function(){
    var multipliableDomElmentsIds = this.getMultipliableDomElementsIds();
    this._templateNodeInstanciator = new MbaTemplateNodeInstanciator().init(multipliableDomElmentsIds);
};
 
MbaTemplate2.prototype.getMultipliableDomElementsIds = function(){
    var multipliableDomElmentsIds = [];
    for(var i=0 ; i<this._domMultipliersSelectors.length ; i++){
        var selector = this._domMultipliersSelectors[i];
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

MbaTemplate2.prototype.constructTemplateTree = function(){
    this._templateTree = new MbaTemplateTree().init(this._rootDom.getElements(), this._templateNodeInstanciator);
};

MbaTemplate2.prototype.constructTemplateNodeMap = function(){
    this._templateNodeMap = {};
    this.registerDomElementsRecursively(this._templateTree.getChildNodes());
};

MbaTemplate2.prototype.registerDomElementsRecursively = function(templateNodes){
    checkType(templateNodes, 'array', MbaTemplateNode);
    for(var i=0 ; i<templateNodes.length ; i++){
        var currentNode = templateNodes[i];
        this._templateNodeMap[currentNode.getId()] = currentNode;
        this.registerDomElementsRecursively(currentNode.getChildNodes());
    }
}
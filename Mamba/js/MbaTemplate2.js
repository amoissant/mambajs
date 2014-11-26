function MbaTemplate2(){
    this._rootDom;
    this._templateTree;
    this._templateNodeMap;
};

MbaTemplate2.prototype.init = function(rootDom){
    checkType(rootDom, MbaDom);
    this._rootDom = rootDom;
    this.addIdToAllDomElements();
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

MbaTemplate2.prototype.constructTemplateTree = function(){
    this._templateTree = new MbaTemplateTree().init(this._rootDom.getElements());
};

MbaTemplate2.prototype.constructTemplateNodeMap = function(){
    this._templateNodeMap = {};
    this.registerDomElementsRecursively(this._rootDom.getElements());
};

MbaTemplate2.prototype.registerDomElementsRecursively = function(domElements){
    checkIsDomSetOrEmpty(domElements);
    for(var i=0 ; i<domElements.length ; i++){
        var currentDomElement = domElements[i];
        this._templateNodeMap[currentDomElement._mbaId] = currentDomElement;
        this.registerDomElementsRecursively(currentDomElement.childNodes);
    }
}
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

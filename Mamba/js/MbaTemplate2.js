function MbaTemplate2(){
    this._rootDomElements;
};

MbaTemplate2.prototype.init = function(rootDomElements){
    checkType(rootDomElements, MbaDom);
    this._rootDomElements = rootDomElements;
    return this;
};

MbaTemplate2.prototype.findForSelector = function(cssSelector){
    checkType(cssSelector, 'string');
    return this._rootDomElements.select(cssSelector);
};
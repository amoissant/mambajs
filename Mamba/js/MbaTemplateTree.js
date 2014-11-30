function MbaTemplateTree(){
    this._renderedDom;
}
MbaTemplateTree.prototype = new MbaTemplateBaseNode();
MbaTemplateTree.prototype.constructor = MbaTemplateTree;

MbaTemplateTree.prototype.init = function(domElements, templateNodeInstanciator){
    checkIsDomSet(domElements);
    checkType(templateNodeInstanciator, MbaTemplateNodeInstanciator);
    MbaTemplateBaseNode.prototype.init.call(this);
    this.constructChildrenForDomElements(domElements, templateNodeInstanciator);
    this._renderedDom = new MbaDomEmpty();
    return this;
};


MbaTemplateTree.prototype.createDomForRoute = function(modelRoute){
    checkType(modelRoute, MbaRoute2);
    this.askChildrenCreateDomForRoute(modelRoute);
    //this.renderChildrenForAccessorAndRoute(modelAccessor, route);
};
/*

MbaTemplateTree.prototype.renderForAccessorAndRoute = function(modelAccessor, route){
    checkType(modelAccessor, MbaAccessorChain2);
    checkType(route, 'array', 'string');
    this.renderChildrenForAccessorAndRoute(modelAccessor, route);
};
*/

MbaTemplateTree.prototype.insertDomElement = function(domElement, domId, modelRoute){
    checkType(domElement, 'domElement');
    checkType(domId, 'number');
    checkType(modelRoute, MbaRoute2);
    this._renderedDom.addElement(domElement);
};
/*

MbaTemplateTree.prototype.insertDomElement = function(domElement, domId, modelAccessor, route){
    checkType(domElement, 'domElement');
    checkType(domId, 'number');
    checkType(modelAccessor, MbaAccessorChain2);
    checkType(route, 'array', 'string');
    this._renderedDom.addElement(domElement);
};
*/

MbaTemplateTree.prototype.getRenderedDom = function(){
    return this._renderedDom;
};
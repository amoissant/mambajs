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
};

MbaTemplateTree.prototype.insertChildDomElement = function(domElement, domId, modelRoute){
    checkType(domElement, 'domElement');
    checkType(domId, 'number');
    checkType(modelRoute, MbaRoute2);
    this._renderedDom.addElement(domElement);
};

MbaTemplateTree.prototype.removeChildDomElement = function(domElement, domId, modelRoute){
    checkType(domElement, 'domElement');
    checkType(domId, 'number');
    checkType(modelRoute, MbaRoute2);
    this._renderedDom.removeElement(domElement);
};

MbaTemplateTree.prototype.computeParentRoute = function(childRoute){
    checkType(childRoute, MbaRoute2);
    return childRoute;//TODO childRoute ou route vide ?
};

MbaTemplateTree.prototype.getRenderedDom = function(){
    return this._renderedDom;
};
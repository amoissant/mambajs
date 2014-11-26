function MbaTemplateTree(){
}
MbaTemplateTree.prototype = new MbaTemplateBaseNode();
MbaTemplateTree.prototype.constructor = MbaTemplateTree;

MbaTemplateTree.prototype.init = function(domElements, templateNodeInstanciator){
    checkIsDomSet(domElements);
    checkType(templateNodeInstanciator, MbaTemplateNodeInstanciator);
    MbaTemplateBaseNode.prototype.init.call(this);
    this.constructChildrenForDomElements(domElements, templateNodeInstanciator);
    return this;
};

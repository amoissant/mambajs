function MbaTemplateTree(){
 
}
MbaTemplateTree.prototype = new MbaTemplateBaseNode();
MbaTemplateTree.prototype.constructor = MbaTemplateTree;

MbaTemplateTree.prototype.init = function(domElements){
    checkIsDomSet(domElements);
    MbaTemplateBaseNode.prototype.init.call(this);
    this.constructChildrenForDomElements(domElements);
    return this;
};

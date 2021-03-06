function IntegrateBindingAndDirectiveNodesVisitor() {}
IntegrateBindingAndDirectiveNodesVisitor.prototype = new MbaTemplateDirectiveVisitor();
IntegrateBindingAndDirectiveNodesVisitor.prototype.constructor = IntegrateBindingAndDirectiveNodesVisitor;

IntegrateBindingAndDirectiveNodesVisitor.prototype.beforeVisitTemplateDirective = function (templateDirective) {
    checkType(templateDirective, MbaTemplateDirective);

    if (templateDirective.hasRoot()) {
        var rootAnchor = templateDirective.getRootAnchor();
        var htmlElementNodes = rootAnchor.getMbaNodes();
        var directiveNode = new MbaNodeDirective(rootAnchor, templateDirective);
        directiveNode.interposeUnderParentOfNodesInTree(htmlElementNodes);
    }
};

IntegrateBindingAndDirectiveNodesVisitor.prototype.beforeVisitTemplateBinding = function (templateBinding) {
    checkType(templateBinding, MbaTemplateBinding);

    var anchorElements = templateBinding.getAnchor().getElements(); 
    for (var i = 0; i < anchorElements.length; i++) {
        var currAnchor = new MbaDomSingle(anchorElements[i]);
        var htmlElementNode = currAnchor.getMbaNode();
        if(htmlElementNode instanceof MbaNodeBinding){
            htmlElementNode.getTemplateBinding().addAllTransformations(templateBinding);
            return;
        }            
        var bindingNode = new MbaNodeBinding(currAnchor, templateBinding);
        bindingNode.replaceInTree(htmlElementNode);
        bindingNode.updateNodeReferenceIntoDomElement();
    }
};
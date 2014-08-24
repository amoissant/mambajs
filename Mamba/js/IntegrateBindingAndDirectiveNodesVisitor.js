function IntegrateBindingAndDirectiveNodesVisitor() {}
IntegrateBindingAndDirectiveNodesVisitor.prototype = new MbaTemplateDirectiveVisitor();
IntegrateBindingAndDirectiveNodesVisitor.prototype.constructor = IntegrateBindingAndDirectiveNodesVisitor;

IntegrateBindingAndDirectiveNodesVisitor.prototype.beforeVisitTemplateDirective = function (templateDirective, directiveIndex) {
    checkType(templateDirective, MbaTemplateDirective);
    checkType(directiveIndex, 'number');

    if (templateDirective.hasRoot()) {
        var rootAnchor = templateDirective.getRootAnchor();
        var htmlElementNodes = rootAnchor.getMbaNodes();
        var directiveNode = new MbaNodeDirective(rootAnchor, templateDirective);
        directiveNode.interposeUnderParentOfNodesInTree(htmlElementNodes);
    }
};

IntegrateBindingAndDirectiveNodesVisitor.prototype.visitTemplateBinding = function (templateBinding, directiveIndex, bindingIndex) {
    checkType(templateBinding, MbaTemplateBinding);
    checkType(directiveIndex, 'number');
    checkType(bindingIndex, 'number');

    var anchorElements = templateBinding.getAnchor().getElements(); 
    for (var i = 0; i < anchorElements.length; i++) {
        var currAnchor = new MbaDomSingle(anchorElements[i]);
        var htmlElementNode = currAnchor.getMbaNode();
        var bindingNode = new MbaNodeBinding(currAnchor, templateBinding);
        bindingNode.replaceInTree(htmlElementNode);
        bindingNode.updateNodeReferenceIntoDomElement();
    }
};
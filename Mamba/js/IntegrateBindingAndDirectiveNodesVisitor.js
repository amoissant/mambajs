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

    var anchor = templateBinding.getAnchor();
    var anchorElements = anchor.getDom(); 
    //TODO refacto pour utiliser MbaDom2 et avoir une fonction toMbaNodeSingleArray() pour itérer sur les éléments
    for (var i = 0; i < anchorElements.length; i++) {
        var currAnchor = new MbaDom([anchorElements[i]]);//TODO MbaNodeSingle
        var htmlElementNode = currAnchor.getMbaNode();
        var bindingNode = new MbaNodeBinding(currAnchor, templateBinding);
        bindingNode.replaceInTree(htmlElementNode);
        bindingNode.updateNodeReferenceIntoDomElement();
    }
};
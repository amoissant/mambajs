function IntegrateBindingAndDirectiveNodesVisitor(){
    
    IntegrateBindingAndDirectiveNodesVisitor.prototype.beforeVisitTemplateDirective = function(templateDirective, directiveIndex){
        checkType(templateDirective, MbaTemplateDirective);
        checkType(directiveIndex, 'number');
        
        if(templateDirective.hasRoot()){
            var rootAnchor = templateDirective.getRootAnchor();
            var htmlElementNodes = rootAnchor.getMbaNodes();
            var directiveNode = new MbaNodeDirective(rootAnchor, templateDirective);
            directiveNode.interposeUnderParentOfNodesInTree(htmlElementNodes);
        }
    };        
    IntegrateBindingAndDirectiveNodesVisitor.prototype.visitTemplateBinding = function(templateBinding, directiveIndex, bindingIndex){
        checkType(templateBinding, MbaTemplateBinding);
        checkType(directiveIndex, 'number');
        checkType(bindingIndex, 'number');
        
        var anchor = templateBinding.getAnchor();
        //TODO si anchor est une classe et retroune plusieurs éléments de dom alors faut prendre en compte ce cas
        var htmlElementNode = anchor.getMbaNode();
        var bindingNode = new MbaNodeBinding(anchor, templateBinding);
        bindingNode.replaceInTree(htmlElementNode);
        bindingNode.updateNodeReferenceIntoDomElement();
    };
}
IntegrateBindingAndDirectiveNodesVisitor.prototype = new MbaTemplateDirectiveVisitor();
IntegrateBindingAndDirectiveNodesVisitor.prototype.constructor = IntegrateBindingAndDirectiveNodesVisitor;
function DebugNodeAndAccessorVisitor(){
    
    DebugNodeAndAccessorVisitor.prototype.print = function(node){
        checkType(node, MbaNode);
        var nodeTypeName = this.getNodeTypeName(node);
        console.log(this.getIndentation(),
                    nodeTypeName,
                    ' - ',
                    node.getBaseDom().getElements());
        var accessorIndentation = this.getIndentation()+this.getNSpaces(nodeTypeName.length+2);
        if(node instanceof MbaNodeBinding){
            var templateBinding = node.getTemplateBinding();
            var accessorChains = templateBinding.getAccessorChains();
            
            for(var i=0 ; i<accessorChains.length ; i++){
                console.log(accessorIndentation, accessorChains[i].toStringWithModel());
            }            
        }
        else if(nodeTypeName == MbaNodeDirective.prototype.constructor.name){
            var accessorChain = node.getAccessorChain();
            console.log(accessorIndentation, accessorChain.toStringWithModel());
        }
	};
}
DebugNodeAndAccessorVisitor.prototype = new DebugNodeVisitor();
DebugNodeAndAccessorVisitor.prototype.constructor = DebugNodeAndAccessorVisitor;
function DebugNodeAndAccessorVisitor(){
    
    DebugNodeAndAccessorVisitor.prototype.print = function(node){
        checkType(node, MbaNode2);
        var nodeTypeName = this.getNodeTypeName(node);
        console.log(this.getIndentation(),
                    nodeTypeName,
                    ' - ',
                    node.getBaseDom().getDom());
        var accessorIndentation = this.getIndentation()+this.getNSpaces(nodeTypeName.length+2);
        if(node instanceof MbaNodeBinding2){
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
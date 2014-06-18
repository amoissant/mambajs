function GetNodesAndAccessorsVisitor(){
    
    this._accessorChainsAndNodes;
    this._rootAccessorNode;

    this.init();
}
GetNodesAndAccessorsVisitor.prototype = new MbaNodeVisitor();
GetNodesAndAccessorsVisitor.prototype.constructor = GetNodesAndAccessorsVisitor;

GetNodesAndAccessorsVisitor.prototype.init = function(){
    this._accessorChainsAndNodes = [];
};
    
GetNodesAndAccessorsVisitor.prototype.getRootAccessorNode = function(){
    return this._rootAccessorNode;
};

GetNodesAndAccessorsVisitor.prototype.beforeVisitNode = function(node){
    checkType(node, MbaNode2);
     switch(node.constructor){
        case MbaNodeDirective:
            var accessorChain = node.getAccessorChain();
            this.addAccesorChainAndNodes(accessorChain, node);
        break;
        case MbaNodeBinding2:
            var accessorChains = node.getAccessorChains();
            for(var i=0 ; i<accessorChains.length ; i++){
                this.addAccesorChainAndNodes(accessorChains[i], node);
            }
        break;
    }
};

GetNodesAndAccessorsVisitor.prototype.addAccesorChainAndNodes = function(accessorChain, node){
    checkType(node, MbaNode2);
    checkType(accessorChain, MbaAccessorChain);
    var accessorChainCopy = this.copyWithoutLastAccessor(accessorChain);
    var accessorId = accessorChainCopy.toStringWithModel();
    if(this._accessorChainsAndNodes[accessorId] == null){
        this._accessorChainsAndNodes[accessorId] = new AccessorChainAndMbaNodes(accessorChainCopy);
    }
    var accessorChainAndNodes = this._accessorChainsAndNodes[accessorId];
    accessorChainAndNodes.addNode(node);
};

GetNodesAndAccessorsVisitor.prototype.copyWithoutLastAccessor = function(accessorChain){
    var accessorChainCopy = new MbaAccessorChain();
    var accessors = accessorChain.getAccessors();
    for(var i=0 ; i<accessors.length-1 ; i++){
        accessorChainCopy.appendAccessor(accessors[i]);
    }
    return accessorChainCopy;
};

GetNodesAndAccessorsVisitor.prototype.constructAccessorNodes = function(){
    this._rootAccessorNode = new RootAccessorNode();
    
    for(var id in this._accessorChainsAndNodes){
        var currentAccessorNode = this._rootAccessorNode;
        var currAccessorChainAndNodes = this._accessorChainsAndNodes[id];
        var accessors = currAccessorChainAndNodes.getAccessorChain().getAccessors();
        for(var i=0 ; i<accessors.length ; i++){
            var currAccessor = accessors[i];
            var currAccessorId = currAccessor.toString();
            if(!currentAccessorNode.hasChild(currAccessorId)){
                currentAccessorNode.addChild(currAccessorId, currAccessor);
            }
            currentAccessorNode = currentAccessorNode.getChild(currAccessorId);
        }
        if(currentAccessorNode != this._rootAccessorNode)
            currentAccessorNode.addMbaNodes(currAccessorChainAndNodes.getNodes());
    }
};

function AccessorChainAndMbaNodes(accessorChain){
    
    this._accessorChain;
    this._nodes;

    if(arguments.length > 0)
        this.init(accessorChain);
}

AccessorChainAndMbaNodes.prototype.init = function(accessorChain){
    checkType(accessorChain, MbaAccessorChain);
    this._accessorChain = accessorChain;
    this._nodes = [];
};

AccessorChainAndMbaNodes.prototype.addNode = function(node){
    checkType(node, MbaNode2);
    this._nodes.push(node);
};

AccessorChainAndMbaNodes.prototype.getAccessorChain = function(){
    return this._accessorChain;
};

AccessorChainAndMbaNodes.prototype.getNodes = function(){
    return this._nodes;
};
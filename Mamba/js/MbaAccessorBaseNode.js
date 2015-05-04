function MbaAccessorBaseNode(){
}

MbaAccessorBaseNode.prototype.init = function(){
    this._childNodes = [];
    return this;
};

MbaAccessorBaseNode.prototype.addNodeFrom = function(objectWithAccessor){
    var candidateChild = this.findChildToBeParentOf(objectWithAccessor);
    if(candidateChild != null)
        candidateChild.addNodeFrom(objectWithAccessor);
    else
        this.createNodeFrom(objectWithAccessor);      
};

MbaAccessorBaseNode.prototype.findChildToBeParentOf = function(objectWithAccessor){
    for(var i=0 ; i<this._childNodes.length ; i++){
        var currentChildNode = this._childNodes[i];
        if(currentChildNode.accessorHasSameRoot(objectWithAccessor))
            return currentChildNode;
    }
    return null;
};

MbaAccessorBaseNode.prototype.createNodeFrom = function(objectWithAccessor){
    var node = this.instanciateNewNode(objectWithAccessor);
    this._childNodes.push(node);
};

MbaAccessorBaseNode.prototype.instanciateNewNode = function(objectWithAccessor){
    throw new Error('Must be implemented in subclass.');
};

MbaAccessorBaseNode.prototype.getChildNodes = function(){
    return this._childNodes;
};
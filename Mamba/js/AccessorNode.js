function AccessorNode(parent, accessor){
    
    this._parent;
    this._accessor;
    this._mbaNodes;
    
    if(arguments.length > 0)
        this.init(parent, accessor);
}
AccessorNode.prototype = new RootAccessorNode();
AccessorNode.prototype.constructor = AccessorNode;

AccessorNode.prototype.init = function(parent, accessor){
    checkTypeOrNull(parent, RootAccessorNode);
    checkType(accessor, MbaAccessor);
    this._parent = parent;
    this._accessor = accessor;
    this._mbaNodes = [];
    RootAccessorNode.prototype.init.call(this);
};

AccessorNode.prototype.addMbaNodes = function(mbaNodes){
    checkTypeOrNull(mbaNodes, 'array', MbaNode);
    pushAll(this._mbaNodes, mbaNodes);
};

AccessorNode.prototype.getAccessor = function(){
    return this._accessor;
};

AccessorNode.prototype.getMbaNodes = function(){
    return this._mbaNodes;
};

AccessorNode.prototype.isALeef = function(){
    return Object.keys(this._children).length == 0;
};




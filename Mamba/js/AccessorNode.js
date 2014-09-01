function AccessorNode(parent, accessor){
    
    this._parent;
    this._accessor;
    
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
    RootAccessorNode.prototype.init.call(this);
};

AccessorNode.prototype.getAccessor = function(){
    return this._accessor;
};

AccessorNode.prototype.isALeef = function(){
    return Object.keys(this._children).length == 0;
};




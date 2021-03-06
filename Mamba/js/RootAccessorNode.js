function RootAccessorNode(){
    this._children;
    this._mbaNodes;
    
    this.init();
}

RootAccessorNode.prototype.init = function(){
    this._children = {};
    this._mbaNodes = [];
};

RootAccessorNode.prototype.hasChild = function(childName){
    checkType(childName, 'string');
    return this._children[childName] != null;
};

RootAccessorNode.prototype.addChild = function(childName, accessor){
    checkType(childName, 'string');
    checkType(accessor, MbaAccessor);
    this._children[childName] = new AccessorNode(this, accessor);
};

RootAccessorNode.prototype.getChild = function(childName){
    checkType(childName, 'string');
    return this._children[childName];
};

RootAccessorNode.prototype.getChildren = function(){
    return this._children;
};

RootAccessorNode.prototype.addMbaNodes = function(mbaNodes){
    checkTypeOrNull(mbaNodes, 'array', MbaNode);
    pushAllOld(this._mbaNodes, mbaNodes);
};

RootAccessorNode.prototype.getMbaNodes = function(){
    return this._mbaNodes;
};



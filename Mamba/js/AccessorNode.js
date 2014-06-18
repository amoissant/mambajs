function RootAccessorNode(){
    this._children;
    
    this.init();
}

RootAccessorNode.prototype.init = function(){
    this._children = {};
};

RootAccessorNode.prototype.hasChild = function(childName){
    checkType(childName, 'string');
    return this._children[childName] != null;
};

RootAccessorNode.prototype.addChild = function(childName, accessor){
    checkType(childName, 'string');
    checkType(accessor, MbaAccessor2);
    this._children[childName] = new AccessorNode(this, accessor);
};

RootAccessorNode.prototype.getChild = function(childName){
    checkType(childName, 'string');
    return this._children[childName];
};

RootAccessorNode.prototype.getChildren = function(){
    return this._children;
};


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
    checkType(accessor, MbaAccessor2);
    this._parent = parent;
    this._accessor = accessor;
    this._mbaNodes = [];
    RootAccessorNode.prototype.init.call(this);
};

AccessorNode.prototype.addMbaNodes = function(mbaNodes){
    checkTypeOrNull(mbaNodes, 'array', MbaNode2);
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




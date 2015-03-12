function MbaPropertyBindingNode(){
    this._propertyBinding;
    this._relativeAccesor;
    this._template;
}
MbaPropertyBindingNode.prototype = new MbaAccessorNode();
MbaPropertyBindingNode.prototype.constructor = MbaPropertyBindingNode;

MbaPropertyBindingNode.prototype.init = function(propertyBinding){
    checkType(propertyBinding, MbaPropertyBinding);
    MbaAccessorNode.prototype.init.call(this, propertyBinding);
    this._propertyBinding = propertyBinding;
    return this;
};

MbaAccessorBaseNode.prototype.instanciateNewNode = function(objectWithAccessor){
    return new MbaPropertyBindingNode().init(objectWithAccessor);
};

MbaPropertyBindingNode.prototype.getPropertyBinding = function(){
    return this._propertyBinding;
};

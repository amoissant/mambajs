function MbaPropertyBinding(){
    this._selector;
    this._modelAccessor;
    this._propertyAccessor;
    this._domTransformation;
    this._events;
}

MbaPropertyBinding.prototype.init = function(selector, memberChain, domTransformation, events){
    checkType(selector, 'string');
    checkType(memberChain, 'array', 'string');
    checkType(domTransformation, MbaTransf);
    checkType(events, 'array', 'string');
    this._selector = selector;
    this._domTransformation = domTransformation;
    this._events = events;
    this.initRelativePropertyAccessor(memberChain);
    this.initModelAccessor(memberChain);
    return this;
};

MbaPropertyBinding.prototype.initRelativePropertyAccessor = function(memberChain){
    checkType(memberChain, 'array', 'string');
    this._propertyAccessor = new MbaAccessor(memberChain[memberChain.length-1]);
};

MbaPropertyBinding.prototype.initModelAccessor = function(memberChain){
    checkType(memberChain, 'array', 'string');
    memberChain.pop();
    this._modelAccessor = new MbaAccessorChain2().initWithRootModelAccessorFromMemberChain(memberChain);
};

MbaPropertyBinding.prototype.applyBinding = function(domElement, model, route){
    checkType(domElement, 'domElement');
    checkType(route, MbaRoute2);
    var propertyValue = this.getPropertyValue(model);
    this._domTransformation.update2(domElement, route, propertyValue);
};

MbaPropertyBinding.prototype.getPropertyValue = function(model){
    var propertyValue = this._propertyAccessor.getModelValue(model);
    if(propertyValue instanceof Array)
        throw new MbaError(23, 'Received an array for model, user \'r00t\' directive to set what dom to repeat.');
    return propertyValue;
};

MbaPropertyBinding.prototype.getSelector = function(){
    return this._selector;
};

MbaPropertyBinding.prototype.getModelAccessor = function(){
    return this._modelAccessor;
};

MbaPropertyBinding.prototype.getPropertyAccessorString = function(){
    return this._modelAccessor.toString()+'.'+this._propertyAccessor.toString();
};

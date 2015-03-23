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
    this._propertyAccessor = new MbaAccessorChain2().initWithRootModelAccessorFromMemberChain(memberChain);
    this.initModelAccessor(memberChain);
    return this;
};

MbaPropertyBinding.prototype.initModelAccessor = function(memberChain){
    checkType(memberChain, 'array', 'string');
    memberChain.pop();
    this._modelAccessor = new MbaAccessorChain2().initWithRootModelAccessorFromMemberChain(memberChain);
};

MbaPropertyBinding.prototype.applyBinding = function(domElement, model, route){
    checkType(dom, 'domElement');
    checkType(route, 'array', 'string');
    this._domTransformation.update2(domElement, model, route);
};

MbaPropertyBinding.prototype.getSelector = function(){
    return this._selector;
};

MbaPropertyBinding.prototype.getModelAccessor = function(){
    return this._modelAccessor;
};

MbaPropertyBinding.prototype.getPropertyAccessor = function(){
    return this._propertyAccessor;
};

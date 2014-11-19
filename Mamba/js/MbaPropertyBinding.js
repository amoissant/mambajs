function MbaPropertyBinding(){
    this._selector;
    this._propertyAccessor;
    this._domTransformations;
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
    this._propertyAccessor = new MbaAccessorChain().init(memberChain);
    return this;
};

MbaPropertyBinding.prototype.getSelector = function(){
    return this._selector;
};

MbaPropertyBinding.prototype.getPropertyAccessor = function(){
    return this._propertyAccessor;
};
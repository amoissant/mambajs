function MbaBindingBase(){
    this._selector;
    this._modelAccessor;
    this._events;
}

MbaBindingBase.prototype.init = function(selector, memberChain, events){
    checkType(selector, 'string');
    checkType(memberChain, 'array', 'string');
    checkType(events, 'array', 'string');
    this._selector = selector;
    this._events = events;
    this.initModelAccessor(memberChain);
    return this;
};

MbaBindingBase.prototype.initModelAccessor = function(memberChain){
    checkType(memberChain, 'array', 'string');
    memberChain.pop();
    this._modelAccessor = new MbaAccessorChain2().initFromMemberChain(memberChain);
};

MbaBindingBase.prototype.getSelector = function(){
    return this._selector;
};

MbaBindingBase.prototype.getModelAccessor = function(){
    return this._modelAccessor;
};

MbaBindingBase.prototype.getEvents = function(){
    return this._events;
};

function MbaActionBinding2(){
    this._selector;
    this._actionAccessor;
    this._events;
}

MbaActionBinding2.prototype.init = function(selector, memberChain, events){
    checkType(selector, 'string');
    checkType(memberChain, 'array', 'string');
    checkType(events, 'array', 'string');
    this._selector = selector;
    this._events = events;
    this._actionAccessor = new MbaAccessorChain().initFromMemberChain(memberChain);
    return this;
};

MbaActionBinding2.prototype.getSelector = function(){
    return this._selector;
};

MbaActionBinding2.prototype.getActionAccessor = function(){
    return this._actionAccessor;
};
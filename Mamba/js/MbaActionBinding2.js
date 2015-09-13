function MbaActionBinding2(){
    this._selector;
    this._modelAccessor;
    this._action;
    this._events;
}

//TODO factoriser code avec MbaPropertyBinding
MbaActionBinding2.prototype.init = function(selector, memberChain, events){
    checkType(selector, 'string');
    checkType(memberChain, 'array', 'string');
    checkType(events, 'array', 'string');
    this._selector = selector;
    this._events = events;
    this.initAction(memberChain);
    this.initModelAccessor(memberChain);
    return this;
};

MbaActionBinding2.prototype.initAction = function(memberChain){
    checkType(memberChain, 'array', 'string');
    this._action = memberChain[memberChain.length-1];
};

MbaActionBinding2.prototype.initModelAccessor = function(memberChain){
    checkType(memberChain, 'array', 'string');
    memberChain.pop();
    this._modelAccessor = new MbaAccessorChain2().initFromMemberChain(memberChain);
};

MbaActionBinding2.prototype.getSelector = function(){
    return this._selector;
};

MbaActionBinding2.prototype.getModelAccessor = function(){
    return this._modelAccessor;
};

MbaActionBinding2.prototype.getAction = function(){
    return this._action;
};

MbaActionBinding2.prototype.getEvents = function(){
    return this._events;
};

MbaActionBinding2.prototype.getActionAccessorString = function(){
    return this._modelAccessor+'.'+this._action;
};

function MbaActionBinding2(){
    this._action;
}
MbaActionBinding2.prototype = new MbaBindingBase();
MbaActionBinding2.prototype.constructor = MbaActionBinding2;

MbaActionBinding2.prototype.init = function(selector, memberChain, events){
    checkType(selector, 'string');
    checkType(memberChain, 'array', 'string');
    checkType(events, 'array', 'string');
    this.initAction(memberChain);
    MbaBindingBase.prototype.init.call(this, selector, memberChain, events);
    return this;
};

MbaActionBinding2.prototype.initAction = function(memberChain){
    checkType(memberChain, 'array', 'string');
    this._action = memberChain[memberChain.length-1];
};

MbaActionBinding2.prototype.getAction = function(){
    return this._action;
};

MbaActionBinding2.prototype.getActionAccessorString = function(){
    return this._modelAccessor+'.'+this._action;
};

function MbaDomMultiplier(){
    this._selector;
    this._modelAccessor;
}

MbaDomMultiplier.prototype.init = function(memberChain, selector){
    checkType(memberChain, 'array', 'string');
    checkType(selector, 'string');
    this._selector = selector;
    this._modelAccessor = new MbaAccessorChain2().initWithRootModelAccessorFromMemberChain(memberChain);
    return this;
};

MbaDomMultiplier.prototype.getSelector = function(){
    return this._selector;
};

MbaDomMultiplier.prototype.getAccessorChain = function(){
    return this._modelAccessor;
};

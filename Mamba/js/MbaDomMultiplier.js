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

MbaDomMultiplier.prototype.modelAccessorHasSameRoot = function(other){
    checkType(other, MbaDomMultiplier);
    return this.getModelAccessor().hasSameRoot(other.getModelAccessor());
};

MbaDomMultiplier.prototype.getSelector = function(){
    return this._selector;
};

MbaDomMultiplier.prototype.getModelAccessor = function(){
    return this._modelAccessor;
};

MbaDomMultiplier.prototype.getModelAccessorSize = function(){
    return this._modelAccessor.getSize();
};

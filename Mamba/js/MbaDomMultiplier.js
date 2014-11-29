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

MbaDomMultiplier.prototype.compare = function(other){
    var modelAccessorSizeComparison = this.compareModelAccessorSize(other);
    if(modelAccessorSizeComparison != 0)
        return modelAccessorSizeComparison;
    else
        return this.compareModelAccessorId(other);
};

MbaDomMultiplier.prototype.compareModelAccessorSize = function(other){
    var thisModelAccessorSize = this.getModelAccessorSize();
    var otherModelAccessorSize = other.getModelAccessorSize();
    if(thisModelAccessorSize < otherModelAccessorSize)
        return -1;
    if(thisModelAccessorSize > otherModelAccessorSize)
        return 1;
    return 0;
};

MbaDomMultiplier.prototype.compareModelAccessorId = function(other){
    var thisModelAccessorId = this.getModelAccessorId();
    var otherModelAccessorId = other.getModelAccessorId();
    if(thisModelAccessorId < otherModelAccessorId)
        return -1;
    if(thisModelAccessorId > otherModelAccessorId)
        return 1;
    return 0;
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

MbaDomMultiplier.prototype.getModelAccessorId = function(){
    return this._modelAccessor.getId();
};
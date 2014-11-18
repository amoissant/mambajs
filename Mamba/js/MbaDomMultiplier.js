function MbaDomMultiplier(){
    this._selector;
    this._modelAccessor;
}

MbaDomMultiplier.prototype.init = function(memberChain, selector){
    this._selector = selector;
    this._modelAccessor = new MbaAccessorChain();
    this.fillModelAccessorWith(memberChain);
};

MbaDomMultiplier.prototype.fillModelAccessorWith = function(memberChain){
    for(var i=0 ; i<memberChain.length ; i++){
        var accessor = new MbaAccessor(memberChain[i]);
        this._modelAccessor.appendAccessor(accessor);
    }
};

MbaDomMultiplier.prototype.getSelector = function(){
    return this._selector;
};

MbaDomMultiplier.prototype.getModelAccessor = function(){
    return this._modelAccessor;
};
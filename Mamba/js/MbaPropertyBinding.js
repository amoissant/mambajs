function MbaPropertyBinding(){
    this._propertyAccessor;
    this._domTransformation;
}
MbaPropertyBinding.prototype = new MbaBindingBase();
MbaPropertyBinding.prototype.constructor = MbaPropertyBinding;


MbaPropertyBinding.prototype.init = function(selector, memberChain, domTransformation, events){
    checkType(selector, 'string');
    checkType(memberChain, 'array', 'string');
    checkType(domTransformation, MbaTransf);
    checkType(events, 'array', 'string');
    this._domTransformation = domTransformation;
    this.initRelativePropertyAccessor(memberChain);
    MbaBindingBase.prototype.init.call(this, selector, memberChain, events);
    return this;
};

MbaPropertyBinding.prototype.initRelativePropertyAccessor = function(memberChain){
    checkType(memberChain, 'array', 'string');
    this._propertyAccessor = new MbaAccessor(memberChain[memberChain.length-1]);
};

MbaPropertyBinding.prototype.getPropertyAccessor = function(){
    return this._propertyAccessor;
};

MbaPropertyBinding.prototype.getDomTransformation = function(){
    return this._domTransformation;
};

MbaPropertyBinding.prototype.getPropertyAccessorString = function(){
    return this._modelAccessor+'.'+this._propertyAccessor;
};

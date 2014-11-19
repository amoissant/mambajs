function MbaPropertyBindingParser(){
    this._memberChain;
    this._rawBinding;
    this._splittedBindings;
    this._propertyBindings;
}

MbaPropertyBindingParser.prototype.createPropertyBindings = function(memberChain, rawBinding){
    checkType(memberChain, 'array', 'string');
    checkType(rawBinding, 'string');
    this._memberChain = memberChain;
    this._rawBinding = rawBinding;
    this.splitRawBinding();
    return this.constructAllPropertyBindings();
};

MbaPropertyBindingParser.prototype.splitRawBinding = function(){
    var splitter = new MbaBindingSplitter();
    this._splittedBindings = splitter.splitRawBinding(this._rawBinding);
};

MbaPropertyBindingParser.prototype.constructAllPropertyBindings = function(){
    this._propertyBindings = [];
    for(var i=0 ; i<this._splittedBindings.length ; i++){
        var propertyBinding = this.constructPropertyBinding(this._splittedBindings[i]);
        this._propertyBindings.push(propertyBinding);
    }
    return this._propertyBindings;
};

MbaPropertyBindingParser.prototype.constructPropertyBinding = function(textBinding){
    checkType(textBinding, 'string');
    var memberChainCopy = this.copyMemberChain();
    var bindingParser = MBA_DI.get(MbaBindingParser);
    var propertyBinding = bindingParser.createPropertyBinding(textBinding, memberChainCopy);
    return propertyBinding;
};

MbaPropertyBindingParser.prototype.copyMemberChain = function(){
    return this._memberChain.slice();
};

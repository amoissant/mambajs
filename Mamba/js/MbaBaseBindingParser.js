function MbaBaseBindingParser(){
    this._memberChain;
    this._rawBinding;
    this._splittedBindings;
    this._bindings;
    this._bindingParser;
}

MbaBaseBindingParser.prototype.init = function (memberChain, rawBinding){
    checkType(memberChain, 'array', 'string');
    checkType(rawBinding, 'string');
    this._memberChain = memberChain;
    this._rawBinding = rawBinding;
};

MbaBaseBindingParser.prototype.splitRawBinding = function(){
    var splitter = new MbaBindingSplitter();
    this._splittedBindings = splitter.splitRawBinding(this._rawBinding);
};

MbaBaseBindingParser.prototype.constructAllBindings = function(){
    this.splitRawBinding();
    this._bindings = [];
    for(var i=0 ; i<this._splittedBindings.length ; i++){
        var binding = this.constructBinding(this._splittedBindings[i]);
        this._bindings.push(binding);
    }
    return this._bindings;
};

MbaBaseBindingParser.prototype.constructBinding = function(textBinding){
    checkType(textBinding, 'string');
    var memberChainCopy = this.copyMemberChain();
    this._bindingParser = MBA_DI.get(MbaTextBindingParser);
    this._bindingParser.parseTextBinding(textBinding);
    var binding = this.instanciateBinding(memberChainCopy);
    return binding;
};

MbaBaseBindingParser.prototype.instanciateBinding = function(memberChain){
    //abstract method
};
    
MbaBaseBindingParser.prototype.copyMemberChain = function(){
    return this._memberChain.slice();
};

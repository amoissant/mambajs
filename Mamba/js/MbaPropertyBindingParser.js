function MbaPropertyBindingParser(){   
}
MbaPropertyBindingParser.prototype = new MbaBaseBindingParser();
MbaPropertyBindingParser.prototype.constructor = MbaPropertyBindingParser;


MbaPropertyBindingParser.prototype.createPropertyBindings = function(memberChain, rawBinding){
    this.init(memberChain, rawBinding);
    return this.constructAllBindings();
};

MbaBaseBindingParser.prototype.instanciateBinding = function(textBinding, memberChain){
    return this._bindingParser.createPropertyBinding(textBinding, memberChain);
};

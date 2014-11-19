function MbaPropertyBindingParser(){   
}
MbaPropertyBindingParser.prototype = new MbaBaseBindingParser();
MbaPropertyBindingParser.prototype.constructor = MbaPropertyBindingParser;


MbaPropertyBindingParser.prototype.createPropertyBindings = function(memberChain, rawBinding){
    this.init(memberChain, rawBinding);
    return this.constructAllBindings();
};

MbaPropertyBindingParser.prototype.instanciateBinding = function(memberChain){
    var selector = this._bindingParser.getSelector();
    var domTransformation = this._bindingParser.getDomTransformation();
    var events = this._bindingParser.getEvents();
    return new MbaPropertyBinding().init(selector, memberChain, domTransformation, events);
};

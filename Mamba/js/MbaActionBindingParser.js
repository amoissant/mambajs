function MbaActionBindingParser(){//TODO factoriser code avec MbaPropertyBindingParser
    this._memberChain;
    this._rawBinding;
    this._splittedBindings;
    this._actionBindings;
    this._lastMember;
    this._modelAction;
}

MbaActionBindingParser.prototype.accepts = function(memberChain, rawBinding){
    checkType(memberChain, 'array', 'string');
    checkType(rawBinding, 'string');
    this._memberChain = memberChain;
    this._rawBinding = rawBinding;
    return this.lastMemberIsAction();
};

MbaActionBindingParser.prototype.createActionsBindings = function(){
    this.splitRawBinding();
    return this.constructAllActionBindings();
};


MbaActionBindingParser.prototype.splitRawBinding = function(){
    var splitter = new MbaBindingSplitter();
    this._splittedBindings = splitter.splitRawBinding(this._rawBinding);
};

MbaActionBindingParser.prototype.constructAllActionBindings = function(){
    this._actionBindings = [];
    this.computeModelAction();
    for(var i=0 ; i<this._splittedBindings.length ; i++){
        var actionBinding = this.constructActionBinding(this._splittedBindings[i]);
        this._actionBindings.push(actionBinding);
    }
    return this._actionBindings;
};

MbaActionBindingParser.prototype.constructActionBinding = function(textBinding){
    checkType(textBinding, 'string');
    var memberChainCopy = this.copyMemberChain();
    memberChainCopy = this.replaceLastMemberByModelAction(memberChainCopy);
    var bindingParser = MBA_DI.get(MbaBindingParser);
    var actionBinding = bindingParser.createActionBinding(textBinding, memberChainCopy);
    return actionBinding;
};

MbaActionBindingParser.prototype.copyMemberChain = function(){
    return this._memberChain.slice();
};

MbaActionBindingParser.prototype.computeModelAction = function(){
    this._modelAction = this._lastMember.substring(1);
};

MbaActionBindingParser.prototype.replaceLastMemberByModelAction = function(memberChain){
    memberChain[memberChain.length-1] = this._modelAction;    
    return memberChain;
};

MbaActionBindingParser.prototype.lastMemberIsAction = function(){
    this._lastMember = this._memberChain[this._memberChain.length-1];
    return this._lastMember.indexOf('/') == 0;
};


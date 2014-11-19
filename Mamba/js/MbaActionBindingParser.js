function MbaActionBindingParser(){
    this._lastMember;
    this._modelAction;
}
MbaActionBindingParser.prototype = new MbaBaseBindingParser();
MbaActionBindingParser.prototype.constructor = MbaActionBindingParser;

MbaActionBindingParser.prototype.accepts = function(memberChain, rawBinding){
    this.init(memberChain, rawBinding);
    return this.lastMemberIsAction();
};

MbaActionBindingParser.prototype.createActionsBindings = function(){
    this.computeModelAction();
    return this.constructAllBindings();
};

MbaActionBindingParser.prototype.instanciateBinding = function(textBinding, memberChain){
    memberChain = this.replaceLastMemberByModelAction(memberChain);
    return this._bindingParser.createActionBinding(textBinding, memberChain);
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


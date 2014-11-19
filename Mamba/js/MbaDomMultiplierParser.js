function MbaDomMultiplierParser(){
    this._memberChain;
    this._selector;
}

MbaDomMultiplierParser.prototype.accepts = function(memberChain, memberValue){
    checkType(memberChain, 'array', 'string');
    checkType(memberValue, 'string');
    this._memberChain = memberChain;
    this._selector = memberValue;
    return this.lastMemberIsRoot();
};

MbaDomMultiplierParser.prototype.lastMemberIsRoot = function(){
    return this._memberChain[this._memberChain.length-1] == MBA_CST.ROOT;
};

MbaDomMultiplierParser.prototype.createDomMultiplier = function(){
    var memberChainCopy = this.copyWithoutLastMember(this._memberChain);
    var domMultiplier = new MbaDomMultiplier().init(memberChainCopy, this._selector);
    return domMultiplier;
};

MbaDomMultiplierParser.prototype.copyWithoutLastMember = function(memberChain){
    checkType(memberChain, 'array', 'string');
    return memberChain.slice(0, memberChain.length-1);
};

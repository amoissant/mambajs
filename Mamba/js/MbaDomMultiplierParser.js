function MbaDomMultiplierParser(){
    this._domMultipliers;
}

MbaDomMultiplierParser.prototype.init = function(){
    this._domMultipliers = [];
};

MbaDomMultiplierParser.prototype.parseMemberChainAndValue = function(memberChain, memberValue){
    checkType(memberChain, Array);
    if(this.lastMemberIsRoot(memberChain))
        this.createDomMultiplier(memberChain, memberValue);
};

MbaDomMultiplierParser.prototype.lastMemberIsRoot = function(memberChain){
    return memberChain[memberChain.length-1] == MBA_CST.ROOT;
};

MbaDomMultiplierParser.prototype.createDomMultiplier = function(memberChain, selector){
    var memberChainCopy = this.copyWithoutLastMember(memberChain);
    var domMultiplier = new MbaDomMultiplier();
    domMultiplier.init(memberChainCopy, selector);
    this._domMultipliers.push(domMultiplier);
};

MbaDomMultiplierParser.prototype.copyWithoutLastMember = function(memberChain){
    return memberChain.slice(0, memberChain.length-1);
};

MbaDomMultiplierParser.prototype.getDomMultipliers = function(){
    return this._domMultipliers;
};
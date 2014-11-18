function MbaDirectiveParser(){
    this._domMultipliers;
    this._memberChain;
    this._memberValue;
    this._parsers;
    this._domMultiplierParser;
}

MbaDirectiveParser.prototype.parse = function(directive){
    this._memberChain = [];
    this.createParsers();
    this.initParsers();
    this.inspectDirective(directive);
    this.retrieveResults();
};

MbaDirectiveParser.prototype.createParsers = function(){
    this._parsers = [];
    this._domMultiplierParser = new MbaDomMultiplierParser();
    this._parsers.push(this._domMultiplierParser);
};

MbaDirectiveParser.prototype.initParsers = function(){
    for(var i=0 ; i<this._parsers.length ; i++){
        this._parsers[i].init();
    }
};

MbaDirectiveParser.prototype.inspectDirective = function(directive){
    for(var member in directive){
        this._memberValue = directive[member];
        this._memberChain.push(member);
        this.inspectModelValue();
        this._memberChain.pop();
    }
};

MbaDirectiveParser.prototype.inspectModelValue = function(){
    if(this.memberValueIsSubDirective())
        this.inspectDirective(this._memberValue);
    else if (this.memberValueIsArraySubDirective())
        this.inspectDirectiveArray(this._memberValue);
    else
        this.runParsers(this._memberChain, this._memberValue);
};

MbaDirectiveParser.prototype.runParsers = function(){
    for(var i=0 ; i<this._parsers.length ; i++){
        this._parsers[i].parseMemberChainAndValue(this._memberChain, this._memberValue);
    }
};

MbaDirectiveParser.prototype.inspectDirectiveArray = function(directiveArray){
    for(var i=0 ; i<directiveArray.length ; i++){
        this.inspectDirective(directiveArray[i]);
    }
};

MbaDirectiveParser.prototype.memberValueIsSubDirective = function(){
    return this._memberValue instanceof Object && !(this._memberValue instanceof Array);
};

MbaDirectiveParser.prototype.memberValueIsArraySubDirective = function(){
    return this._memberValue instanceof Array;
};

MbaDirectiveParser.prototype.retrieveResults = function(){
  this._domMultipliers = this._domMultiplierParser.getDomMultipliers();  
};

MbaDirectiveParser.prototype.getDomMultipliers = function(){
    return this._domMultipliers;
};
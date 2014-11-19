function MbaDirectiveParser(){
    this._domMultiplierParser;
    this._propertyBindingParser;
    this._actionBindingParser;
    this._memberChain;
    this._memberValue;
    this._domMultipliers;
    this._propertyBindings;    
}

MbaDirectiveParser.prototype.parse = function(directive){
    this._memberChain = [];
    this._domMultipliers = [];
    this._propertyBindings = [];
    this._actionBindings = [];
    this.createParsers();
    this.inspectDirective(directive);
};

MbaDirectiveParser.prototype.createParsers = function(){
    this._domMultiplierParser = new MbaDomMultiplierParser();
    this._propertyBindingParser = new MbaPropertyBindingParser();
    this._actionBindingParser = new MbaActionBindingParser();
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
    if(this._domMultiplierParser.accepts(this._memberChain, this._memberValue)){
        var domMultiplier = this._domMultiplierParser.createDomMultiplier();
        this._domMultipliers.push(domMultiplier);
    }
    else if(this._actionBindingParser.accepts(this._memberChain, this._memberValue)){
        var actionBindings  = this._actionBindingParser.createActionsBindings();
        PushAll(actionBindings).into(this._actionBindings);
    }
    else {
        var propertyBindings = this._propertyBindingParser.createPropertyBindings(this._memberChain, this._memberValue);
        PushAll(propertyBindings).into(this._propertyBindings);
    }
};

MbaDirectiveParser.prototype.inspectDirectiveArray = function(directiveArray){
    checkType(directiveArray, Array);
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

MbaDirectiveParser.prototype.getDomMultipliers = function(){
    return this._domMultipliers;
};

MbaDirectiveParser.prototype.getPropertyBindings = function(){
    return this._propertyBindings;
};

MbaDirectiveParser.prototype.getActionBindings = function(){
    return this._actionBindings;
};


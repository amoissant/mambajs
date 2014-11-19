function MbaManager(){
    this._domMultipliers;
    this._propertyBindings;
    this._actionBindings;
}


MbaManager.prototype.parseDirective = function(directive){
    var directiveParseur = new MbaDirectiveParser(directive);
    directiveParseur.parse(directive);
    this._domMultipliers = directiveParseur.getDomMultipliers();
    this._propertyBindings = directiveParseur.getPropertyBindings();
    this._actionBindings = directiveParseur.getActionBindings();  
};

MbaManager.prototype.getDomMultipliers = function(){
    return this._domMultipliers;    
};

MbaManager.prototype.getPropertyBindings = function(){
    return this._propertyBindings;
};

MbaManager.prototype.getActionBindings = function(){
    return this._actionBindings;
};

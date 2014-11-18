function MbaManager(){
    this._domMultipliers;
    this._propertyBindings;
    this._actionBindings;
}

MbaManager.prototype.getDomMultipliers = function(){
    return this._domMultipliers;
    
};

MbaManager.prototype.parseDirective = function(directive){
    var directiveParseur = new MbaDirectiveParser(directive);
    directiveParseur.parse(directive);
    this._domMultipliers = directiveParseur.getDomMultipliers();
    //this._propertyBindings = directiveParseur.getPropertyBindings();
    //this._actionBindings = directiveParseur.getActionBindings();
    
    //un DirectiveParseur qui contient les autres : new DirectiveParseur(directive);
    //un parseur pour les domMultiplier -> new DomMultiplierParser();
    //un parseur pour les propertyBindings -> new PropertyBindingParser();
    //un parseur pour les actionBindings -> new ActionBindingparser();
    //parcourir la directive et appliquer les parseurs sur chaque élément
    
};
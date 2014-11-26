function MbaManager(){
    this._domMultipliers;
    this._propertyBindings;
    this._actionBindings;
    this._domMultiplierTree;
    this._template;
}


MbaManager.prototype.parseDirective = function(directive){
    var directiveParseur = new MbaDirectiveParser(directive);
    directiveParseur.parse(directive);
    this._domMultipliers = directiveParseur.getDomMultipliers();
    this._propertyBindings = directiveParseur.getPropertyBindings();
    this._actionBindings = directiveParseur.getActionBindings();  
};

MbaManager.prototype.sortDomMultipliers = function(){
    var compareDomMultipliersFunction = this.getDomMultipliersCompareFunction();
    this._domMultipliers.sort(compareDomMultipliersFunction);
};

MbaManager.prototype.getDomMultipliersCompareFunction = function(){
    return function(firstDomMultiplier, secondDomMultiplier){
        return firstDomMultiplier.compare(secondDomMultiplier);
    };
};

MbaManager.prototype.createDomMultiplierTree = function(){
    this.sortDomMultipliers();
    this._domMultiplierTree = new MbaDomMultiplierTree().init();
    this.constructDomMultiplierTree();
};

MbaManager.prototype.constructDomMultiplierTree = function(){
    for(var i=0 ; i<this._domMultipliers.length ; i++){
        this._domMultiplierTree.addNodeForDomMultiplier(this._domMultipliers[i]);
    }
    this._domMultiplierTree.initAllRelativeAccessors();
};

MbaManager.prototype.linkDomMultiplierTreeToTemplate = function(){
    this._domMultiplierTree.linkToTemplate(this._template);
};

MbaManager.prototype.setTemplate = function(template){
    checkType(template, MbaDom);
    var domMultipliersSelectors = this.getDomMultipliersSelectors();
    this._template = new MbaTemplate2().init(template, domMultipliersSelectors);
};

MbaManager.prototype.getDomMultipliersSelectors = function(){
    var domMultipliersSelectors = [];
    for(var i=0 ; i<this._domMultipliers.length ; i++){
        domMultipliersSelectors.push(this._domMultipliers[i].getSelector());
    }
    return domMultipliersSelectors;
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

MbaManager.prototype.getDomMultiplierTree = function(){
    return this._domMultiplierTree;
};
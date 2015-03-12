function MbaManager(){
    this._domMultipliers;
    this._propertyBindings;
    this._actionBindings;
    this._domMultiplierTree;
    this._propertyBindingTree;
    this._template;
}

MbaManager.prototype.init = function(template, directive){
    checkType(template, MbaDom);
    this.parseDirective(directive);
    this.createDomMultiplierTree();
    this.setTemplate(template);
    this.linkDomMultiplierTreeToTemplate();
    return this;
};

MbaManager.prototype.parseDirective = function(directive){
    var directiveParseur = new MbaDirectiveParser(directive);
    directiveParseur.parse(directive);
    this._domMultipliers = directiveParseur.getDomMultipliers();
    this._propertyBindings = directiveParseur.getPropertyBindings();
    this._actionBindings = directiveParseur.getActionBindings();  
};

MbaManager.prototype.createDomMultiplierTree = function(){
    this.sortDomMultipliers();
    this._domMultiplierTree = new MbaDomMultiplierTree().init();
    this.constructDomMultiplierTree();
};

MbaManager.prototype.sortDomMultipliers = function(){
    var compareDomMultipliersFunction = this.getAccessorChainCompareFunction('getModelAccessor');
    this._domMultipliers.sort(compareDomMultipliersFunction);
};

//TODO factoriser les fonctions de sort
MbaManager.prototype.sortPropertyBindings = function(){
    var comparePropertyBindingsFunction = this.getAccessorChainCompareFunction('getAccessorChain');
    this._propertyBindings.sort(comparePropertyBindingsFunction);
};

MbaManager.prototype.getAccessorChainCompareFunction = function(getterName){
    return function(first, second){
        return first[getterName]().compare(second[getterName]());
    };
};

MbaManager.prototype.constructDomMultiplierTree = function(){
    for(var i=0 ; i<this._domMultipliers.length ; i++){
        this._domMultiplierTree.addNodeFromDomMultiplier(this._domMultipliers[i]);
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

//TODO factoriser code avec domMultiplierTree
MbaManager.prototype.createPropertyBindingTree = function(){
    this.sortPropertyBindings();
    this._propertyBindingTree = new MbaPropertyBindingTree().init();
    this.constructPropertyBindingTree();
};

MbaManager.prototype.constructPropertyBindingTree = function(){
    for(var i=0 ; i<this._propertyBindings.length ; i++){
        this._propertyBindingTree.addNodeFrom(this._propertyBindings[i]);
    }
    this._propertyBindingTree.initAllRelativeAccessors();
};

MbaManager.prototype.render = function(model){
    if(!this._template.isReadyToRender())
        this._template.initRenderedDom();
    this._domMultiplierTree.updateDomForModel(model);
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

MbaManager.prototype.getPropertyBindingTree = function(){
    return this._propertyBindingTree;
};

MbaManager.prototype.getRenderedDom = function(){
    return this._template.getRenderedDom();
};
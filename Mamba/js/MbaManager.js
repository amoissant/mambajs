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
    this.createPropertyBindingTree();
    this.setTemplate(template);
    this.linkDomMultiplierTreeToTemplate();
    this.linkPropertyBindingTreeToTemplate();
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
    this._domMultiplierTree = new MbaDomMultiplierTree().init();
    this.constructAccessorTree(this._domMultipliers, this._domMultiplierTree);
};

MbaManager.prototype.constructAccessorTree = function(objectWithAccessorArray, tree){
    objectWithAccessorArray.sort(this.getAccessorChainCompareFunction());
    for(var i=0 ; i<objectWithAccessorArray.length ; i++){
        tree.addNodeFrom(objectWithAccessorArray[i]);
    }
    tree.initAllRelativeAccessors();
};

MbaManager.prototype.getAccessorChainCompareFunction = function(){
    return function(first, second){
        return first.getAccessorChain().compare(second.getAccessorChain());
    };
};

MbaManager.prototype.constructDomMultiplierTree = function(){
    this.constructAccessorTree(this._domMultipliers, this._domMultiplierTree);
};

MbaManager.prototype.linkDomMultiplierTreeToTemplate = function(){
    this._domMultiplierTree.linkToTemplate(this._template);
};

MbaManager.prototype.linkPropertyBindingTreeToTemplate = function(){
    this._propertyBindingTree.linkToTemplate(this._template);
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

MbaManager.prototype.createPropertyBindingTree = function(){
    this._propertyBindingTree = new MbaPropertyBindingTree().init();
    this.constructAccessorTree(this._propertyBindings, this._propertyBindingTree);
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
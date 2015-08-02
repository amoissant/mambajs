function MbaManager(){
    this._domMultipliers;
    this._propertyBindings;
    this._actionBindings;
    this._domMultiplierTree;
    this._bindingTree;
    this._template;
    this._model;
    this._rootDirectiveIsForArrayModel;
}

MbaManager.prototype.init = function(template, directive){
    checkType(template, MbaDom);
    this.setRootDirectiveIsForArray(directive);
    this.parseDirective(directive);
    this.createDomMultiplierTree();
    this.createBindingTree();
    this.addActionBindingsToBindingTree();
    this.setTemplate(template);
    this.linkDomMultiplierTreeToTemplate();
    this.linkBindingTreeToTemplate();
    return this;
};

MbaManager.prototype.setRootDirectiveIsForArray = function(directive){
    this._rootDirectiveIsForArrayModel = directive[MBA_CST.ROOT] != null;
};

MbaManager.prototype.parseDirective = function(directive){
    var directiveParseur = new MbaDirectiveParser(directive);
    directiveParseur.parse(directive);
    this._domMultipliers = directiveParseur.getDomMultipliers();
    this._propertyBindings = directiveParseur.getPropertyBindings();
    this._actionBindings = directiveParseur.getActionBindings();  
};

MbaManager.prototype.createDomMultiplierTree = function(){
    this._domMultiplierTree = new MbaDomMultiplierTree().init(this._rootDirectiveIsForArrayModel);
    this.constructAccessorTree(this._domMultipliers, this._domMultiplierTree);
};

MbaManager.prototype.constructAccessorTree = function(objectWithAccessorArray, tree){
    objectWithAccessorArray.sort(this.getModelAccessorCompareFunction());
    for(var i=0 ; i<objectWithAccessorArray.length ; i++){
        tree.addNodeFrom(objectWithAccessorArray[i]);
    }
    tree.initAllRelativeAccessors();
};

MbaManager.prototype.getModelAccessorCompareFunction = function(){
    return function(first, second){
        return first.getModelAccessor().compare(second.getModelAccessor());
    };
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

MbaManager.prototype.createBindingTree = function(){
    this._bindingTree = new MbaBindingTree().init(true);//TODO ne pas laisser cette constante
    this.constructAccessorTree(this._propertyBindings, this._bindingTree);    
};

MbaManager.prototype.addActionBindingsToBindingTree = function(){
    this.constructAccessorTree(this._actionBindings, this._bindingTree);    
};

MbaManager.prototype.linkDomMultiplierTreeToTemplate = function(){
    this._domMultiplierTree.linkToTemplate(this._template);
};

MbaManager.prototype.linkBindingTreeToTemplate = function(){
    this._bindingTree.linkToTemplate(this._template);
};

MbaManager.prototype.render = function(model){
    if(!this._template.isReadyToRender())
        this._template.initRenderedDom();
    this._model = model;
    this._domMultiplierTree.updateDomForModel(model);
    this._bindingTree.applyBindingsForModel(model);
};

MbaManager.prototype.refresh = function(){
    var baseAccessorChain = new MbaAccessorChain2().initWithRootModelAccessorFromMemberChain([]);
    var baseRoute = new MbaRoute2().initFromAccessorAndIndexes(baseAccessorChain, [undefined])
    this.refreshForRoute(baseRoute);
};

MbaManager.prototype.refreshForRoute = function(route){
    checkType(route, MbaRoute2);
    var routeIndexes = route.getIndexes();
    this._domMultiplierTree.findAndRefresh(this._model, route.clone(), routeIndexes);
    this._bindingTree.findAndRefresh(this._model, route.clone(), routeIndexes);
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

MbaManager.prototype.getBindingTree = function(){
    return this._bindingTree;
};

MbaManager.prototype.getRenderedDom = function(){
    return this._template.getRenderedDom();
};
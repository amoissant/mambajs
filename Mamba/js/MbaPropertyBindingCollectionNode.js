function MbaPropertyBindingCollectionNode(){
    this._propertyBindingNodeCollection;
    this._targetDomElementIds;
    this._propertyAccessor;
}
MbaPropertyBindingCollectionNode.prototype = new MbaAccessorNode();
MbaPropertyBindingCollectionNode.prototype.constructor = MbaPropertyBindingCollectionNode;

MbaPropertyBindingCollectionNode.prototype.init = function(propertyBinding){
    checkType(propertyBinding, MbaPropertyBinding);
    MbaAccessorNode.prototype.init.call(this, propertyBinding);
    this._propertyBindingNodeCollection = [];
    this.addPropertyBindingNode(propertyBinding);
    this._propertyAccessor = propertyBinding.getPropertyAccessor();
    return this;
};

MbaPropertyBindingCollectionNode.prototype.addPropertyBindingNode = function(propertyBinding){
    checkType(propertyBinding, MbaPropertyBinding);
    var propertyBindingNode = new MbaPropertyBindingNode().init(propertyBinding);
    this._propertyBindingNodeCollection.push(propertyBindingNode);
};
    
MbaPropertyBindingCollectionNode.prototype.instanciateNewNode = function(propertyBinding){
    checkType(propertyBinding, MbaPropertyBinding);
    return new MbaPropertyBindingCollectionNode().init(propertyBinding);
};

MbaPropertyBindingCollectionNode.prototype.onLinkToTemplate = function(){
    for(var i=0 ; i< this._propertyBindingNodeCollection.length ; i++){
        var currentPropertyBindingNode = this._propertyBindingNodeCollection[i];
        currentPropertyBindingNode.setTemplate(this._template);
        currentPropertyBindingNode.computeTargetDomElementIds();
    }
};

MbaPropertyBindingCollectionNode.prototype.onAccessorEquals = function(propertyBinding){
    checkType(propertyBinding, MbaPropertyBinding);
    this.addPropertyBindingNode(propertyBinding);
};

MbaPropertyBindingCollectionNode.prototype.applyBindingsForModelWithIndexes = function(parentModel, parentIndexes){
    checkType(parentIndexes, Array);
    this.setModelAndRoute(parentModel, parentIndexes);
    if(this._model instanceof Array)
        this.applyPropertyBindingsForEachModel();        
    else
        this.applyPropertyBindings();
};

MbaPropertyBindingCollectionNode.prototype.applyPropertyBindingsForEachModel = function(){
    //TODO ici on se sert juste de modelRoute comme clé pour previousModelSize, on peut optimiser en evitant le clone
    this._modelRoute = this._modelRoute.clone();
    var modelArray = this._model;
    for(var i=0 ; i<modelArray.length ; i++){
        this._modelRoute.setLastIndex(i);
        this._model = modelArray[i];
        this.applyPropertyBindings();
        this.askChildrenApplyPropertyBindings();
    }
};

MbaPropertyBindingCollectionNode.prototype.applyPropertyBindings = function(){
    for(var i=0 ; i< this._propertyBindingNodeCollection.length ; i++)
        this._propertyBindingNodeCollection[i].applyBindingForModelAndRoute(this._model, this._modelRoute);
};

MbaPropertyBindingCollectionNode.prototype.askChildrenApplyPropertyBindings = function(){
    var indexes = this._modelRoute.getIndexes();
    for(var i=0 ; i<this._childNodes.length ; i++){
        var currentChild = this._childNodes[i];
        currentChild.applyBindingsForModelWithIndexes(this._model, indexes);
    }
};

MbaPropertyBindingCollectionNode.prototype.getPropertyBindings = function(){
    return this._propertyBindingNodeCollection;
};

MbaPropertyBindingCollectionNode.prototype.getPropertyAccessorString = function(){
    return this._objectWithAccessor.getModelAccessor()+'.'+this._propertyAccessor;
};



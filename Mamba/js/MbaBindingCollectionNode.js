function MbaBindingCollectionNode(){
    this._bindingNodeCollection;
    this._targetDomElementIds;
}
MbaBindingCollectionNode.prototype = new MbaAccessorNode();
MbaBindingCollectionNode.prototype.constructor = MbaBindingCollectionNode;
    
MbaBindingCollectionNode.prototype.instanciateNewNode = function(binding){
    return new MbaBindingCollectionNode().init(binding, this._manager);
};

MbaBindingCollectionNode.prototype.init = function(binding, manager){
    checkType(manager, MbaManager);
    MbaAccessorNode.prototype.init.call(this, binding, manager);
    this._bindingNodeCollection = [];
    this.addBindingNode(binding);
    return this;
};

MbaBindingCollectionNode.prototype.addBindingNode = function(binding){
    switch(binding.constructor){
        case MbaPropertyBinding :
            this.addPropertyBindingNode(binding);
            break;
        case MbaActionBinding2 :
            this.addActionBindingNode(binding);
            break;
        default : 
            throw new Error('Not implemented for '+binding.constructor.name);
    }
};

MbaBindingCollectionNode.prototype.addPropertyBindingNode = function(propertyBinding){
    checkType(propertyBinding, MbaPropertyBinding);
    var propertyBindingNode = new MbaPropertyBindingNode().init(propertyBinding, this._manager);
    this._bindingNodeCollection.push(propertyBindingNode);
};

MbaBindingCollectionNode.prototype.addActionBindingNode = function(actionBinding){
    checkType(actionBinding, MbaActionBinding2);
    var actionBindingNode = new MbaActionBindingNode().init(actionBinding, this._manager);
    this._bindingNodeCollection.push(actionBindingNode);
};

MbaBindingCollectionNode.prototype.onLinkToTemplate = function(){
    for(var i=0 ; i< this._bindingNodeCollection.length ; i++){
        var currentPropertyBindingNode = this._bindingNodeCollection[i];
        currentPropertyBindingNode.setTemplate(this._template);
        currentPropertyBindingNode.computeTargetDomElementIds();
    }
};

MbaBindingCollectionNode.prototype.onAccessorEquals = MbaBindingCollectionNode.prototype.addBindingNode;

MbaBindingCollectionNode.prototype.applyBindingsForModelWithIndexes = function(parentModel, parentIndexes){
    checkType(parentIndexes, Array);
    this.setModelAndRoute(parentModel, parentIndexes);
    this.applyBindings();
};

MbaBindingCollectionNode.prototype.applyBindings = function(){
    if(this._model instanceof Array)
        this.applyBindingsForEachModel();        
    else if(this._model != null)
        this.applyBindingsForOneModel();
};

MbaBindingCollectionNode.prototype.applyBindingsForEachModel = function(){
    var modelArray = this._model;
    for(var i=0 ; i<modelArray.length ; i++){
        this._modelRoute.setLastIndex(i);
        this._model = modelArray[i];
        this.applyBindingsForOneModel();
    }
};

MbaBindingCollectionNode.prototype.applyBindingsForOneModel = function(){
    for(var i=0 ; i< this._bindingNodeCollection.length ; i++)
        this._bindingNodeCollection[i].applyBindingForModelAndRoute(this._model, this._modelRoute);
    this.askChildrenApplyBindings();
};

MbaBindingCollectionNode.prototype.askChildrenApplyBindings = function(){
    var indexes = this._modelRoute.getIndexes();
    for(var i=0 ; i<this._childNodes.length ; i++){
        var currentChild = this._childNodes[i];
        currentChild.applyBindingsForModelWithIndexes(this._model, indexes);
    }
};

MbaBindingCollectionNode.prototype.refresh = MbaBindingCollectionNode.prototype.applyBindings;

MbaBindingCollectionNode.prototype.getBindings = function(){
    return this._bindingNodeCollection;
};

MbaBindingCollectionNode.prototype.getModelAccessor = function(){
    return this._objectWithAccessor.getModelAccessor();
};



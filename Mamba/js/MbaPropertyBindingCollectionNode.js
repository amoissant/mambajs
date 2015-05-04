function MbaPropertyBindingCollectionNode(){
    this._propertyBindingCollection;
    this._targetDomElementIds;
}
MbaPropertyBindingCollectionNode.prototype = new MbaAccessorNode();
MbaPropertyBindingCollectionNode.prototype.constructor = MbaPropertyBindingCollectionNode;

MbaPropertyBindingCollectionNode.prototype.init = function(propertyBinding){
    checkType(propertyBinding, MbaPropertyBinding);
    MbaAccessorNode.prototype.init.call(this, propertyBinding);
    this._propertyBindingCollection = [];
    this._propertyBindingCollection.push(new MbaPropertyBindingNode().init(propertyBinding));
    //TODO  peut etre ne pas avoir MbaPropertyBindingNode contenant un propertyBinding mais un seul objet
    return this;
};

MbaPropertyBindingCollectionNode.prototype.instanciateNewNode = function(propertyBinding){
    checkType(propertyBinding, MbaPropertyBinding);
    return new MbaPropertyBindingCollectionNode().init(propertyBinding);
};

MbaPropertyBindingCollectionNode.prototype.onLinkToTemplate = function(){
    for(var i=0 ; i< this._propertyBindingCollection.length ; i++){
        var currentPropertyBindingNode = this._propertyBindingCollection[i];
        currentPropertyBindingNode.setTemplate(this._template);
        currentPropertyBindingNode.computeTargetDomElementIds();
    }
};

MbaPropertyBindingCollectionNode.prototype.onAccessorEquals = function(otherWithAccessor){
    console.log('accessors are equals');
};

//TODO factoriser code avec MbaDomMultiplierNode
MbaPropertyBindingCollectionNode.prototype.applyBindingsForModelWithIndexes = function(parentModel, parentIndexes){
    checkType(parentIndexes, Array);
    this.setModelAndRoute(parentModel, parentIndexes);
    /*if(this._model instanceof Array){//TODO à tester
        this._modelRoute = this._modelRoute.clone();
        //TODO ici on se sert juste de modelArrayRoute comme clé pour previousModelSize, on peut optimiser en evitant le clone
        this.applyBindingsForEachModel();        
    }
    else{*/
        this.applyPropertyBindings();
    //}
};

/*MbaPropertyBindingNode.prototype.applyBindingsForEachModel = function(){
     for(var i=0 ; i<this._modelArray.length ; i++){
        this._modelRoute.setLastIndex(i);
        this.applyBindingsForEachTarget();
        this.askChildrenApplyBindingsForModel(this._modelArray[i]);
    }
};*/

MbaPropertyBindingCollectionNode.prototype.applyPropertyBindings = function(){
    for(var i=0 ; i< this._propertyBindingCollection.length ; i++)
        this._propertyBindingCollection[i].applyBindingForModelAndRoute(this._model, this._modelRoute);
     
    /*for(var i=0 ; i<this._targetDomElementIds.length; i++){
        var currentDomElementId = this._targetDomElementIds[i];
        var templateNode = this._template.getTemplateNodeForDomId(currentDomElementId);
        var domElement = templateNode.getDomElementForRoute(this._modelRoute);
        this._propertyBinding.applyBinding(domElement, this._model, this._modelRoute);
    }*/    
};

/*MbaPropertyBindingCollectionNode.prototype.askChildrenApplyBindingsForModel = function(model){
    var indexes = this._modelRoute.getIndexes();
    for(var i=0 ; i<this._childNodes.length ; i++){
        var currentChild = this._childNodes[i];
        currentChild.applyBindingsForModelWithIndexes(model, indexes);
    }
};*/

MbaPropertyBindingCollectionNode.prototype.getPropertyBindings = function(){
    return this._propertyBindingCollection;
};



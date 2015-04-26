function MbaPropertyBindingNode(){
    this._propertyBinding;
    this._targetDomElementIds;
    this._modelRoute;
    this._modelArray;
    this._modelArrayRoute;
}
MbaPropertyBindingNode.prototype = new MbaAccessorNode();
MbaPropertyBindingNode.prototype.constructor = MbaPropertyBindingNode;

MbaPropertyBindingNode.prototype.init = function(propertyBinding){
    checkType(propertyBinding, MbaPropertyBinding);
    MbaAccessorNode.prototype.init.call(this, propertyBinding);
    this._propertyBinding = propertyBinding;
    //TODO factoriser code avec MbaDomMultiplierNode
    this._modelRoute = new MbaRoute2().initFromAccessor(propertyBinding.getModelAccessor());
    return this;
};

MbaPropertyBindingNode.prototype.instanciateNewNode = function(propertyBinding){
    checkType(propertyBinding, MbaPropertyBinding);
    return new MbaPropertyBindingNode().init(propertyBinding);
};

MbaPropertyBindingNode.prototype.onLinkToTemplate = function(){
    this.computeTargetDomElementIds();
};

MbaPropertyBindingNode.prototype.computeTargetDomElementIds = function(){
    var targetDomElements = this._template.findForSelector(this._propertyBinding.getSelector());
    this._targetDomElementIds = [];
    for(var i=0 ; i<targetDomElements.length ; i++){
        this._targetDomElementIds.push(targetDomElements[i]._mbaId);
    }
};

//TODO factoriser code avec MbaDomMultiplierNode
MbaPropertyBindingNode.prototype.applyBindingsForModelWithIndexes = function(parentModel, parentIndexes){
    checkType(parentIndexes, Array);
    this.setModelAndRoute(parentModel, parentIndexes);
    /*if(this._model instanceof Array){//TODO à tester
        this._modelArrayRoute = this._modelRoute.clone();
        //TODO ici on se sert juste de modelArrayRoute comme clé pour previousModelSize, on peut optimiser en evitant le clone
        this.applyBindingsForEachModel();        
    }
    else{*/
        this.applyBindingsForEachTarget();
    //}
};

MbaPropertyBindingNode.prototype.setModelAndRoute = function(parentModel, parentIndexes){
    this._modelRoute.copyIndexes(parentIndexes);
    this._model = this._relativeAccessor.getSubModelAndUpdateRoute(parentModel, this._modelRoute);
};

/*MbaPropertyBindingNode.prototype.applyBindingsForEachModel = function(){
     for(var i=0 ; i<this._modelArray.length ; i++){
        this._modelRoute.setLastIndex(i);
        this.applyBindingsForEachTarget();
        this.askChildrenApplyBindingsForModel(this._modelArray[i]);
    }
};*/

MbaPropertyBindingNode.prototype.applyBindingsForEachTarget = function(){
    for(var i=0 ; i<this._targetDomElementIds.length; i++){
        var currentDomElementId = this._targetDomElementIds[i];
        var templateNode = this._template.getTemplateNodeForDomId(currentDomElementId);
        var domElement = templateNode.getDomElementForRoute(this._modelRoute);
        this._propertyBinding.applyBinding(domElement, this._model, this._modelRoute);
    }    
};

//TODO factoriser code avec MbaDomMultiplierNode
MbaPropertyBindingNode.prototype.askChildrenApplyBindingsForModel = function(model){
    var indexes = this._modelRoute.getIndexes();
    for(var i=0 ; i<this._childNodes.length ; i++){
        var currentChild = this._childNodes[i];
        currentChild.applyBindingsForModelWithIndexes(model, indexes);
    }
};

MbaPropertyBindingNode.prototype.getPropertyBinding = function(){
    return this._propertyBinding;
};

MbaPropertyBindingNode.prototype.getTargetDomElementIds = function(){
    return this._targetDomElementIds;
};   
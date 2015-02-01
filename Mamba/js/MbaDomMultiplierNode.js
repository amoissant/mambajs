function MbaDomMultiplierNode(){
    this._domMultiplier;
    this._relativeAccesor;
    this._template;
    this._domElementsToCloneMap;
    this._modelRoute;
    this._modelArray;
    this._modelArrayRoute;
    this._previousModelSize;
}
MbaDomMultiplierNode.prototype = new MbaDomMultiplierBaseNode();
MbaDomMultiplierNode.prototype.constructor = MbaDomMultiplierNode;

MbaDomMultiplierNode.prototype.init = function(domMultiplier){
    checkType(domMultiplier, MbaDomMultiplier);
    MbaDomMultiplierBaseNode.prototype.init.call(this);
    this._domMultiplier = domMultiplier;
    this._modelRoute = new MbaRoute2().initFromAccessor(this._domMultiplier.getModelAccessor());
    this._previousModelSize = {};
    return this;
};

MbaDomMultiplierNode.prototype.modelAccessorHasSameRoot = function(domMultiplier){
    checkType(domMultiplier, MbaDomMultiplier);
    return this._domMultiplier.modelAccessorHasSameRoot(domMultiplier);
};

MbaDomMultiplierNode.prototype.initRelativeAccessor = function(parentAccessorSize){
    checkType(parentAccessorSize, 'number');
    this.createRelativeAccessor();
    this.removeParentRootFromRelativeAccessor(parentAccessorSize);
    this.initRelativeAccessorForChildren();
};

MbaDomMultiplierNode.prototype.createRelativeAccessor = function(){
    var domMultiplierAccessor = this._domMultiplier.getModelAccessor();
    this._relativeAccessor = new MbaAccessorChain2().initFromAccessorChain(domMultiplierAccessor);  
};

MbaDomMultiplierNode.prototype.removeParentRootFromRelativeAccessor = function(parentAccessorSize){
    checkType(parentAccessorSize, 'number');
    this._relativeAccessor.removeNFirstAccessors(parentAccessorSize);
};

MbaDomMultiplierNode.prototype.initRelativeAccessorForChildren = function(){
    var parentAccessorSize = this._domMultiplier.getModelAccessorSize();
    for(var i=0 ; i<this._childNodes.length ; i++){
        this._childNodes[i].initRelativeAccessor(parentAccessorSize);
    }
};

MbaDomMultiplierNode.prototype.linkToTemplate = function(template){
    checkType(template, MbaTemplate2);
    this._template = template;
    this.constructDomElementsToCloneMap();
    this.askChildrenToLinkTemplate();
};

MbaDomMultiplierNode.prototype.constructDomElementsToCloneMap = function(){
    this._domElementsToCloneMap = {};
    var domElementsToClone = this._template.findForSelector(this._domMultiplier.getSelector());
    for(var i=0 ; i<domElementsToClone.length ; i++){
        var currentDomElement = domElementsToClone[i];
        var domElementDetachedCopy = currentDomElement.cloneNode(false);
        this._domElementsToCloneMap[currentDomElement._mbaId] = domElementDetachedCopy;
    }
};

MbaDomMultiplierNode.prototype.askChildrenToLinkTemplate = function(){
    for(var i=0 ; i<this._childNodes.length ; i++){
        this._childNodes[i].linkToTemplate(this._template);
    }
};

MbaDomMultiplierNode.prototype.updateDomForModelWithIndexes = function(parentModel, parentIndexes){
    checkType(parentIndexes, Array);
    this.setModelArrayAndRoute(parentModel, parentIndexes);
    this.createUpdateDeleteDomForEachModel();
};

MbaDomMultiplierNode.prototype.setModelArrayAndRoute = function(parentModel, parentIndexes){
    this._modelRoute.copyIndexes(parentIndexes);
    this._modelArray = this._relativeAccessor.getSubModelAndUpdateRoute(parentModel, this._modelRoute);
    this._modelArrayRoute = this._modelRoute.clone();
    //TODO ici on se sert juste de modelArrayRoute comme clé pour previousModelSize, on peut optimiser en evitant le clone
};

MbaDomMultiplierNode.prototype.createUpdateDeleteDomForEachModel = function(){
    this.updateDomForExistingModels();
    this.createDomForAddedModels();
    this.deleteDomForRemovedModels();
    this.updatePreviousModelSize();
};    

MbaDomMultiplierNode.prototype.updateDomForExistingModels = function(){
    var updateEndIndex = Math.min(this._modelArray.length, this.getPreviousModelSize());
    for(var i=0 ; i<updateEndIndex ; i++){
        this._modelRoute.setLastIndex(i);
        this.askChildrenUpdateDomForModel(this._modelArray[i]);
    }    
};

MbaDomMultiplierNode.prototype.createDomForAddedModels = function(){
    var previousModelSize = this.getPreviousModelSize();
    for(var i=previousModelSize ; i<this._modelArray.length ; i++){
        this._modelRoute.setLastIndex(i);
        this.createDomForAllElementsToClone();
        this.askChildrenUpdateDomForModel(this._modelArray[i]);
    }
};

MbaDomMultiplierNode.prototype.getPreviousModelSize = function(){
    if(this._previousModelSize[this._modelArrayRoute] == null)
        this.setPreviousModelSizeToZero();
    return this._previousModelSize[this._modelArrayRoute];
};

MbaDomMultiplierNode.prototype.setPreviousModelSizeToZero = function(){
    this._previousModelSize[this._modelArrayRoute] = 0;
};

MbaDomMultiplierNode.prototype.createDomForAllElementsToClone = function(){
    for(var domId in this._domElementsToCloneMap){
        this._template.createDomForRoute(domId, this._modelRoute);
    }
};

MbaDomMultiplierNode.prototype.askChildrenUpdateDomForModel = function(model){
    var indexes = this._modelRoute.getIndexes();
    for(var i=0 ; i<this._childNodes.length ; i++){
        var currentChild = this._childNodes[i];
        currentChild.updateDomForModelWithIndexes(model, indexes);
    }
};

MbaDomMultiplierNode.prototype.deleteDomForRemovedModels = function(){
    var deleteStartIndex = this._modelArray.length;
    var deleteEndIndex = this.getPreviousModelSize();
    for(var i=deleteStartIndex ; i<deleteEndIndex ; i++){
        this._modelRoute.setLastIndex(i);
        this.deleteDomForAllElementsToClone();
        this.askChildrenReinitPreviousModelSize(this._modelRoute);
    }
};

MbaDomMultiplierNode.prototype.deleteDomForAllElementsToClone = function(){
    for(var domId in this._domElementsToCloneMap){
        this._template.deleteDomForRoute(domId, this._modelRoute);
    }
};

MbaDomMultiplierNode.prototype.askChildrenReinitPreviousModelSize = function(parentRoute){
    checkType(parentRoute, MbaRoute2);
    for(var i=0 ; i<this._childNodes.length ; i++){
        var currentChild = this._childNodes[i];
        currentChild.reinitPreviousModelSizeForParentRoute(parentRoute);
    }
};

MbaDomMultiplierNode.prototype.reinitPreviousModelSizeForParentRoute = function(parentRoute){
    checkType(parentRoute, MbaRoute2);
    for(var childRouteId in this._previousModelSize){
        if(parentRoute.isParentOfRouteId(childRouteId))
            this._previousModelSize[childRouteId] = 0;
    }
    this.askChildrenReinitPreviousModelSize(parentRoute);
};

MbaDomMultiplierNode.prototype.updatePreviousModelSize = function(){
    this._previousModelSize[this._modelArrayRoute] = this._modelArray.length;
};

MbaDomMultiplierNode.prototype.getDomMultiplier = function(){
    return this._domMultiplier;
};

MbaDomMultiplierNode.prototype.getRelativeAccessor = function(){
    return this._relativeAccessor;
};

    

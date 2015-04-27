function MbaDomMultiplierNode(){
    this._domMultiplier;
    this._domElementsToCloneMap;
    this._model;
    this._modelRouteSnapshot;
    this._previousModelSize;
}
MbaDomMultiplierNode.prototype = new MbaAccessorNode();
MbaDomMultiplierNode.prototype.constructor = MbaDomMultiplierNode;

MbaDomMultiplierNode.prototype.init = function(domMultiplier){
    checkType(domMultiplier, MbaDomMultiplier);
    MbaAccessorNode.prototype.init.call(this, domMultiplier);
    this._domMultiplier = domMultiplier;
    this._previousModelSize = {};
    return this;
};

MbaDomMultiplierNode.prototype.instanciateNewNode = function(domMultiplier){
    checkType(domMultiplier, MbaDomMultiplier);
    return new MbaDomMultiplierNode().init(domMultiplier);
};

MbaDomMultiplierNode.prototype.onLinkToTemplate = function(){
    this.constructDomElementsToCloneMap();
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

MbaDomMultiplierNode.prototype.updateDomForModelWithIndexes = function(parentModel, parentIndexes){
    checkType(parentIndexes, Array);
    this.setModelAndRoute(parentModel, parentIndexes);
    this.createUpdateDeleteDomForEachModel();
};

MbaDomMultiplierNode.prototype.createUpdateDeleteDomForEachModel = function(){
    this.updateDomForExistingModels();
    this.createDomForAddedModels();
    this.deleteDomForRemovedModels();
    this.updatePreviousModelSize();
};    

MbaDomMultiplierNode.prototype.updateDomForExistingModels = function(){
    var updateEndIndex = Math.min(this._model.length, this.getPreviousModelSize());
    for(var i=0 ; i<updateEndIndex ; i++){
        this._modelRoute.setLastIndex(i);
        this.askChildrenUpdateDomForModel(this._model[i]);
    }    
};

MbaDomMultiplierNode.prototype.createDomForAddedModels = function(){
    var previousModelSize = this.getPreviousModelSize();
    for(var i=previousModelSize ; i<this._model.length ; i++){
        this._modelRoute.setLastIndex(i);
        this.createDomForAllElementsToClone();
        this.askChildrenUpdateDomForModel(this._model[i]);
    }
};

MbaDomMultiplierNode.prototype.getPreviousModelSize = function(){
    if(this._previousModelSize[this._modelRouteSnapshot] == null)
        this.setPreviousModelSizeToZero();
    return this._previousModelSize[this._modelRouteSnapshot];
};

MbaDomMultiplierNode.prototype.setPreviousModelSizeToZero = function(){
    this._previousModelSize[this._modelRouteSnapshot] = 0;
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
    var deleteStartIndex = this._model.length;
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
    this._previousModelSize[this._modelRouteSnapshot] = this._model.length;
};

MbaDomMultiplierNode.prototype.getDomMultiplier = function(){
    return this._domMultiplier;
};

MbaDomMultiplierNode.prototype.getRelativeAccessor = function(){
    return this._relativeAccessor;
};

MbaDomMultiplierNode.prototype.getDomElementsToCloneMap = function(){
    return this._domElementsToCloneMap;
};   

function MbaDomMultiplierNode(){
    this._domMultiplier;
    this._relativeAccesor;
    this._template;
    this._domElementsToCloneMap;
    this._modelRoute;
    this._modelArray;
}
MbaDomMultiplierNode.prototype = new MbaDomMultiplierBaseNode();
MbaDomMultiplierNode.prototype.constructor = MbaDomMultiplierNode;

MbaDomMultiplierNode.prototype.init = function(domMultiplier){
    checkType(domMultiplier, MbaDomMultiplier);
    MbaDomMultiplierBaseNode.prototype.init.call(this);
    this._domMultiplier = domMultiplier;
    this._modelRoute = new MbaRoute2().initFromAccessor(this._domMultiplier.getModelAccessor());
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

MbaDomMultiplierNode.prototype.createDomForModelWithIndexes = function(parentModel, parentIndexes){
    checkType(parentIndexes, 'array', 'string');
    this.setModelArrayAndRoute(parentModel, parentIndexes);
    this.createDomForEachModel();
};

MbaDomMultiplierNode.prototype.createDomForEachModel = function(){
    for(var i=0 ; i<this._modelArray.length ; i++){
        this.createDomForModelAtIndex(i);
        //TODO appel récursif
    }
};    

MbaDomMultiplierNode.prototype.createDomForModelAtIndex = function(index){
    this._modelRoute.setlastIndex(index);
    for(var domId in this._domElementsToCloneMap){
        this._template.createDomForRoute(domId, this._modelRoute);
    }
};

MbaDomMultiplierNode.prototype.setModelArrayAndRoute = function(parentModel, parentIndexes){
    this._modelRoute.setIndexes(parentIndexes);
    this._modelArray = this._relativeAccessor.getSubModel(parentModel, this._modelRoute);    
    this._modelRoute.appendUndefinedIndex();
};

MbaDomMultiplierNode.prototype.getDomMultiplier = function(){
    return this._domMultiplier;
};

MbaDomMultiplierNode.prototype.getRelativeAccessor = function(){
    return this._relativeAccessor;
};

    

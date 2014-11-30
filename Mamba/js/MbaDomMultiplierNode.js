function MbaDomMultiplierNode(){
    this._domMultiplier;
    this._relativeAccesor;
    this._template;
    this._domElementsToCloneMap;
}
MbaDomMultiplierNode.prototype = new MbaDomMultiplierBaseNode();
MbaDomMultiplierNode.prototype.constructor = MbaDomMultiplierNode;

MbaDomMultiplierNode.prototype.init = function(domMultiplier){
    checkType(domMultiplier, MbaDomMultiplier);
    MbaDomMultiplierBaseNode.prototype.init.call(this);
    this._domMultiplier = domMultiplier;
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

MbaDomMultiplierNode.prototype.createDomForModelWithRoute = function(model, route){//route ets un variable de DomMultiplierNode dont on fait varier la dernier élément
    checkType(route, 'array', 'string');
    var subModel = this._relativeAccessor.getSubModel(model);    
    var relativeAccessorSize = this._relativeAccessor.getSize();
    for(var i=0 ; i<relativeAccessorSize ; i++){
        route.push('-');
    }
    
    for(var i=0 ; i<subModel.length ; i++){
        route.push(i.toString());
        for(var domId in this._domElementsToCloneMap){
            var modelRoute = new MbaRoute2().initFromAccessorAndIndexes(this._domMultiplier.getModelAccessor(), route);
            this._template.createDomForRoute(domId, modelRoute);
        }
        //TODO appel récursif
        route.pop();
    }
    
    
    for(var i=0 ; i<relativeAccessorSize ; i++){//TODO peut etre que ca marche sans cette partie
        route.pop();
    }
};

MbaDomMultiplierNode.prototype.getDomMultiplier = function(){
    return this._domMultiplier;
};

MbaDomMultiplierNode.prototype.getRelativeAccessor = function(){
    return this._relativeAccessor;
};

    

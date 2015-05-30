function MbaAccessorNode(){
    this._objectWithAccessor;
    this._relativeAccessor;
    this._template;
    this._model;
    this._modelRoute;
    this._modelRouteSnapshot;
    this._modelAccessorId;
}

MbaAccessorNode.prototype = new MbaAccessorBaseNode();
MbaAccessorNode.prototype.constructor = MbaAccessorNode;

MbaAccessorNode.prototype.init = function(objectWithAccessor){
    MbaAccessorBaseNode.prototype.init.call(this);
    this._objectWithAccessor = objectWithAccessor;
    this._modelRoute = new MbaRoute2().initFromAccessor(objectWithAccessor.getModelAccessor());
    this._modelAccessorId = this._modelRoute.getAccessorId();
    return this;
};

MbaAccessorNode.prototype.addNodeFrom = function(objectWithAccessor){
     if(this.accessorEquals(objectWithAccessor))
        this.onAccessorEquals(objectWithAccessor);
    MbaAccessorBaseNode.prototype.addNodeFrom.call(this, objectWithAccessor);
};

MbaAccessorNode.prototype.accessorEquals = function(otherWithAccessor){
    var thisAccessor = this._objectWithAccessor.getModelAccessor();
    var otherAccessor = otherWithAccessor.getModelAccessor();
    return thisAccessor.equals(otherAccessor);
};

MbaAccessorNode.prototype.onAccessorEquals = function(otherWithAccessor){
    throw new Error('Must be implemented in subclass.');
};

MbaAccessorNode.prototype.accessorHasSameRoot = function(otherWithAccessor){
    var thisAccessor = this._objectWithAccessor.getModelAccessor();
    var otherAccessor = otherWithAccessor.getModelAccessor();
    return thisAccessor.hasSameRoot(otherAccessor);
};

MbaAccessorNode.prototype.initRelativeAccessor = function(parentAccessorSize){
    checkType(parentAccessorSize, 'number');
    this.createRelativeAccessor();
    this.removeParentRootFromRelativeAccessor(parentAccessorSize);
    this.initRelativeAccessorForChildren();
};

MbaAccessorNode.prototype.createRelativeAccessor = function(){
    var accessor = this._objectWithAccessor.getModelAccessor();
    this._relativeAccessor = new MbaAccessorChain2().initFromAccessorChain(accessor);  
};

MbaAccessorNode.prototype.removeParentRootFromRelativeAccessor = function(parentAccessorSize){
    checkType(parentAccessorSize, 'number');
    this._relativeAccessor.removeNFirstAccessors(parentAccessorSize);
};

MbaAccessorNode.prototype.initRelativeAccessorForChildren = function(){
    var parentAccessorSize = this._objectWithAccessor.getModelAccessor().getSize();
    for(var i=0 ; i<this._childNodes.length ; i++){
        this._childNodes[i].initRelativeAccessor(parentAccessorSize);
    }
};

MbaAccessorNode.prototype.linkToTemplate = function(template){
    checkType(template, MbaTemplate2);
    this._template = template;
    this.onLinkToTemplate();
    this.askChildrenToLinkTemplate();
};

MbaAccessorNode.prototype.onLinkToTemplate = function(){
    throw new Error('Must be implemented in subclass.');
};

MbaAccessorNode.prototype.askChildrenToLinkTemplate = function(){
    for(var i=0 ; i<this._childNodes.length ; i++){
        this._childNodes[i].linkToTemplate(this._template);
    }
};

MbaAccessorNode.prototype.setModelAndRoute = function(parentModel, parentIndexes){
    this._modelRoute.copyIndexes(parentIndexes);
    this._model = this._relativeAccessor.getSubModelAndUpdateRoute(parentModel, this._modelRoute);
    this._modelRouteSnapshot = this._modelRoute.clone().toString();
    //TODO ici on se sert juste de modelArrayRoute comme clé, on peut optimiser en evitant le clone
};

MbaAccessorNode.prototype.findAndRefresh = function(parentModel, route){
    checkType(route, MbaRoute2);
    this._model = this._relativeAccessor.getSubModelAndReduceRoute(parentModel, route);
    if(route.isEmpty()){
        this.refresh();
        return;
    }
    this.askChildrenFindAndRefresh(this._model, route);
};

MbaAccessorNode.prototype.refresh = function(){
    throw new Error('Must be implemented in subclass.');
};

MbaAccessorNode.prototype.relativeAccessorMatches = function(route){
    checkType(route, MbaRoute2);
    return route.getAccessorId().startsWith(this._relativeAccessor.getId());
};

MbaAccessorNode.prototype.getObjectWithAccessor = function(){
    return this._objectWithAccessor;
};

MbaAccessorNode.prototype.getRelativeAccessor = function(){
    return this._relativeAccessor;
};

MbaAccessorNode.prototype.getModelAccessorId = function(){
    return this._modelAccessorId;
};


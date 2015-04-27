function MbaAccessorNode(){
    this._objectWithAccessor;
    this._relativeAccesor;
    this._template;
    this._model;
    this._modelRoute;
    this._modelRouteSnapshot;
}

MbaAccessorNode.prototype = new MbaAccessorBaseNode();
MbaAccessorNode.prototype.constructor = MbaAccessorNode;

MbaAccessorNode.prototype.init = function(objectWithAccessor){
    MbaAccessorBaseNode.prototype.init.call(this);
    this._objectWithAccessor = objectWithAccessor;
    this._modelRoute = new MbaRoute2().initFromAccessor(objectWithAccessor.getModelAccessor());
    return this;
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

MbaAccessorNode.prototype.getObjectWithAccessor = function(){
    return this._objectWithAccessor;
};

MbaAccessorNode.prototype.getRelativeAccessor = function(){
    return this._relativeAccessor;
};


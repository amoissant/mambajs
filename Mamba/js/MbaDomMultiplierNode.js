function MbaDomMultiplierNode(){
    this._domMultiplier;
    this._relativeAccesor;
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
    this._relativeAccessor = new MbaAccessorChain().initFromAccessorChain(domMultiplierAccessor);  
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

MbaDomMultiplierNode.prototype.getDomMultiplier = function(){
    return this._domMultiplier;
};

MbaDomMultiplierNode.prototype.getRelativeAccessor = function(){
    return this._relativeAccessor;
};

    

function MbaRoute2(){
    this._accesorChain;
    this._routeIndexes;
}

MbaRoute2.prototype.init = function(){
    this._accessorChain = new MbaAccessorChain2().initEmpty();
    this._routeIndexes = [];
    return this;
};

MbaRoute2.prototype.initFromAccessorAndIndexes = function(accessorChain, indexes){
    checkType(accessorChain, MbaAccessorChain2);
    checkType(indexes, 'array', 'string');
    this._accessorChain = accessorChain;
    this._routeIndexes = indexes;
    return this;
};

MbaRoute2.prototype.initFromAccessor = function(accessorChain){
    checkType(accessorChain, MbaAccessorChain2);
    this._accessorChain = accessorChain;
    this._routeIndexes = [];
    return this;
};

MbaRoute2.prototype.clone = function(){
    var clone = new MbaRoute2();
    clone._accessorChain = new MbaAccessorChain2().initFromAccessorChain(this._accessorChain);
    clone._routeIndexes = [];
    Uti.array(clone._routeIndexes).pushAll(this._routeIndexes);
    return clone;
};

MbaRoute2.prototype.removeLastPart = function(){
    if(this.sameNumberOfAccessorAndIndexes())
        this._routeIndexes.pop();
    else
        this._accessorChain.removeLastAccessor();    
};

MbaRoute2.prototype.removeLastAccessorWithIndex = function(){
    if(!this.sameNumberOfAccessorAndIndexes())
        throw new Error('must have same number of accessors and indexes');
    this._routeIndexes.pop();
    this._accessorChain.removeLastAccessor();    
};

MbaRoute2.prototype.sameNumberOfAccessorAndIndexes = function(){
    return this._accessorChain.getSize() == this._routeIndexes.length;
};
    
MbaRoute2.prototype.getAccessorId = function(){
    return this._accessorChain.getId();
};

MbaRoute2.prototype.appendUndefinedIndex = function(){
    this._routeIndexes.push(undefined);
};

MbaRoute2.prototype.copyIndexes = function(indexes){
    checkType(indexes, Array);
    Uti.array(this._routeIndexes).empty();
    Uti.array(this._routeIndexes).pushAll(indexes);
};

MbaRoute2.prototype.setLastIndex = function(index){
    this._routeIndexes[this._routeIndexes.length-1] = index;
};

MbaRoute2.prototype.setLastIndexToUndefined = function(){
    this._routeIndexes[this._routeIndexes.length-1] = undefined;
};

MbaRoute2.prototype.lastIndexIsUndefined = function(){
    return this._routeIndexes[this._routeIndexes.length-1] == undefined;
};

MbaRoute2.prototype.setIndexes = function(indexes){
    checkType(indexes, Array);
    this._routeIndexes = indexes;
};

MbaRoute2.prototype.getIndexes = function(){
    return this._routeIndexes;
};

MbaRoute2.prototype.isEmpty = function(){
    return this._accessorChain.isEmpty();
};

MbaRoute2.prototype.toString = function(){
    return this._accessorChain.toStringWithIndexes(this._routeIndexes);
};

MbaRoute2.prototype.isParentOfRouteId = function(routeId){
    var id = this.toString();
    return routeId.indexOf(id) != -1;
};

MbaRoute2.prototype.forDebug = function(){
    var debugRoute = this.clone();
    debugRoute.setLastIndexToUndefined();
    var debugRouteString = debugRoute.toString();
    return debugRouteString.substring(1, debugRouteString.length);
    return this._accessorChain.toStringWithIndexes(this._routeIndexes);
};

    
    
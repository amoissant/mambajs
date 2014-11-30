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

MbaRoute2.prototype.clone = function(){
    var clone = new MbaRoute2();
    clone._accessorChain = new MbaAccessorChain2().initFromAccessorChain(this._accessorChain);
    clone._routeIndexes = [];
    Uti.array(clone._routeIndexes).pushAll(this._routeIndexes);
    return clone;
};

MbaRoute2.prototype.removeLastPart = function(){
    this._accessorChain.removeLastAccessor();
    this._routeIndexes.pop();
};
    
MbaRoute2.prototype.getAccessorId = function(){
    return this._accessorChain.getId();
};

MbaRoute2.prototype.getIndex = function(){
    if(this._routeIndexes.length == 0)
        return '-';
    else
        return this._routeIndexes[this._routeIndexes.length-1];
};

MbaRoute2.prototype.isEmpty = function(){
    return this._accessorChain.isEmpty();
};
    
    
function MbaRoute(route){
    
    this._index;
    this.length;
    
    if(arguments.length > 0)
        this.init(route);
}

MbaRoute.prototype = new Array();
MbaRoute.prototype.constructor = MbaRoute;

MbaRoute.prototype.init = function(route){
    checkType(route, Array);
    this.length = 0;
    for(var i=0 ; i<route.length ; i++){
        this.push(route[i]);
    }
    this._index = this.toString();
};

MbaRoute.prototype.getIndexes = function(){
    return this._index;
};

MbaRoute.prototype.newChildRoute = function(){
    var childRoute = this.clone();
    childRoute.appendIndex(0);
    return childRoute;
};

MbaRoute.prototype.setLastIndex = function(value){
    checkType(value, 'number');
    this[this.length-1] = value;
    this._index = this.toString();
};

MbaRoute.prototype.setIndex = function(index, value){
    checkType(index, 'number');
    checkTypeOrNull(value, 'number');
    this[index] = value;
    this._index = this.toString();
};

MbaRoute.prototype.appendIndex = function(index){
    checkTypeOrNull(index, 'number');
    this.push(index);
    this._index = this.toString();
};

MbaRoute.prototype.clear = function(){
    while(this.length > 0)
        this.pop();
    this._index = this.toString();
};

MbaRoute.prototype.removeLastIndex = function(){
    this.pop();
    this._index = this.toString();
};

MbaRoute.prototype.clone = function(){
    return new MbaRoute(this);
};

MbaRoute.prototype.newParentRoute = function(){
    var parentRoute = this.clone();
    parentRoute.removeLastIndex();
    return parentRoute;
};

MbaRoute.prototype.isNullAtIndex = function(index){
    checkType(index, 'number');
    return this[index] == null;
}


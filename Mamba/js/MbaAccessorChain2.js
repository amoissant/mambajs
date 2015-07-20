function MbaAccessorChain2(){
    this._accessors;
    this._modelValue; 
}

MbaAccessorChain2.prototype.initWithRootModelAccessor = function(){
    this.initEmpty();
    this.prependRootModelAccessor();
    return this;
};

MbaAccessorChain2.prototype.initWithRootModelAccessorFromMemberChain = function(memberChain){
    checkType(memberChain, 'array', 'string');
    this.initEmpty();
    this.createAccessors(memberChain);
    this.prependRootModelAccessor();
    return this;
};
    
MbaAccessorChain2.prototype.initFromAccessorChain = function(accessorChain){
    checkType(accessorChain, MbaAccessorChain2);
    this.initEmpty();
    Uti.array(this._accessors).pushAll(accessorChain._accessors);
    return this;
};

MbaAccessorChain2.prototype.initEmpty = function(){
    this._accessors = [];
    return this;
};

MbaAccessorChain2.prototype.createAccessors = function(memberChain){
    checkType(memberChain, 'array', 'string');
    for(var i=0 ; i<memberChain.length ; i++){
        this.appendAccessor(new MbaAccessor(memberChain[i]));
    }   
};

MbaAccessorChain2.prototype.appendAccessor = function(accessor){
    checkType(accessor, MbaAccessor);
    this._accessors.push(accessor);
};

MbaAccessorChain2.prototype.prependRootModelAccessor = function(){
    this._accessors.splice(0, 0, new MbaSelfAccessor());
};

MbaAccessorChain2.prototype.removeFirstAccessor = function(){
    this._accessors.shift();  
};  

MbaAccessorChain2.prototype.removeNFirstAccessors = function(n){
    for(var i=0; i<n ; i++){
        this._accessors.shift();  
    }
};  
    
MbaAccessorChain2.prototype.removeLastAccessor = function(){
    this._accessors.pop();  
};  
    
MbaAccessorChain2.prototype.hasSameRoot = function(other){
    var rootSize = Math.min(this.getSize(), other.getSize());
    for(var i=0; i<rootSize ; i++){
        if(!this._accessors[i].equals(other._accessors[i]))
            return false;
    }
    return true;
};

MbaAccessorChain2.prototype.equals = function(other){
    return this.getSize() == other.getSize() && this.hasSameRoot(other);
};

MbaAccessorChain2.prototype.getSubModelAndUpdateRoute = function (parentModel, modelRoute){
    checkType(modelRoute, MbaRoute2);
    var currentModel = parentModel;
    for(var i=0 ; i<this._accessors.length ; i++){
        //TODO : si subModel est un tableau alors erreur -> il faut mettre une 'r00t'
        currentModel = this._accessors[i].getModelValue(currentModel);
        modelRoute.appendUndefinedIndex();
    }
    return currentModel;
};

MbaAccessorChain2.prototype.getSubModelForIndexes = function (parentModel, indexes){
    checkType(indexes, Array);
    var currentModel = parentModel;
    for(var i=0 ; i<this._accessors.length ; i++){
        currentModel = this._accessors[i].getModelValue(currentModel);
        var currentIndex = indexes[i];
        if(currentIndex != undefined)
            currentModel = currentModel[currentIndex];
    }
    return currentModel;
};

MbaAccessorChain2.prototype.getSubModelAndReduceRoute = function (parentModel, route){
    checkType(route, MbaRoute2);
    var currentModel = parentModel;
    for(var i=0 ; i<this._accessors.length ; i++){
        currentModel = this._accessors[i].getModelValue(currentModel);
        var currentIndex = route.getIndexes()[0];
        if(currentIndex != undefined)
            currentModel = currentModel[currentIndex];
        route.removeFirstPart();
    }
    return currentModel;
};

MbaAccessorChain2.prototype.toString = function(){
    return this._accessors.join('.');//TODO sortir une valeur spéciale quand vide
};

MbaAccessorChain2.prototype.getSize = function(){
    return this._accessors.length;
};

MbaAccessorChain2.prototype.getId = function(){
    return this.toString();
};

MbaAccessorChain2.prototype.isEmpty = function(){
    return this._accessors.length == 0;
};
 
//TODO : optimiser en calculant une seule fois
MbaAccessorChain2.prototype.toStringWithIndexes = function(indexes){
    checkType(indexes, Array);
    var charForEmtpyRoute = '_';
    var accessorNamesAndIndexes = this.concatAccessorNamesAndIndexes(indexes);
    return charForEmtpyRoute+accessorNamesAndIndexes;
};

MbaAccessorChain2.prototype.concatAccessorNamesAndIndexes = function(indexes){
    checkType(indexes, Array);
    var stringRepresentation = '';
    for(var i=0 ; i<this._accessors.length ; i++){
        stringRepresentation += this._accessors[i];
        var index = indexes[i];
        if(index != undefined)
            stringRepresentation += '['+index+']';
        stringRepresentation += '.';
    }
    return stringRepresentation.substring(0, stringRepresentation.length-1);
};

MbaAccessorChain2.prototype.compare = function(other){
    var sizeComparison = this.compareSize(other);
    if(sizeComparison != 0)
        return sizeComparison;
    else
        return this.compareId(other);
};

MbaAccessorChain2.prototype.compareSize = function(other){
    var thisSize = this.getSize();
    var otherSize = other.getSize();
    if(thisSize < otherSize)
        return -1;
    if(thisSize > otherSize)
        return 1;
    return 0;
};

MbaAccessorChain2.prototype.compareId = function(other){
    var thisId = this.getId();
    var otherId = other.getId();
    if(thisId < otherId)
        return -1;
    if(thisId > otherId)
        return 1;
    return 0;
};


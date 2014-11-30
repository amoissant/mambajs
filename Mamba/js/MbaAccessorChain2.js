function MbaAccessorChain2(){
    this._accessors;
    this._modelValue; 
}

MbaAccessorChain2.prototype.initWithRootModelAccessor = function(){
    this.initFromMemberChain([]);
    this.prependRootModelAccessor();
    return this;
};

MbaAccessorChain2.prototype.initWithRootModelAccessorFromMemberChain = function(memberChain){
    checkType(memberChain, 'array', 'string');
    this.initFromMemberChain(memberChain);
    this.prependRootModelAccessor();
    return this;
};

MbaAccessorChain2.prototype.initFromMemberChain = function(memberChain){
    checkType(memberChain, 'array', 'string');
    this.initEmpty();
    this.createAccessors(memberChain);
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

MbaAccessorChain2.prototype.getSubModel = function (parentModel){
    var currentModel = parentModel;
    for(var i=0 ; i<this._accessors.length ; i++){
        //TODO : si subModel est un tableau alors erreur -> il faut mettre une 'r00t'
        this._accessors[i].getModelValue(currentModel);
    }
    return currentModel;
};

MbaAccessorChain2.prototype.toString = function(){
    return this._accessors.join('.');
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

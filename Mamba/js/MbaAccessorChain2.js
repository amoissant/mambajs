function MbaAccessorChain2(){
    
    this._accessors;
    this._modelValue; 
}

MbaAccessorChain2.prototype.initFromMemberChain = function(memberChain){
    checkType(memberChain, 'array', 'string');
    this.initFields();
    this.createAccessors(memberChain);
    return this;
};
    
MbaAccessorChain2.prototype.initFromAccessorChain = function(accessorChain){
    checkType(accessorChain, MbaAccessorChain2);
    this.initFields();
    PushAll(accessorChain._accessors).into(this._accessors);
    return this;
};

MbaAccessorChain2.prototype.initFields = function(){
    this._accessors = [];
    this._beforeEndRoutes = {};
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

MbaAccessorChain2.prototype.removeNFirstAccessors = function(n){
    for(var i=0; i<n ; i++){
        this._accessors.shift();  
    }
};  

MbaAccessorChain2.prototype.hasSameRoot = function(other){
    var rootSize = Math.min(this.getSize(), other.getSize());
    for(var i=0; i<rootSize ; i++){
        if(!this._accessors[i].equals(other._accessors[i]))
            return false;
    }
    return true;
};

MbaAccessorChain2.prototype.toString = function(){
    var stringRepresentation = '[';
    for(var i=0 ; i<this._accessors.length ; i++){
        stringRepresentation += this._accessors[i].toString()+', ';
    }
    if(this._accessors.length> 0)
        stringRepresentation = stringRepresentation.substring(0, stringRepresentation.length-2);
    stringRepresentation += ']';
    return stringRepresentation;
};

MbaAccessorChain2.prototype.toStringWithModel = function(){
    var stringRepresentation = 'model';
    for(var i=0 ; i<this._accessors.length ; i++){
        stringRepresentation += '.'+this._accessors[i].toString();
    }
    return stringRepresentation;
};

MbaAccessorChain2.prototype.getSize = function(){
    return this._accessors.length;
};

MbaAccessorChain2.prototype.getId = function(){
    return this.toStringWithModel();
};

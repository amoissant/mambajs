function MbaAccessor(precursor){

    this._member;
    
    MbaAccessor.prototype.init = function(precursor){
        checkType(precursor, 'string');
        this._member = precursor;
    };
    
    MbaAccessor.prototype.getPrecursor = function(){
      return this._member;  
    };
        
    MbaAccessor.prototype.getModelValue = function(model){
        var memberType = typeof model[this._member];
        if(memberType == 'function')
            return model[this._member]();
        else
            return model[this._member];
    };
    
    MbaAccessor.prototype.setModelValue = function(model, value){
        var memberType = typeof model[this._member];
        if(memberType == 'function')
            model[this._member](value);
        else
            model[this._member] = value;
    };
    
    MbaAccessor.prototype.modelHasNotMember = function(model){
        return !model.hasOwnProperty(this._member);
    };
    
    MbaAccessor.prototype.toString = function(){
      return this._member;  
    };
    
    if(arguments.length != 0)
        this.init(precursor);
}

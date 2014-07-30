function MbaFieldAccessor(precursor){
    
    this._field;
    
    MbaFieldAccessor.prototype.init = function(precursor){
        checkType(precursor, 'string');
        MbaAccessor.prototype.init.call(this, precursor)   ;
        this._field = precursor;
    };
    
    MbaFieldAccessor.prototype.getModelValue = function(model){
        if(model == null)
            throw new MbaError(0, 'model must not be null.');
        return model[this._field];
    };
    
    MbaFieldAccessor.prototype.setModelValue = function(model, value){
        if(model == null)
            throw new MbaError(0, 'model must not be null.');
        model[this._field] = value;
    };
    
    MbaFieldAccessor.prototype.toString = function(){
      return this._field;  
    };
    
    if(arguments.length != 0)
        this.init(precursor);
}
MbaFieldAccessor.prototype = new MbaAccessor();
MbaFieldAccessor.prototype.constructor = MbaFieldAccessor;
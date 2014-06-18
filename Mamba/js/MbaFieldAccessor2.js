function MbaFieldAccessor2(precursor){
    
    this._field;
    
    MbaFieldAccessor2.prototype.init = function(precursor){
        checkType(precursor, 'string');
        MbaAccessor2.prototype.init.call(this, precursor)   ;
        this._field = precursor;
    };
    
    MbaFieldAccessor2.prototype.getModelValue = function(model){
        if(model == null)
            throw new MbaError(0, 'model must not be null.');
        return model[this._field];
    };
    
    MbaFieldAccessor2.prototype.setModelValue = function(model, value){
        if(model == null)
            throw new MbaError(0, 'model must not be null.');
        model[this._field] = value;
    };
    
    MbaFieldAccessor2.prototype.toString = function(){
      return this._field;  
    };
    
    if(arguments.length != 0)
        this.init(precursor);
}
MbaFieldAccessor2.prototype = new MbaAccessor2();
MbaFieldAccessor2.prototype.constructor = MbaFieldAccessor2;
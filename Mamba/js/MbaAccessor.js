function MbaAccessor(precursor){

    this._precursor;
    
    MbaAccessor.prototype.init = function(precursor){
        checkType(precursor, 'string');
        this._precursor = precursor;
    };
    
    MbaAccessor.prototype.getPrecursor = function(){
      return this._precursor;  
    };
    
    if(arguments.length != 0)
        this.init(precursor);
}

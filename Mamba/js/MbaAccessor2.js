function MbaAccessor2(precursor){

    this._precursor;
    
    MbaAccessor2.prototype.init = function(precursor){
        checkType(precursor, 'string');
        this._precursor = precursor;
    };
    
    MbaAccessor2.prototype.getPrecursor = function(){
      return this._precursor;  
    };
    
    if(arguments.length != 0)
        this.init(precursor);
}

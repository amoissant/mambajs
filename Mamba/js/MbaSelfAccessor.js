function MbaSelfAccessor(){
}
MbaSelfAccessor.prototype = new MbaAccessor();
MbaSelfAccessor.prototype.constructor = MbaSelfAccessor;

MbaSelfAccessor.prototype.getModelValue = function(model){
    return model;
};

MbaSelfAccessor.prototype.setModelValue = function(model, value){
    throw new Error('setModelValue not allowed on MbaSelfAccessor');//TODO faire deux classes MbaReadAccessor et MbaReadWriteAccessor
};

MbaSelfAccessor.prototype.toString = function(){
  return 'model';  
};
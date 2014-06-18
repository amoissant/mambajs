function MbaSelfAccessor2(){
    
    MbaSelfAccessor2.prototype.getModelValue = function(model){
      return model;
    };
}
MbaSelfAccessor2.prototype = new MbaAccessor2();
MbaSelfAccessor2.prototype.constructor = MbaSelfAccessor2;
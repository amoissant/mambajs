function MbaRootAccessorChain(){
    
    this._lastRoute = [];
    
    MbaRootAccessorChain.prototype.init = function(){
        this._accessors = [];    
    };
    
    MbaRootAccessorChain.prototype.getModelValue = function(model){
        checkType(model, 'object');
       return model;
    };
    
    MbaRootAccessorChain.prototype.getLastRoute = function(){
        return this._lastRoute;
    };
    
    this.init();
}
MbaRootAccessorChain.prototype = new MbaAccessorChain();
MbaRootAccessorChain.prototype.constructor = MbaRootAccessorChain;

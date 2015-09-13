function MbaDomMultiplierTreeObjectModel(){   
}

MbaDomMultiplierTreeObjectModel.prototype = new MbaDomMultiplierTreeBase();
MbaDomMultiplierTreeObjectModel.prototype.constructor = MbaDomMultiplierTreeObjectModel;

MbaDomMultiplierTreeObjectModel.prototype.init = function(){
    return MbaDomMultiplierTreeBase.prototype.init.call(this, [undefined]);
};

MbaDomMultiplierTreeObjectModel.prototype.initAllRelativeAccessors = function(){
    this._modelRoute = new MbaRoute2().initFromAccessor(new MbaAccessorChain2().initWithRootModelAccessor());
    this._relativeAccessor = new MbaAccessorChain2().initWithRootModelAccessor();
    this._rootAccessorSize = 1;    
    MbaDomMultiplierTreeBase.prototype.initAllRelativeAccessors.call(this);
};

MbaDomMultiplierTreeObjectModel.prototype.updateDomForModel = function(model){
    if(this.modelIsArray(model)) 
        throw new MbaError().init2('Root directive doesn\'t contain \'r00t\' but the given model is an array.');        
    MbaDomMultiplierTreeBase.prototype.updateDomForModel.call(this, model);
};

MbaDomMultiplierTreeObjectModel.prototype.modelIsArray = function(model){
    return model != null && model instanceof Array;
};

MbaDomMultiplierTreeObjectModel.prototype.refresh = function(){
    for(var i=0 ; i<this._childNodes.length ; i++){
        this._childNodes[i].setModelAndRoute(this._model, this._rootModelIndexes);
        this._childNodes[i].refresh();
    }
};



function MbaDomMultiplierTreeArrayModel(){   
}

MbaDomMultiplierTreeArrayModel.prototype = new MbaDomMultiplierTreeBase();
MbaDomMultiplierTreeArrayModel.prototype.constructor = MbaDomMultiplierTreeArrayModel;

MbaDomMultiplierTreeArrayModel.prototype.init = function(){
    return MbaDomMultiplierTreeBase.prototype.init.call(this, []);
};

MbaDomMultiplierTreeArrayModel.prototype.updateDomForModel = function(model){
    if(this.modelIsObject(model)) 
       throw new MbaError().init2('Root directive contains \'r00t\' but the given model is not an array.');
    MbaDomMultiplierTreeBase.prototype.updateDomForModel.call(this, model);
};

MbaDomMultiplierTreeArrayModel.prototype.modelIsObject = function(model){
    return model != null && !(model instanceof Array);
};

MbaDomMultiplierTreeArrayModel.prototype.findAndRefresh = function(parentModel, route, indexes){
    checkType(route, MbaRoute2);
    this.askChildrenFindAndRefresh(parentModel, route, indexes);
};



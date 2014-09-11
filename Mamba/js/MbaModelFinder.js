function MbaModelFinder(mbaTemplate, wantedModel){
    
    this._wantedModel;
    this._modelFound;
    
    if(arguments.length > 0)
        this.init(mbaTemplate, wantedModel);
}
MbaModelFinder.prototype = new MbaModelExplorer();
MbaModelFinder.prototype.constructor = MbaModelFinder;

MbaModelFinder.prototype.init = function(mbaTemplate, wantedModel){
    this._wantedModel = wantedModel;
    this._modelFound = false;
    MbaModelExplorer.prototype.init.call(this, mbaTemplate);
};

MbaModelFinder.prototype.beforeVisitModel = function(model){
    if(model == this._wantedModel){
        this._modelFound = true;   
        return this.STOP;
    }
};

MbaModelFinder.prototype.searchForWantedModel = function(){
    MbaModelExplorer.prototype.walkThroughAccessorTree.call(this);
};

MbaModelFinder.prototype.hasFoundModel = function(){
    return this._modelFound;
};


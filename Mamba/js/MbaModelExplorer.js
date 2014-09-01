function MbaModelExplorer(accessorTree, superModel){//TODO factoriser le code avec ModelFinder
    
    this._accessorTree;
    this._superModel;
    this._stackModels;
    this._currentRoute;
    this._currentMbaNodes;
    
    if(arguments.length > 0)
        this.init(accessorTree, superModel, wantedModel);
}

MbaModelExplorer.prototype.init = function(accessorTree, superModel){
    checkType(accessorTree, RootAccessorNode);
    this._accessorTree = accessorTree;
    this._superModel = superModel;
    this._stackModels = [];
    this._currentRoute = new MbaRoute([null]);
};

MbaModelExplorer.prototype.getSuperModel = function(){
    return this._superModel;
};

MbaModelExplorer.prototype.getLastModel = function(){
    return this._stackModels[this._stackModels.length-1];
};

MbaModelExplorer.prototype.getCurrentRoute = function(){
    return this._currentRoute.clone();
};

MbaModelExplorer.prototype.getCurrentMbaNodes = function(){
    return this._currentMbaNodes;
};

MbaModelExplorer.prototype.walkThroughAccessorTree = function(){
    this.visitOneModel(this._superModel, this._accessorTree);
};

MbaModelExplorer.prototype.visitModel = function(accessorNode){
    checkType(accessorNode, AccessorNode);
    this._currentRoute.appendIndex(null);
    var model = accessorNode.getAccessor().getModelValue(this.getLastModel());
    if(model instanceof Array){
        for(var i=0 ; i<model.length ; i++){
            this._currentRoute.setLastIndex(i);
            this.visitOneModel(model[i], accessorNode);
        }
    }
    else
        this.visitOneModel(model, accessorNode);
    this._currentRoute.removeLastIndex();
};

MbaModelExplorer.prototype.visitOneModel = function(model, accessorNode){
    checkType(accessorNode, RootAccessorNode);
    this._currentMbaNodes = accessorNode.getMbaNodes();
    this.beforeVisitModel(model);
    this._stackModels.push(model);
    this.visitSubModels(accessorNode);
    this._stackModels.pop();  
    this.afterVisitModel(model);
};

MbaModelExplorer.prototype.visitSubModels = function(accessorNode){
    checkType(accessorNode, RootAccessorNode);
    var accessorChildren = accessorNode.getChildren();
    for(var childName in accessorChildren){
        this.visitModel(accessorNode.getChild(childName))
    }
};

MbaModelExplorer.prototype.beforeVisitModel = function(model){
};

MbaModelExplorer.prototype.afterVisitModel = function(model){
};


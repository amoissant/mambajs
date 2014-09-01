function ModelFinder(accessorTree, superModel, wantedModel){
    
    this._accessorTree;
    this._superModel;
    this._wantedModel;
    this._currentRoute;
    this._targetRoute;
    this._targetMbaNodes;
    this._stackModels;
    this._modelFound;
    
    if(arguments.length > 0)
        this.init(accessorTree, superModel, wantedModel);
}

ModelFinder.prototype.init = function(accessorTree, superModel, wantedModel){
    checkType(accessorTree, RootAccessorNode);
    this._accessorTree = accessorTree;
    this._superModel = superModel;
    this._wantedModel = wantedModel;
    this._currentRoute = new MbaRoute([null]);
    this._targetMbaNodes = [];
    this._stackModels = [];
};

ModelFinder.prototype.getTargetMbaNodes = function(){
    return this._targetMbaNodes;
};

ModelFinder.prototype.getTargetRoute = function(){
    return this._targetRoute;
};

ModelFinder.prototype.hasFoundModel = function(){
    return this._modelFound;
};


ModelFinder.prototype.searchForWantedModel = function(){
    this._modelFound = false;
    this._stackModels.push(this._superModel);
    for(var childName in this._accessorTree.getChildren()){
        this._modelFound = this.searchForWantedModelInDeep(this._accessorTree.getChild(childName));
        if(this.hasFoundModel())
            return;
    }
};
    
ModelFinder.prototype.searchForWantedModelInDeep = function(node){
    checkType(node, AccessorNode);
    this._currentRoute.appendIndex(null);
    var model = node.getAccessor().getModelValue(this._stackModels[this._stackModels.length-1]);
    var wantedModelFound = false;
    if(model instanceof Array){
        var i=0;
        while(!wantedModelFound && i<model.length){
            this._currentRoute.setLastIndex(i);
            wantedModelFound = this.wantedModelFound(model[i], node);
            i++;
        }
    }
    else{
        wantedModelFound = this.wantedModelFound(model, node);
    }
    this._currentRoute.removeLastIndex();
    return wantedModelFound;
};

ModelFinder.prototype.wantedModelFound = function(model, node){
    checkType(node, AccessorNode);
    this._stackModels.push(model);
    if(model == this._wantedModel){
        this._targetRoute = this._currentRoute.clone();
        this._targetMbaNodes = node.getMbaNodes()
        return true;
    }
    var wantedModelFound = this.searchForWantedModelInSubNodes(node); 
    this._stackModels.pop();  
    return wantedModelFound;
};

ModelFinder.prototype.searchForWantedModelInSubNodes = function(node){
    checkType(node, AccessorNode);
    for(var childName in node._children){
        if(this.searchForWantedModelInDeep(node.getChild(childName)))
            return true;
    }
    return false;
};


function MbaModelExplorer(mbaTemplate){
    
    this.STOP = 'stop';
    
    this._accessorTree;
    this._superModel;
    this._stackModels;
    this._currentRoute;
    this._currentMbaNodes;
    
    if(arguments.length > 0)
        this.init(mbaTemplate);
}

MbaModelExplorer.prototype.init = function(mbaTemplate){
    checkType(mbaTemplate, MbaTemplate);
    this._accessorTree = this.constructAccessorTree(mbaTemplate.getRootNode());
    this._superModel = mbaTemplate.getSuperModel();
    this._stackModels = [];
    this._currentRoute = new MbaRoute([null]);
};

MbaModelExplorer.prototype.constructAccessorTree = function(rootNode){
    checkType(rootNode, MbaRootNode);
    var visitor = new GetNodesAndAccessorsVisitor(); 
    rootNode.accept(visitor); 
    visitor.constructAccessorNodes();
    return visitor.getRootAccessorNode();
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
            if(this.STOP == this.visitOneModel(model[i], accessorNode))
                return this.STOP;
        }
    }
    else
        if(this.STOP == this.visitOneModel(model, accessorNode))
            return this.STOP;
    this._currentRoute.removeLastIndex();
};

MbaModelExplorer.prototype.visitOneModel = function(model, accessorNode){
    checkType(accessorNode, RootAccessorNode);
    this._currentMbaNodes = accessorNode.getMbaNodes();
    if(this.STOP == this.beforeVisitModel(model))
        return this.STOP;
    this._stackModels.push(model);
    if(this.STOP == this.visitSubModels(accessorNode))
        return this.STOP;
    this._stackModels.pop();  
    if(this.STOP == this.afterVisitModel(model))
        return this.STOP;
};

MbaModelExplorer.prototype.visitSubModels = function(accessorNode){
    checkType(accessorNode, RootAccessorNode);
    var accessorChildren = accessorNode.getChildren();
    for(var childName in accessorChildren){
        if(this.STOP == this.visitModel(accessorNode.getChild(childName)))
            return this.STOP;
    }
};

MbaModelExplorer.prototype.beforeVisitModel = function(model){
};

MbaModelExplorer.prototype.afterVisitModel = function(model){
};


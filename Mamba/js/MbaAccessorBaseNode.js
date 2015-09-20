function MbaAccessorBaseNode(){
    this._relativeAccessor;
    this._childNodes;
    this._modelRoute;
    this._manager;
}

MbaAccessorBaseNode.prototype.init = function(manager){
    checkType(manager, MbaManager);
    this._manager = manager;
    this._childNodes = [];
    return this;
};

MbaAccessorBaseNode.prototype.addNodeFrom = function(objectWithAccessor){
    var candidateChild = this.findChildToBeParentOf(objectWithAccessor);
    if(candidateChild != null)
        candidateChild.addNodeFrom(objectWithAccessor);
    else
        this.createNodeFrom(objectWithAccessor);      
};

MbaAccessorBaseNode.prototype.findChildToBeParentOf = function(objectWithAccessor){
    for(var i=0 ; i<this._childNodes.length ; i++){
        var currentChildNode = this._childNodes[i];
        if(currentChildNode.accessorHasSameRoot(objectWithAccessor))
            return currentChildNode;
    }
    return null;
};

MbaAccessorBaseNode.prototype.createNodeFrom = function(objectWithAccessor){
    var node = this.instanciateNewNode(objectWithAccessor);
    this._childNodes.push(node);
};

MbaAccessorBaseNode.prototype.instanciateNewNode = function(objectWithAccessor){
    throw new Error('Must be implemented in subclass.');
};

MbaAccessorBaseNode.prototype.findAndRefresh = function(parentModel, route, indexes){
    checkType(route, MbaRoute2);
    //TODO : si route modelseflaccesseur et indexes = [undefined] la fonction ci-dessous supprime un index hors pour
    //le rafraichissement suite à une ation ca pose problème
    this._model = this._relativeAccessor.getSubModelAndReduceRoute(parentModel, route);
    if(route.isEmpty()){
        this._modelRoute.copyIndexes(indexes);
        this._modelRouteSnapshot = this._modelRoute.toString();
        this.refresh();
    }
    else    
        this.askChildrenFindAndRefresh(this._model, route, indexes);
};

MbaAccessorBaseNode.prototype.askChildrenFindAndRefresh = function(parentModel, route, indexes){
    checkType(route, MbaRoute2);
    for(var i=0 ; i<this._childNodes.length ; i++){
        var currentChild = this._childNodes[i];
        if(currentChild.relativeAccessorMatches(route)){
            currentChild.findAndRefresh(parentModel, route, indexes);
            return;
        }
    }
};

MbaAccessorBaseNode.prototype.relativeAccessorMatches = function(route){
    checkType(route, MbaRoute2);
    var routeAccessorId = route.getAccessorId();
    var thisAccessorId = this._relativeAccessor.getId();
    return routeAccessorId.startsWith(thisAccessorId);
};

MbaAccessorBaseNode.prototype.getRelativeAccessor = function(){
    return this._relativeAccessor;
};

MbaAccessorBaseNode.prototype.getChildNodes = function(){
    return this._childNodes;
};
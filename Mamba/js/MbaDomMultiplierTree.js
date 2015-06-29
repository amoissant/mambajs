function MbaDomMultiplierTree(){   
}

MbaDomMultiplierTree.prototype = new MbaAccessorTree();
MbaDomMultiplierTree.prototype.constructor = MbaDomMultiplierTree;

MbaDomMultiplierTree.prototype.instanciateNewNode = MbaDomMultiplierNode.prototype.instanciateNewNode;

MbaDomMultiplierTree.prototype.updateDomForModel = function(model){
    for(var i=0 ; i<this._childNodes.length ; i++){
        this._childNodes[i].updateDomForModelWithIndexes(model, []);
    }
};

/*MbaDomMultiplierTree.prototype.findNodeToRefresh = function(parentModel, route){
    checkType(route, MbaRoute2);
    var routeClone = route.clone();
    var nodeToRefresh = this.findNodeToRefreshAmongChildren(parentModel, route);
    console.log(nodeToRefresh);
    var subModel = parentModel.sub[0];
    var indexes = routeClone.getIndexes();
    this._modelRoute.copyIndexes(parentIndexes);
    this._model = subModel;
    this._modelRouteSnapshot = routeClone.toString();
    nodeToRefresh.askChildrenUpdateDomForModel(subModel);
};*/
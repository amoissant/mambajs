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

MbaDomMultiplierTree.prototype.findAndRefresh = function(parentModel, route, indexes){
    checkType(route, MbaRoute2);
    var routeClone = route.clone();
    this._model = this._relativeAccessor.getSubModelAndReduceRoute(parentModel, route);
    if(route.isEmpty()){
        this.refresh();
    }
    else
        this.askChildrenFindAndRefresh(parentModel, routeClone, indexes);//TODO voir pourquoi avec this._model cela ne fonctionne pas...
};

//TODO continuer et mettre au propre (ici et le test)
MbaDomMultiplierTree.prototype.refresh = function(){
    for(var i=0 ; i<this._childNodes.length ; i++){
        this._childNodes[i].setModelAndRoute(this._model, []);
        this._childNodes[i].refresh();
    }
};

function MbaDomMultiplierTree(){   
}

MbaDomMultiplierTree.prototype = new MbaAccessorTree();
MbaDomMultiplierTree.prototype.constructor = MbaDomMultiplierTree;

MbaDomMultiplierTree.prototype.instanciateNewNode = MbaDomMultiplierNode.prototype.instanciateNewNode;

MbaDomMultiplierTree.prototype.updateDomForModel = function(model){
    if(this._rootDirectiveIsForArrayModel && this.modelIsObject(model)) 
       throw new MbaError().init2('Root directive contains \'r00t\' but the given model is not an array.');
    if(!this._rootDirectiveIsForArrayModel && this.modelIsArray(model)) 
        throw new MbaError().init2('Root directive doesn\'t contain \'r00t\' but the given model is an array.');        
       
    var indexes = null;
    if(this._rootDirectiveIsForArrayModel)
        indexes= [];
    else
        indexes = [undefined];
    for(var i=0 ; i<this._childNodes.length ; i++){
        this._childNodes[i].updateDomForModelWithIndexes(model, indexes);
    }
};

MbaDomMultiplierTree.prototype.modelIsObject = function(model){
    return model != null && !(model instanceof Array);
};

MbaDomMultiplierTree.prototype.modelIsArray = function(model){
    return model != null && model instanceof Array;
};

//TODO factoriser code avec MbaAccessorBaseNode.prototype.findAndRefresh
MbaDomMultiplierTree.prototype.findAndRefresh = function(parentModel, route, indexes){
    checkType(route, MbaRoute2);
    
    //TODO : il faut une implémentation différentedu MbaDomMultiplierTree suivant si le super modèle est tableau ou pas.
    //Si modèle tableau alors pas de relative accessor dans MbaAccessorTree.prototype.initAllRelativeAccessors
    //this._childNodes[0]._relativeAccessor.toString() -> model.sub
    //this._childNodes[0]._childNodes[0]._relativeAccessor.toString(); ->subsub

    //Sinon il faut un relative accessor avec seulement l'accesseur du modèle
    //this._relativeAccessor.toString(); -> model
    //this._childNodes[0]._relativeAccessor.toString() -> sub
    //this._childNodes[0]._childNodes[0]._relativeAccessor.toString(); -> subsub

    //L'idée est que MbaAccessorBaseNode.prototype.relativeAccessorMatches fonctionne tout le temps car la route des éléments de l'arbre sera plus courte que celle recherchée
    var routeClone = route.clone();
    if(!this._rootDirectiveIsForArrayModel){  
        this._model = this._relativeAccessor.getSubModelAndReduceRoute(parentModel, route);
        if(route.isEmpty()){
            this.refresh();
        }
        else{
            this.askChildrenFindAndRefresh(this._model, route, indexes);
        }
    }
    else{
        console.log(this._model, parentModel);
        this.askChildrenFindAndRefresh(parentModel, routeClone, indexes);
    }
};

//TODO continuer et mettre au propre (ici et le test)
MbaDomMultiplierTree.prototype.refresh = function(){
    //throw new Error('ici');
    for(var i=0 ; i<this._childNodes.length ; i++){
        this._childNodes[i].setModelAndRoute(this._model, [undefined]);
        this._childNodes[i].refresh();
    }
};

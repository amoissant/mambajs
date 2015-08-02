function MbaBindingTree(){   
}
MbaBindingTree.prototype = new MbaAccessorTree();
MbaBindingTree.prototype.constructor = MbaBindingTree;

MbaBindingTree.prototype.instanciateNewNode = MbaBindingCollectionNode.prototype.instanciateNewNode;

MbaBindingTree.prototype.applyBindingsForModel = function(model){
    for(var i=0 ; i<this._childNodes.length ; i++){
        this._childNodes[i].applyBindingsForModelWithIndexes(model, []);
    }
};

MbaBindingTree.prototype.findAndRefresh = function(parentModel, route, indexes){
    checkType(route, MbaRoute2);
    this.askChildrenFindAndRefresh(parentModel, route, indexes);
};





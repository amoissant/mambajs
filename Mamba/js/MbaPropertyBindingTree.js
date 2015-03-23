function MbaPropertyBindingTree(){   
}
MbaPropertyBindingTree.prototype = new MbaAccessorTree();
MbaPropertyBindingTree.prototype.constructor = MbaPropertyBindingTree;

MbaPropertyBindingTree.prototype.instanciateNewNode = MbaPropertyBindingNode.prototype.instanciateNewNode;

//TODO factoriser code avec MbaDomMultiplierTree
MbaPropertyBindingTree.prototype.applyBindingsForModel = function(model){
    for(var i=0 ; i<this._childNodes.length ; i++){
        this._childNodes[i].applyBindingsForModelWithIndexes(model, []);
    }
};





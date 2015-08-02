function MbaDomMultiplierTreeBase(){
    this._rootModelIndexes;
}

MbaDomMultiplierTreeBase.prototype = new MbaAccessorTree();
MbaDomMultiplierTreeBase.prototype.constructor = MbaDomMultiplierTreeBase;

MbaDomMultiplierTreeBase.prototype.init = function(rootModelIndexes){
    MbaAccessorTree.prototype.init.call(this);
    this._rootModelIndexes = rootModelIndexes;
    return this;
};

MbaDomMultiplierTreeBase.prototype.instanciateNewNode = MbaDomMultiplierNode.prototype.instanciateNewNode;

MbaDomMultiplierTreeBase.prototype.updateDomForModel = function(model){
    for(var i=0 ; i<this._childNodes.length ; i++){
        this._childNodes[i].updateDomForModelWithIndexes(model, this._rootModelIndexes);
    }
};

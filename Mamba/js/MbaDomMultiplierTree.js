function MbaDomMultiplierTree(){    
}

MbaDomMultiplierTree.prototype = new MbaDomMultiplierBaseNode();
MbaDomMultiplierTree.prototype.constructor = MbaDomMultiplierTree;

MbaDomMultiplierTree.prototype.initAllRelativeAccessors = function(){
    for(var i=0 ; i<this._childNodes.length ; i++){
        this._childNodes[i].initRelativeAccessor(0);
    }
};
function MbaAccessorTree(){
    this._rootAccessorSize;
}

MbaAccessorTree.prototype = new MbaAccessorBaseNode();
MbaAccessorTree.prototype.constructor = MbaAccessorTree;

MbaAccessorTree.prototype.init = function(manager){
    checkType(manager, MbaManager);
    MbaAccessorBaseNode.prototype.init.call(this, manager);
    this._rootAccessorSize = 0;
    return this;
};

MbaAccessorTree.prototype.initAllRelativeAccessors = function(){
    for(var i=0 ; i<this._childNodes.length ; i++){
        this._childNodes[i].initRelativeAccessor(this._rootAccessorSize);
    }
};

MbaAccessorTree.prototype.linkToTemplate = function(template){
    checkType(template, MbaTemplate2);
    for(var i=0 ; i<this._childNodes.length ; i++){
        this._childNodes[i].linkToTemplate(template);
    }
};

function MbaAccessorTree(){
}

MbaAccessorTree.prototype = new MbaAccessorBaseNode();
MbaAccessorTree.prototype.constructor = MbaAccessorTree;

MbaAccessorTree.prototype.initAllRelativeAccessors = function(){
    for(var i=0 ; i<this._childNodes.length ; i++){
        this._childNodes[i].initRelativeAccessor(0);
    }
};

MbaAccessorTree.prototype.linkToTemplate = function(template){
    checkType(template, MbaTemplate2);
    for(var i=0 ; i<this._childNodes.length ; i++){
        this._childNodes[i].linkToTemplate(template);
    }
};

MbaAccessorTree.prototype.findAndRefresh = function(parentModel, route, indexes){
    checkType(route, MbaRoute2);
    this.askChildrenFindAndRefresh(parentModel, route, indexes);
};

function MbaAccessorTree(){
    this._rootDirectiveIsForArrayModel;
}

MbaAccessorTree.prototype = new MbaAccessorBaseNode();
MbaAccessorTree.prototype.constructor = MbaAccessorTree;

MbaAccessorTree.prototype.init = function(rootDirectiveIsForArrayModel){
    checkType(rootDirectiveIsForArrayModel, 'boolean');
    MbaAccessorBaseNode.prototype.init.call(this);
    this._rootDirectiveIsForArrayModel = rootDirectiveIsForArrayModel;
    return this;
};

MbaAccessorTree.prototype.initAllRelativeAccessors = function(){
    var rootAccessorSize = 0;
    if(!this._rootDirectiveIsForArrayModel){
        this._modelRoute = new MbaRoute2().initFromAccessor(new MbaAccessorChain2().initWithRootModelAccessor());
        this._relativeAccessor = new MbaAccessorChain2().initWithRootModelAccessor();
        rootAccessorSize = 1;
    }
    
    for(var i=0 ; i<this._childNodes.length ; i++){
        this._childNodes[i].initRelativeAccessor(rootAccessorSize);
    }
};

MbaAccessorTree.prototype.linkToTemplate = function(template){
    checkType(template, MbaTemplate2);
    for(var i=0 ; i<this._childNodes.length ; i++){
        this._childNodes[i].linkToTemplate(template);
    }
};

//TODO à suppr une fois refresh au niveau arbre pour domMultiplier et binding
MbaAccessorTree.prototype.findAndRefresh = function(parentModel, route, indexes){
    checkType(route, MbaRoute2);
    //throw new Error('là');
    this.askChildrenFindAndRefresh(parentModel, route, indexes);
};

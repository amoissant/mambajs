function MbaAccessorTree(){
}

MbaAccessorTree.prototype = new MbaAccessorBaseNode();
MbaAccessorTree.prototype.constructor = MbaAccessorTree;

MbaAccessorTree.prototype.initAllRelativeAccessors = function(){
    //TODO ne mettre un relative accessor vers le modèle que si super modèle objet
    //si modèle tableau les enfants auront déjà un relative accessor vers le modèle
    this._relativeAccessor = new MbaAccessorChain2().initWithRootModelAccessor();
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

//TODO à suppr une fois refresh au niveau arbre pour domMultiplier et binding
MbaAccessorTree.prototype.findAndRefresh = function(parentModel, route, indexes){
    checkType(route, MbaRoute2);
    this.askChildrenFindAndRefresh(parentModel, route, indexes);
};

function UpdateSuperModelReferenceVisitor(model){
    
    this._newSuperModel;
    
    if(arguments.length > 0)
        this.init(model);
}
UpdateSuperModelReferenceVisitor.prototype = new MbaNodeVisitor();
UpdateSuperModelReferenceVisitor.prototype.constructor = UpdateSuperModelReferenceVisitor;

UpdateSuperModelReferenceVisitor.prototype.init = function(model){
    this._newSuperModel = model;
};

UpdateSuperModelReferenceVisitor.prototype.beforeVisitNode = function(node){
    checkType(node, MbaNode);
    node.updateSuperModelReference(this._newSuperModel);
};
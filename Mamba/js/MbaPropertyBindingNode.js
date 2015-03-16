function MbaPropertyBindingNode(){
    this._propertyBinding;
    this._relativeAccesor;
    this._template;
    this._targetDomElementIds;
}
MbaPropertyBindingNode.prototype = new MbaAccessorNode();
MbaPropertyBindingNode.prototype.constructor = MbaPropertyBindingNode;

MbaPropertyBindingNode.prototype.init = function(propertyBinding){
    checkType(propertyBinding, MbaPropertyBinding);
    MbaAccessorNode.prototype.init.call(this, propertyBinding);
    this._propertyBinding = propertyBinding;
    return this;
};

MbaPropertyBindingNode.prototype.instanciateNewNode = function(propertyBinding){
    checkType(propertyBinding, MbaPropertyBinding);
    return new MbaPropertyBindingNode().init(propertyBinding);
};

MbaPropertyBindingNode.prototype.onLinkToTemplate = function(){
    this.computeTargetDomElementIds();
};

MbaPropertyBindingNode.prototype.computeTargetDomElementIds = function(){
    var targetDomElements = this._template.findForSelector(this._propertyBinding.getSelector());
    this._targetDomElementIds = [];
    for(var i=0 ; i<targetDomElements.length ; i++){
        this._targetDomElementIds.push(targetDomElements[i]._mbaId);
    }
};

MbaPropertyBindingNode.prototype.getPropertyBinding = function(){
    return this._propertyBinding;
};

MbaPropertyBindingNode.prototype.getTargetDomElementIds = function(){
    return this._targetDomElementIds;
};   
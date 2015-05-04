function MbaPropertyBindingNode(){
    this._template;
    this._propertyBinding;
    this._targetDomElementIds;
}

MbaPropertyBindingNode.prototype.init = function(propertyBinding){
    checkType(propertyBinding, MbaPropertyBinding);
    this._propertyBinding = propertyBinding;
    return this;
};

MbaPropertyBindingNode.prototype.computeTargetDomElementIds = function(){
    var targetDomElements = this._template.findForSelector(this._propertyBinding.getSelector());
    this._targetDomElementIds = [];
    for(var i=0 ; i<targetDomElements.length ; i++){
        this._targetDomElementIds.push(targetDomElements[i]._mbaId);
    }
};

MbaPropertyBindingNode.prototype.applyBindingForModelAndRoute = function(model, modelRoute){
    checkType(modelRoute, MbaRoute2);
    for(var i=0 ; i<this._targetDomElementIds.length; i++){
        var currentDomElementId = this._targetDomElementIds[i];
        var templateNode = this._template.getTemplateNodeForDomId(currentDomElementId);
        var domElement = templateNode.getDomElementForRoute(modelRoute);
        this._propertyBinding.applyBinding(domElement, model, modelRoute);
    }    
};

MbaPropertyBindingNode.prototype.setTemplate = function(template){
    checkType(template, MbaTemplate2);
    this._template = template;
};

MbaPropertyBindingNode.prototype.getPropertyBinding = function(){
    return this._propertyBinding;
};

MbaPropertyBindingNode.prototype.getTargetDomElementIds = function(){
    return this._targetDomElementIds;
};
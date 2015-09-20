function MbaPropertyBindingNode(){
    this._selector;
    this._propertyAccessor;
    this._domTransformation;
    this._events;
    this._template;
    this._targetDomElementIds;
    this._manager;
}

MbaPropertyBindingNode.prototype.init = function(propertyBinding, manager){
    checkType(propertyBinding, MbaPropertyBinding);
    checkType(manager, MbaManager);
    this._selector = propertyBinding.getSelector();
    this._propertyAccessor = propertyBinding.getPropertyAccessor();
    this._domTransformation = propertyBinding.getDomTransformation();
    this._events = propertyBinding.getEvents();
    this._manager = manager;
    return this;
};

MbaPropertyBindingNode.prototype.computeTargetDomElementIds = function(){
    var targetDomElements = this._template.findForSelector(this._selector);
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
        this.applyBinding(domElement, model, modelRoute);
    }    
};

MbaPropertyBindingNode.prototype.applyBinding = function(domElement, model, route){
    checkType(domElement, 'domElement');
    checkType(route, MbaRoute2);
    var propertyValue = this.getPropertyValue(model);
    this._domTransformation.update2(domElement, route, propertyValue);
};

MbaPropertyBindingNode.prototype.getPropertyValue = function(model){
    var propertyValue = this._propertyAccessor.getModelValue(model);
    if(propertyValue instanceof Array)
        throw new MbaError(23, 'Received an array for model, user \'r00t\' directive to set dom to repeat.');
    return propertyValue;
};

MbaPropertyBindingNode.prototype.setTemplate = function(template){
    checkType(template, MbaTemplate2);
    this._template = template;
};

MbaPropertyBindingNode.prototype.getPropertyBinding = function(){
    return this._propertyBinding;
};

MbaPropertyBindingNode.prototype.getPropertyAccessor = function(){
    return this._propertyAccessor;
};

MbaPropertyBindingNode.prototype.getTargetDomElementIds = function(){
    return this._targetDomElementIds;
};

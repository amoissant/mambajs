function MbaActionBindingNode(){
    this._selector;
    this._action;
    this._events;
    this._template;
    this._targetDomElementIds;
}

MbaActionBindingNode.prototype.init = function(actionBinding){
    checkType(actionBinding, MbaActionBinding2);
    this._selector = actionBinding.getSelector();
    this._action = actionBinding.getAction();
    this._events = actionBinding.getEvents();
    return this;
};
//TODO factoriser code avec MbaMbaPropertyBindingNode
MbaActionBindingNode.prototype.computeTargetDomElementIds = function(){
    var targetDomElements = this._template.findForSelector(this._selector);
    this._targetDomElementIds = [];
    for(var i=0 ; i<targetDomElements.length ; i++){
        this._targetDomElementIds.push(targetDomElements[i]._mbaId);
    }
};
//TODO factoriser code avec MbaMbaPropertyBindingNode
MbaActionBindingNode.prototype.applyBindingForModelAndRoute = function(model, modelRoute){
    checkType(modelRoute, MbaRoute2);
    for(var i=0 ; i<this._targetDomElementIds.length; i++){
        var currentDomElementId = this._targetDomElementIds[i];
        var templateNode = this._template.getTemplateNodeForDomId(currentDomElementId);
        var domElement = templateNode.getDomElementForRoute(modelRoute);
        this.applyBinding(domElement, model, modelRoute);
    }    
};

MbaActionBindingNode.prototype.applyBinding = function(domElement, model, route){
    checkType(domElement, 'domElement');
    checkType(route, MbaRoute2);
    var action = this._action;
    for(var i=0 ; i<this._events.length ; i++){
        domElement.addEventListener(this._events[i], function(){
            model[action]();//TODO passer en paramètre le(s) modèle(s) correspondant(s) au domElement
            console.log(route.toString());
            //TODO faire un render pour la route donnée pour rafraichir le dom
        });   
    }    
};

MbaActionBindingNode.prototype.setTemplate = function(template){
    checkType(template, MbaTemplate2);
    this._template = template;
};


function MbaActionBindingNode(){
    this._selector;
    this._action;
    this._events;
    this._template;
    this._targetDomElementIds;
    this._manager;
}

MbaActionBindingNode.prototype.init = function(actionBinding, manager){
    checkType(actionBinding, MbaActionBinding2);
    checkType(manager, manager);
    this._selector = actionBinding.getSelector();
    this._action = actionBinding.getAction();
    this._events = actionBinding.getEvents();
    this._manager = manager;
    return this;
};
//TODO factoriser code avec MbaPropertyBindingNode
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
    var manager = this._manager;
    var routeClone = route.clone();
    for(var i=0 ; i<this._events.length ; i++){
        domElement.addEventListener(this._events[i], function(){
            model[action]();//TODO passer en paramètre le(s) modèle(s) correspondant(s) au domElement
            //TODO faire un render pour la route donnée pour rafraichir le dom
            manager.refreshForRoute(routeClone);
            //TODO trouver une tester pour confirmer la necessité du clone sur la route
        });   
    }    
};

MbaActionBindingNode.prototype.setTemplate = function(template){
    checkType(template, MbaTemplate2);
    this._template = template;
};


function MbaActionBinding(selector, accessorChain, action, events){
    
    this._selector;
    this._accessorChain;
    this._action; 
    this._events;
    this._superModel;
    this._eventConnectors = [];
    
    if(arguments.length > 0)
        this.init(selector, accessorChain, action, events);
}

MbaActionBinding.prototype.init = function(selector, accessorChain, action, events){
    checkType(selector, 'string');
    checkType(accessorChain, MbaAccessorChain);
    checkType(action, 'string');
    checkType(events, 'array', 'string');
    
    this._selector = selector;
    this._accessorChain = accessorChain;
    this._action = action;
    this._events = events;
}

MbaActionBinding.prototype.getSelector = function(){
    return this._selector;
};

MbaActionBinding.prototype.getAction = function(){
    return this._action;
};

MbaActionBinding.prototype.prependAccessors = function(accessorChain){
    checkType(accessorChain, MbaAccessorChain);
    this._accessorChain.prependAll(accessorChain);    
};

MbaActionBinding.prototype.getSuperModel = function(){
    return this._superModel;
};

MbaActionBinding.prototype.setSuperModel = function(superModel){
    this._superModel = superModel;
};

MbaActionBinding.prototype.accept = function(visitor){
    checkType(visitor, MbaDirectiveVisitor);
    visitor.visitActionBinding(this);
};

MbaActionBinding.prototype.getModel = function(route){
    checkType(route, MbaRoute);
    var modelRoute = this._accessorChain.shortenRoute(route);
    return this._accessorChain.getModelFromRoute(this._superModel, modelRoute);
};

MbaActionBinding.prototype.modelForRouteExists = function(route){
    checkType(route, MbaRoute);
    try{
        return this._accessorChain.getModelFromRoute(this._superModel, modelRoute) != null;        
    }
    catch(e){}
    return false;
};

MbaActionBinding.prototype.createActionEventHandler = function(domElement, route, node){
    checkType(domElement, 'dom');
    checkType(route, MbaRoute);
    checkType(node, MbaNode);
    var actionBinding = this;
    var bindingRoute = route.clone();
    var eventHandler = function(){//TODO extract method
        var actionModel = actionBinding.getModel(bindingRoute);
        //var parameterModel = domElement._mbaModel;
        var parameterModel = actionBinding.findModelForDomElement(domElement);
        var action = actionBinding.getAction(); 
        actionModel[action](parameterModel);
        var actionModelAfter = actionBinding.modelForRouteExists(bindingRoute);//TODO tester cette méthode pour ne pas lever d'erreur si le modèle n'existe pas, peut etre faire uen fonction dédié modelFromRouteExists ?
        if(actionModelAfter != null){//model can be removed during action
            var parentDirectiveNode = node.getParentDirectiveNode(); 
            parentDirectiveNode.updateForModelAndRoute(actionBinding.getSuperModel(), bindingRoute);
        }
    };
    return eventHandler;        
};

MbaActionBinding.prototype.prepareActionEventHandler = function(dom, route, node){
    checkType(dom, MbaDom);
    checkType(route, MbaRoute);
    checkType(node, MbaNode);
    var domElement = dom.getElement(0);
    var eventHandler = this.createActionEventHandler(domElement, route, node);

    for(var i=0 ; i< this._events.length ; i++){
        var eventConnector = this.createEventConnector(domElement, this._events[i], eventHandler);
        this._eventConnectors.push(eventConnector);     
    }
};

MbaActionBinding.prototype.createEventConnector = function(domElement, event, eventHandler){
    return new EventConnector(domElement, event, eventHandler);
};

MbaActionBinding.prototype.connectEvents = function(){
    while(this._eventConnectors.length > 0){
        this._eventConnectors[0].connect();
        this._eventConnectors.shift();
    }
};

MbaActionBinding.prototype.findModelForDomElement = function(domElement){
    checkType(domElement, 'dom');
    var model = domElement._mbaModel;
    while(model == null && domElement.parentElement){
        domElement = domElement.parentElement;
        model = domElement._mbaModel;
    }   
    return model;
};
function MbaTransf(){
    
    this._accessorChain;
    this._oldValues;
    this._events;
    this._superModel;
    this._eventConnectors;
}
    
MbaTransf.prototype.init = function(){
    this._oldValues = {};
    this._eventConnectors = [];
};

MbaTransf.prototype.setAccessorChain = function(accessorChain){
    checkType(accessorChain, MbaAccessorChain);
    this._accessorChain = accessorChain;
};

MbaTransf.prototype.getAccessorChain = function(){
    return this._accessorChain;
};

MbaTransf.prototype.setAccessorChain = function(accessorChain){
    checkType(accessorChain, MbaAccessorChain);
    this._accessorChain = accessorChain;
};

MbaTransf.prototype.getEvents = function(){
    return this._events;
};

MbaTransf.prototype.setEvents = function(events){
    checkType(events, 'array', 'string');
    this._events = events;
};

MbaTransf.prototype.getNewValue = function(model, route){
    checkType(route, MbaRoute);
    return this._accessorChain.getModelValueFromRoute(model, route);
};

MbaTransf.prototype.modelHasNotMemberForNewValue = function(){
    return this._accessorChain.modelHasNotMember();
};

MbaTransf.prototype.getLastModel = function(){
    return this._accessorChain.getLastModel();
};

MbaTransf.prototype.setNewValue = function(model, route, newValue){
    checkType(route, MbaRoute);
    checkArgNb(arguments, 3);
    this._accessorChain.setModelValueFromRoute(model, route, newValue);
};

MbaTransf.prototype.getOldValue = function(route){
    checkType(route, MbaRoute);
    return this._oldValues[route.getIndexes()];
};

MbaTransf.prototype.setOldValue = function(oldValue, route){
    checkType(route, MbaRoute);
    this._oldValues[route.getIndexes()] = oldValue;
};

MbaTransf.prototype.getSuperModel = function(){
    return this._superModel;    
};

MbaTransf.prototype.setSuperModel = function(model){
    this._superModel = model;
};

MbaTransf.prototype.accept = function(visitor){
    visitor.beforeVisitTransformation(this);
    visitor.afterVisitTransformation(this);
};

MbaTransf.prototype.update = function(dom, model, route, parentDirectiveNode){
    checkType(dom, MbaDomSingle);
    checkType(route, MbaRoute);
    checkType(parentDirectiveNode, MbaNode);
    var newValue = this.getNewValue(model, route);
    if(newValue instanceof Array)
        throw new MbaError(23, 'Received an array for model, user \'r00t\' directive to set what dom to repeat.');
    var oldValue = this.getOldValue(route);
    var domElement = dom.getElement();
    this.updateDomWithModel(domElement, newValue, oldValue);
    this.setOldValue(newValue, route);
    this.setSuperModel(model);//TODO on peut optimiser les perfs iueci avec un évènement pour modifier la référence du supermodel
    this.referenceModelIntoDom(dom);
    
    if(newValue != null)
        return false;
    else
        return this.modelHasNotMemberForNewValue();
};

MbaTransf.prototype.update2 = function(domElement, route, newValue){
    checkType(domElement, 'domElement');
    checkType(route, MbaRoute2);
    var oldValue = this.getOldValue(route);
    this.updateDomWithModel(domElement, newValue, oldValue);
    this.setOldValue(newValue, route);
    //TODO voir pour les anciennes fonctionnalités (setSuperModel, referenceModelIntoDom, modelHasNotMemberForNewValue)
};

MbaTransf.prototype.canReadValueFromDom = function(){
    return true;  
};

MbaTransf.prototype.prepareBindingEventHandler = function(event, domElement, node, route){
    checkType(event, 'string');
    checkType(domElement, 'dom');
    checkType(node, MbaNode);
    checkType(route, MbaRoute);
    var eventHandler = this.createBindingEventHandler(domElement, node, route);
    var eventConnector = this.createEventConnector(domElement, event, eventHandler);
    this._eventConnectors.push(eventConnector);        
};

MbaTransf.prototype.createBindingEventHandler = function(domElement, node, route){
    checkType(domElement, 'dom');
    checkType(node, MbaNode);
    checkType(route, MbaRoute);
    var transformation = this;
    var bindingRoute = route.clone();//TODO tester de rendre la route finale pour voir où on la modifie (car on avait un bug)
    var eventHandler = function(){
        var oldValue = transformation.getOldValue(route);
        var newValue = transformation.readValueFromDom(domElement, oldValue);
        var model = transformation.getSuperModel();
        transformation.setNewValue(model, bindingRoute, newValue);   
        var parentDirectiveNode = node.getParentDirectiveNode();
        parentDirectiveNode.updateForModelAndRoute(model, bindingRoute);
    };
    return eventHandler;
};

MbaTransf.prototype.createEventConnector = function(domElement, event, eventHandler){
    return new EventConnector(domElement, event, eventHandler);
};

MbaTransf.prototype.connectEvents = function(){
    while(this._eventConnectors.length > 0){
        this._eventConnectors[0].connect();
        this._eventConnectors.shift();
    }
};

MbaTransf.prototype.prepareAllBindingHandler = function(dom, node, route){
    checkType(dom, MbaDom);
    checkType(node, MbaNode);
    checkType(route, MbaRoute);
    if(this.canReadValueFromDom()){
        var domElement = dom.getElement(0);
        for(var i=0 ; i<this._events.length ; i++){
            this.prepareBindingEventHandler(this._events[i], domElement, node, route);
        } 
    }
    else
        console.log('events ', this._events, ' will be ignored');            
};

MbaTransf.prototype.referenceModelIntoDom = function(dom){
    checkType(dom, MbaDom);
    dom.referenceModel(this.getLastModel());
};

MbaTransf.prototype.getRepresentation = function(){
    return {events : '['+this._events.join(' | ')+']',
            accessor: this._accessorChain.toStringWithModel(),
            self: this};
};
function MbaTransf2(){
    
    this._accessorChain;
    this._oldValues = {};
    this._events;
    this._superModel;
    this._eventConnectors = [];
        
    MbaTransf2.prototype.setAccessorChain = function(accessorChain){
        checkType(accessorChain, MbaAccessorChain);
        this._accessorChain = accessorChain;
    };
    
    MbaTransf2.prototype.getAccessorChain = function(){
        return this._accessorChain;
    };
    
    MbaTransf2.prototype.setAccessorChain = function(accessorChain){
        checkType(accessorChain, MbaAccessorChain);
        this._accessorChain = accessorChain;
    };
    
    MbaTransf2.prototype.getEvents = function(){
        return this._events;
    };
    
    MbaTransf2.prototype.setEvents = function(events){
        checkType(events, 'array', 'string');
        this._events = events;
    };
    
    MbaTransf2.prototype.getNewValue = function(model, route){
        checkType(route, MbaRoute);
        return this._accessorChain.getModelValueFromRoute(model, route);
    };
    
    MbaTransf2.prototype.getLastModel = function(){
        return this._accessorChain.getLastModel();
    };
    
    MbaTransf2.prototype.setNewValue = function(model, route, newValue){
        checkType(route, MbaRoute);
        checkArgNb(arguments, 3);
        this._accessorChain.setModelValueFromRoute(model, route, newValue);
    };
    
    MbaTransf2.prototype.getOldValue = function(route){
        checkType(route, MbaRoute);
        return this._oldValues[route.getIndexes()];
    };
    
    MbaTransf2.prototype.setOldValue = function(oldValue, route){
        checkType(route, MbaRoute);
        this._oldValues[route.getIndexes()] = oldValue;
    };
    
    MbaTransf2.prototype.getSuperModel = function(){
        return this._superModel;    
    };
    
    MbaTransf2.prototype.setSuperModel = function(model){
        this._superModel = model;
    };
    
    MbaTransf2.prototype.visit = function(visitor){
        checkType(visitor, MbaDirectiveVisitor);
        visitor.beforeVisitTransformation(this);
        visitor.visitAccessorChain(this._accessorChain);
        visitor.afterVisitTransformation(this);
    };
	
    MbaTransf2.prototype.update = function(dom, model, route, parentDirectiveNode){
        checkType(dom, MbaDom);
        checkType(route, MbaRoute);
        checkType(parentDirectiveNode, MbaNode2);
        var newValue = this.getNewValue(model, route);
        if(newValue instanceof Array)
            throw new MbaError(23, 'Received an array for model, user \'r00t\' directive to set what dom to repeat.');
        var oldValue = this.getOldValue(route);
        var domElement = dom.getDom(0);//TODO : sous-type de MbaDom pour représenter un seul élément de dom ?
        this.updateDomWithModel(domElement, newValue, oldValue);
        this.setOldValue(newValue, route);
        this.setSuperModel(model);//TODO on peut optimiser les perfs ici avec un évènement pour modifier la référence du supermodel
        //this.referenceModelIntoDomElement(domElement);
        this.referenceModelIntoDom(dom);
    };
    
    MbaTransf2.prototype.canReadValueFromDom = function(){
        return true;  
    };
    
    MbaTransf2.prototype.bindEvent = function(event, domElement, node, route){
        checkType(event, 'string');
        checkType(domElement, 'dom');
        checkType(node, MbaNode2);
        checkType(route, MbaRoute);
        var transformation = this;
        var bindingRoute = route.clone();//TODO tester de rendre la route finale pour voir où on la modifie (car on avait un bug)
        var eventHandler = function(){
            var oldValue = transformation.getOldValue(route);
            var newValue = transformation.readValueFromDom(domElement, oldValue);
            var model = transformation.getSuperModel();
            transformation.setNewValue(model, bindingRoute, newValue);   
            //console.log('set new value : '+newValue);
            var parentDirectiveNode = node.getParentDirectiveNode();
            parentDirectiveNode.updateChildrenForModelAndRoute(model, bindingRoute);
        };
        var eventConnector = this.createEventConnector(domElement, event, eventHandler);
        this._eventConnectors.push(eventConnector);        
    };
    
    MbaTransf2.prototype.createEventConnector = function(domElement, event, eventHandler){
        return new EventConnector(domElement, event, eventHandler);
    };
    
    MbaTransf2.prototype.connectEvents = function(){
        while(this._eventConnectors.length > 0){
            this._eventConnectors[0].connect();
            this._eventConnectors.shift();
        }
    };
    
    MbaTransf2.prototype.bindAllEvents = function(dom, node, route){
        checkType(dom, MbaDom);
        checkType(node, MbaNode2);
        checkType(route, MbaRoute);
        if(this.canReadValueFromDom()){
            var domElement = dom.getDom(0);
            for(var i=0 ; i<this._events.length ; i++){
                this.bindEvent(this._events[i], domElement, node, route);
            } 
        }
        else
            console.log('events ', this._events, ' will be ignored');            
    };
    
    MbaTransf2.prototype.referenceModelIntoDomElement = function(domElement){
        checkType(domElement, 'dom');
        domElement._mbaModel = this.getLastModel();
    };

    MbaTransf2.prototype.referenceModelIntoDom = function(dom){
        checkType(dom, MbaDom);
        dom.referenceModel(this.getLastModel());
    };
}
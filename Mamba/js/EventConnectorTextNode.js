function EventConnectorTextNode(domElement, event, handler){
    
     EventConnectorTextNode.prototype.init = function(domElement, event, handler){
        checkType(domElement, 'dom');
        checkType(event, 'string');
        checkType(handler, 'function');
        
        EventConnector.prototype.init.call(this, domElement, event, handler);
    };
    
    EventConnectorTextNode.prototype.connect = function(){
        this._domElement.parentNode.addEventListener(this._event, this._handler);
    };
    
    if(arguments.length  > 0)
        this.init(domElement, event, handler);
}
EventConnectorTextNode.prototype = new EventConnector();
EventConnectorTextNode.prototype.constructor = EventConnectorTextNode;
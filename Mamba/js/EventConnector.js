function EventConnector(domElement, event, handler){
    
    this._domElement;
    this._event;
    this._handler;
    
    EventConnector.prototype.init = function(domElement, event, handler){
        checkType(domElement, 'dom');
        checkType(event, 'string');
        checkType(handler, 'function');
        
        this._domElement = domElement;
        this._event = event;
        this._handler = handler;
    };
    
    EventConnector.prototype.connect = function(){
        this._domElement.addEventListener(this._event, this._handler);
    };
    
    if(arguments.length  > 0)
        this.init(domElement, event, handler);
}
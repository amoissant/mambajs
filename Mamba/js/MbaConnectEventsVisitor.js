function MbaConnectEventsVisitor(){}
MbaConnectEventsVisitor.prototype = new MbaNodeVisitor();
MbaConnectEventsVisitor.prototype.constructor = MbaConnectEventsVisitor;

MbaConnectEventsVisitor.prototype.beforeVisitNode = function(node){
    checkType(node, MbaNode);
    this.connectBindingEvents(node);
    this.connectActionEvents(node);
};        

MbaConnectEventsVisitor.prototype.connectBindingEvents = function(node){
    checkType(node, MbaNode);
    if(node instanceof MbaNodeBinding){
        var transformations = node.getTransformations();
        for(var i=0 ; i<transformations.length ; i++){
            transformations[i].connectEvents();
        }
    }
};        

MbaConnectEventsVisitor.prototype.connectActionEvents = function(node){
    checkType(node, MbaNode);
    var actionBindings = node.getActionBindings();
    for(var i=0 ; i<actionBindings.length ; i++){
        actionBindings[i].connectEvents();    
    }
};        
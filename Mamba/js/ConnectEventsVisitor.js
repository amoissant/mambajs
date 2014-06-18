function ConnectEventsVisitor(){
    
    ConnectEventsVisitor.prototype.beforeVisitTransformation = function(transformation){
        checkType(transformation, MbaTransf2);
        transformation.connectEvents();
    };        
}
ConnectEventsVisitor.prototype = new MbaDirectiveVisitor();
ConnectEventsVisitor.prototype.constructor = ConnectEventsVisitor;
function ConnectEventsVisitor(){
    
    ConnectEventsVisitor.prototype.beforeVisitTransformation = function(transformation){
        checkType(transformation, MbaTransf);
        transformation.connectEvents();
    };        
}
ConnectEventsVisitor.prototype = new MbaDirectiveVisitor();
ConnectEventsVisitor.prototype.constructor = ConnectEventsVisitor;
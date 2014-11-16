function MbaDirectiveVisitor(){
    MbaDirectiveVisitor.prototype.beforeVisitDirective = function(directive){};
    MbaDirectiveVisitor.prototype.afterVisitDirective = function(directive){};
    MbaDirectiveVisitor.prototype.beforeVisitBinding = function(binding){};    
    MbaDirectiveVisitor.prototype.afterVisitBinding = function(binding){};    
    MbaDirectiveVisitor.prototype.visitActionBinding = function(actionBinding){};       
    MbaDirectiveVisitor.prototype.beforeVisitTransformation = function(transformation){};  
    MbaDirectiveVisitor.prototype.afterVisitTransformation = function(transformation){};  
}

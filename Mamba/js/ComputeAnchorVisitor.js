function ComputeAnchorVisitor = function(template){
    
    this._template;
    
    //TODO à finir d'écrire
    
    ComputeAnchorVisitor.prototype.init = function(template){
        checkType(template, MbaDom);
        this._template = template;  
    };
    
    MbaDirectiveVisitor.prototype.beforeVisitDirective = function(directive){
        checkType(directive, MbaDirective2);
    };
    
    MbaDirectiveVisitor.prototype.beforeVisitBinding = function(binding){
        checkType(binding, MbaBinding2);
    };    
    
    if(arguments.length != 0){
        this.init(template);    
    }
}
ComputeAnchorVisitor.prototype = new MbaDirectiveVisitor();
ComputeAnchorVisitor.prototype.constructor = ComputeAnchorVisitor;
function MbaRootDirective(precursor){
    //TODO : precursor peut etre un tableau de directives
    
    this._rootSelector;
    
    MbaRootDirective.prototype.init = function(precursor){
        MbaDirective2.prototype.init.call(this, precursor);    
    };
    
    MbaRootDirective.prototype.initDirectiveAccessorChain = function(parentPropertyName){
        this._accessorChain = new MbaAccessorChain();
    };
    
    MbaRootDirective.prototype.connectBindingEvents = function(){
        var visitor = new ConnectEventsVisitor();
        this.visit(visitor);
    };
    
    MbaRootDirective.prototype.debug = function(){
        var visitor = new MbaDirectiveDebugVisitor();
        this.visit(visitor);
    };
    
    if(arguments.length != 0){
        this.init(precursor);
    }
}
MbaRootDirective.prototype = new MbaDirective2();
MbaRootDirective.prototype.constructor = MbaRootDirective;
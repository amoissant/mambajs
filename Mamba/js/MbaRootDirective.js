function MbaRootDirective(precursor){
    //TODO : precursor peut etre un tableau de directives
    
    this._rootSelector;
    
    MbaRootDirective.prototype.init = function(precursor){
        MbaDirective.prototype.init.call(this, precursor);    
    };
    
    MbaRootDirective.prototype.initDirectiveAccessorChain = function(parentPropertyName){
        this._accessorChain = new MbaAccessorChain();
    };
    
    MbaRootDirective.prototype.debug = function(){
        var visitor = new MbaDirectiveDebugVisitor();
        this.accept(visitor);
    };
    
    if(arguments.length != 0){
        this.init(precursor);
    }
}
MbaRootDirective.prototype = new MbaDirective();
MbaRootDirective.prototype.constructor = MbaRootDirective;
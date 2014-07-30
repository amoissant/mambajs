function MbaDirectiveDebugVisitor(){
    
    this._deep = 0;
    
    MbaDirectiveDebugVisitor.prototype.beforeVisitDirective = function(directive){
        checkType(directive, MbaDirective);
        this._deep++;
        console.log(this.getIndentation(), directive);
    };
    
    MbaDirectiveDebugVisitor.prototype.afterVisitDirective = function(directive){
        checkType(directive, MbaDirective);
        this._deep--;
    };
    
    MbaDirectiveDebugVisitor.prototype.beforeVisitBinding = function(binding){
        checkType(binding, MbaBinding);
        this._deep++;
        console.log(this.getIndentation(), binding);
    };
    
    MbaDirectiveDebugVisitor.prototype.afterVisitBinding = function(binding){
        checkType(binding, MbaBinding);
        this._deep--;
    };
    
    MbaDirectiveDebugVisitor.prototype.beforeVisitTransformation = function(transformation){
        checkType(transformation, MbaTransf);
        this._deep++;
        console.log(this.getIndentation(), transformation);
    };
    
    MbaDirectiveDebugVisitor.prototype.afterVisitTransformation = function(transformation){
        checkType(transformation, MbaTransf);
        this._deep--;
    };
    
    MbaDirectiveDebugVisitor.prototype.visitAccessorChain = function(accessorChain){
        checkType(accessorChain, MbaAccessorChain);
        this._deep++;
        console.log(this.getIndentation(), accessorChain.toString());
        this._deep--;
    };
    
    MbaDirectiveDebugVisitor.prototype.getIndentation = function(){
		var indentation = '';
		for(var i=0 ; i<this._deep ; i++){
			indentation += '    ';
		}
		return indentation;
	};
}
MbaDirectiveDebugVisitor.prototype = new MbaDirectiveVisitor();
MbaDirectiveDebugVisitor.prototype.constructor = MbaDirectiveDebugVisitor;
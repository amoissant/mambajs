function MbaDirectiveDebugVisitor(){
    
    this._deep = 0;
    
    MbaDirectiveDebugVisitor.prototype.beforeVisitDirective = function(directive){
        checkType(directive, MbaDirective);
        this._deep++;
        console.log(this.getIndentation()+directive.constructor.name, directive.getRepresentation());
    };
    
    MbaDirectiveDebugVisitor.prototype.afterVisitDirective = function(directive){
        checkType(directive, MbaDirective);
        this._deep--;
    };
    
    MbaDirectiveDebugVisitor.prototype.beforeVisitBinding = function(binding){
        checkType(binding, MbaBinding);
        this._deep++;
        console.log(this.getIndentation()+binding.constructor.name, binding.getRepresentation());
    };
    
    MbaDirectiveDebugVisitor.prototype.afterVisitBinding = function(binding){
        checkType(binding, MbaBinding);
        this._deep--;
    };
    
    MbaDirectiveDebugVisitor.prototype.beforeVisitTransformation = function(transformation){
        checkType(transformation, MbaTransf);
        this._deep++;
        console.log(this.getIndentation()+transformation.constructor.name, transformation.getRepresentation());
    };
    
    MbaDirectiveDebugVisitor.prototype.afterVisitTransformation = function(transformation){
        checkType(transformation, MbaTransf);
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
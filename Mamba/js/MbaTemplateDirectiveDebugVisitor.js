function MbaTemplateDirectiveDebugVisitor(){
    this._deep = 0;
}
MbaTemplateDirectiveDebugVisitor.prototype = new MbaTemplateDirectiveVisitor();
MbaTemplateDirectiveDebugVisitor.prototype.constructor = MbaTemplateDirectiveDebugVisitor;

MbaTemplateDirectiveDebugVisitor.prototype.beforeVisitTemplateDirective = function(templateDirective){       
    checkType(templateDirective, MbaTemplateDirective);  
    this._deep++;
    console.log(this.getIndentation()+templateDirective.constructor.name, templateDirective.getRepresentation());
};

MbaTemplateDirectiveDebugVisitor.prototype.afterVisitTemplateDirective = function(templateDirective){
    checkType(templateDirective, MbaTemplateDirective);  
    this._deep--;
};

MbaTemplateDirectiveDebugVisitor.prototype.beforeVisitTemplateBinding = function(templateBinding){
    checkType(templateBinding, MbaTemplateBinding);  
    this._deep++;
    console.log(this.getIndentation()+templateBinding.constructor.name, templateBinding.getRepresentation());
};

MbaTemplateDirectiveDebugVisitor.prototype.afterVisitTemplateBinding = function(templateBinding){
    checkType(templateBinding, MbaTemplateBinding);  
    this._deep--;
};

MbaTemplateDirectiveDebugVisitor.prototype.beforeVisitTransformation = function(transformation){
    checkType(transformation, MbaTransf);
    this._deep++;
    console.log(this.getIndentation()+transformation.constructor.name, transformation.getRepresentation());
};

MbaTemplateDirectiveDebugVisitor.prototype.afterVisitTransformation = function(transformation){
    checkType(transformation, MbaTransf);
    this._deep--;
};

MbaTemplateDirectiveDebugVisitor.prototype.getIndentation = function(){
	var indentation = '';
	for(var i=0 ; i<this._deep ; i++){
		indentation += '    ';
	}
	return indentation;
};
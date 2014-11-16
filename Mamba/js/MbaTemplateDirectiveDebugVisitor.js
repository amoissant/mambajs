function MbaTemplateDirectiveDebugVisitor(){
    this._deep = 0;
}
MbaTemplateDirectiveDebugVisitor.ptototype = new MbaTemplateDirectiveVisitor();
MbaTemplateDirectiveDebugVisitor.ptototype.constructor = MbaTemplateDirectiveDebugVisitor;

MbaTemplateDirectiveDebugVisitor.prototype.beforeVisitTemplateDirective = function(templateDirective, directiveIndex){       
    this._deep++;
};

MbaTemplateDirectiveDebugVisitor.prototype.afterVisitTemplateDirective = function(templateDirective, directiveIndex){
    this._deep--;
};

MbaTemplateDirectiveDebugVisitor.prototype.beforeVisitTemplateBinding = function(templateBinding, directiveIndex, bindingIndex){
    this._deep++;
};

MbaTemplateDirectiveDebugVisitor.prototype.afterVisitTemplateBinding = function(templateBinding, directiveIndex, bindingIndex){
      this._deep--;
};

MbaTemplateDirectiveDebugVisitor.prototype.beforeVisitTransformation = function(transformation){
    this._deep++;
};

MbaTemplateDirectiveDebugVisitor.prototype.afterVisitTransformation = function(transformation){
    this._deep--;
};

MbaTemplateDirectiveDebugVisitor.prototype.getIndentation = function(){
	var indentation = '';
	for(var i=0 ; i<this._deep ; i++){
		indentation += '    ';
	}
	return indentation;
};
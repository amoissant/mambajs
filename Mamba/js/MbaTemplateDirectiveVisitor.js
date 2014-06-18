function MbaTemplateDirectiveVisitor(){
    MbaTemplateDirectiveVisitor.prototype.beforeVisitSubTemplateDirectives = function(subTemplateDirectives, directiveIndex){};
    MbaTemplateDirectiveVisitor.prototype.afterVisitSubTemplateDirectives = function(subTemplateDirectives, directiveIndex){};
    MbaTemplateDirectiveVisitor.prototype.beforeVisitTemplateDirective = function(templateDirective, directiveIndex){};
    MbaTemplateDirectiveVisitor.prototype.afterVisitTemplateDirective = function(templateDirective, directiveIndex){};
    MbaTemplateDirectiveVisitor.prototype.visitTemplateBinding = function(templateBinding, directiveIndex, bindingIndex){};
}
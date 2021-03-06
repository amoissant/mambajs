function TemplateDirectiveConstructorVisitor(template, rootDirective){

    this._template;
    this._rootDirective;
    this._rootTemplateDirective;
    this._subTemplates;
    this._templateDirectives;
    
    if(arguments.length != 0){
        this.init(template, rootDirective);
    }
    
}
TemplateDirectiveConstructorVisitor.prototype = new MbaDirectiveVisitor();
TemplateDirectiveConstructorVisitor.prototype.constructor = new TemplateDirectiveConstructorVisitor();

    
TemplateDirectiveConstructorVisitor.prototype.init = function(template, rootDirective){
    checkType(template, MbaDom);
    checkType(rootDirective, MbaRootDirective);
    
    this._template = template;
    this._rootDirective = rootDirective;
    this._rootTemplateDirective = null;
    this._subTemplates = [template];
    this._templateDirectives = [];
};

TemplateDirectiveConstructorVisitor.prototype.beforeVisitDirective = function(directive){
    checkType(directive, MbaDirective);
    var subTemplate;
    if(directive.hasRoot())
        subTemplate = this.getRelativeTemplate().find(directive.getRootSelector());
    else
        subTemplate = this.getRelativeTemplate();
    this._subTemplates.push(subTemplate);
    
    var templateDirective = new MbaTemplateDirective(this.getRelativeTemplate(), directive);
    this._templateDirectives.push(templateDirective);
};

TemplateDirectiveConstructorVisitor.prototype.afterVisitDirective = function(directive){
    checkType(directive, MbaDirective);
    this._subTemplates.pop();
    
    var visitedTemplateDirective = this.getCurrentTemplateDirective();
    if(this._templateDirectives.length > 1){
        var parentTemplateDirective = this._templateDirectives[this._templateDirectives.length-2];
        parentTemplateDirective.addSubTemplateDirective(visitedTemplateDirective);
    }
    this._rootTemplateDirective = visitedTemplateDirective;
    this._templateDirectives.pop();
};

TemplateDirectiveConstructorVisitor.prototype.beforeVisitBinding = function(binding){
    checkType(binding, MbaBinding);    
    var relativeTemplate = this.getRelativeTemplate();
    var templateBinding = new MbaTemplateBinding(relativeTemplate, binding);
    this.getCurrentTemplateDirective().addTemplateBinding(templateBinding);
};        

//TODO factoriser code avec AddtextNodesVisitor
TemplateDirectiveConstructorVisitor.prototype.getRelativeTemplate = function(){
  return this._subTemplates[this._subTemplates.length-1];  
};

TemplateDirectiveConstructorVisitor.prototype.getCurrentTemplateDirective = function(){
    return this._templateDirectives[this._templateDirectives.length-1];
}

TemplateDirectiveConstructorVisitor.prototype.getRootTemplateDirective = function(){
  return this._rootTemplateDirective;  
};

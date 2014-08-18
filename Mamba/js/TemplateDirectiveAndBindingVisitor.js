function TemplateDirectiveAndBindingVisitor(template, rootDirective){
    
    this._template;
    this._rootDirective;
    this._rootTemplateDirective;
    this._subTemplates;
    this._templateDirectives;
    
    TemplateDirectiveAndBindingVisitor.prototype.init = function(template, rootDirective){
        checkType(template, MbaDom);
        checkType(rootDirective, MbaRootDirective);
        
        this._template = template;
        this._rootDirective = rootDirective;
        this._rootTemplateDirective = null;
        this._subTemplates = [template];
        this._templateDirectives = [];
    };
    
    TemplateDirectiveAndBindingVisitor.prototype.beforeVisitDirective = function(directive){
        checkType(directive, MbaDirective);
        //TODO extract method
        if(directive.hasRoot()){
            var subTemplate = this.getRelativeTemplate().find(directive.getRootSelector());
            this._subTemplates.push(subTemplate);
        }
        else
            this._subTemplates.push(this.getRelativeTemplate());
        
        var templateDirective = new MbaTemplateDirective(this.getRelativeTemplate(), directive);
        this._templateDirectives.push(templateDirective);
    };
    
    TemplateDirectiveAndBindingVisitor.prototype.afterVisitDirective = function(directive){
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
    
    TemplateDirectiveAndBindingVisitor.prototype.beforeVisitBinding = function(binding){
        checkType(binding, MbaBinding);
        if(binding instanceof MbaBindingText)
            console.log("MbaBindingText");
        
        var templateBinding = new MbaTemplateBinding(this.getRelativeTemplate(), binding);
        this.getCurrentTemplateDirective().addTemplateBinding(templateBinding);
    };        
    
    //TODO factoriser code avec AddtextNodesVisitor
    TemplateDirectiveAndBindingVisitor.prototype.getRelativeTemplate = function(){
      return this._subTemplates[this._subTemplates.length-1];  
    };
    
    TemplateDirectiveAndBindingVisitor.prototype.getCurrentTemplateDirective = function(){
        return this._templateDirectives[this._templateDirectives.length-1];
    }
    
    TemplateDirectiveAndBindingVisitor.prototype.getRootTemplateDirective = function(){
      return this._rootTemplateDirective;  
    };
    
    if(arguments.length != 0){
        this.init(template, rootDirective);
    }
    
}
TemplateDirectiveAndBindingVisitor.prototype = new MbaDirectiveVisitor();
TemplateDirectiveAndBindingVisitor.prototype.constructor = new TemplateDirectiveAndBindingVisitor();
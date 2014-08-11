function MbaTemplateDirective(template, directive){
    
    this._accessorChain;
    this._rootSelector;
    this._template;
    this._rootAnchor;
    this._templateBindings;
    this._subTemplateDirectives;
    //this._actionBindings;//à ajouter ici ?
    
    MbaTemplateDirective.prototype.init = function(template, directive){
        checkType(template, MbaDom);
        checkType(directive, MbaDirective);
        
        this._accessorChain = directive.getAccessorChain();
        this._rootSelector = directive.getRootSelector();
        //this._actionBindings = directive.getActionBindings();
        this._template = template;
        this._templateBindings = [];
        this._subTemplateDirectives = [];
    };
    
    MbaTemplateDirective.prototype.getAccessorChain = function(){
      return this._accessorChain;  
    };
    
    MbaTemplateDirective.prototype.hasRoot = function(){
        return this._rootSelector != null;
    };
    
    MbaTemplateDirective.prototype.getRootAnchor = function(){
        if(this._rootAnchor == null){
            this.findRootAnchor();
        }
        return this._rootAnchor;
    };
    
    MbaTemplateDirective.prototype.findRootAnchor = function(){
        if(this.hasRoot())
            this._rootAnchor = this._template.find2(this._rootSelector);
        else
            this._rootAnchor = this._template;
    };
 
    MbaTemplateDirective.prototype.getTemplateBindings = function(){
        return this._templateBindings;    
    };
    
    MbaTemplateDirective.prototype.addTemplateBinding = function(templateBinding){
        checkType(templateBinding, MbaTemplateBinding);
        this._templateBindings.push(templateBinding);
    };
    
    MbaTemplateDirective.prototype.addSubTemplateDirective = function(subTemplateDirective){
        checkType(subTemplateDirective, MbaTemplateDirective);
        this._subTemplateDirectives.push(subTemplateDirective);
    };
    
    MbaTemplateDirective.prototype.getSubTemplateDirectives = function(){
      return this._subTemplateDirectives;  
    };
    
    MbaTemplateDirective.prototype.accept = function(visitor, index){
        checkType(visitor, MbaTemplateDirectiveVisitor);
        checkTypeOrNull(index, 'number');
        if(index == null)
            index = 0;
        visitor.beforeVisitTemplateDirective(this, index);
        for(var i=0 ; i<this._templateBindings.length ; i++){
            visitor.visitTemplateBinding(this._templateBindings[i], index, i);
        }
        visitor.beforeVisitSubTemplateDirectives(this._subTemplateDirectives, index);
        for(var i=0 ; i<this._subTemplateDirectives.length ; i++){
            this._subTemplateDirectives[i].accept(visitor, i);
        }        
        visitor.afterVisitSubTemplateDirectives(this._subTemplateDirectives, index);
        visitor.afterVisitTemplateDirective(this, index);
    };
    
    MbaTemplateDirective.prototype.match = function(test){
        checkType(test, 'object');
        var visitor = new TestTemplateDirectiveVisitor(test);
        this.accept(visitor);
        return visitor.testSucceed();
    }
    
    MbaTemplateDirective.prototype.mergeBindings = function(){
        var bindingMap = {};
        for(var i=0 ; i<this._templateBindings.length ; i++){
            var currTemplateBinding = this._templateBindings[i];
            var anchorId = currTemplateBinding.getAnchor().getId();
            if(bindingMap[anchorId])
                bindingMap[anchorId].addAllTransformations(currTemplateBinding);
            else
                bindingMap[anchorId] = currTemplateBinding;
        }
        
        this._templateBindings = [];
        for(var anchorId in bindingMap){
            this._templateBindings.push(bindingMap[anchorId]);
        }
    };
    
    MbaTemplateDirective.prototype.recursiveMergeBindings = function(){
        this.mergeBindings();
        for(var i=0 ; i<this._subTemplateDirectives.length ; i++){
            this._subTemplateDirectives[i].mergeBindings();
        }
    };
    
    MbaTemplateDirective.prototype.addAllTemplateBindings = function(templateBindings){
        checkType(templateBindings , 'array', MbaTemplateBinding);
        for(var i=0 ; i<templateBindings.length ; i++){
            this.addTemplateBinding(templateBindings[i]);
        }
    };
    
    MbaTemplateDirective.prototype.mergeSubDirectives = function(){
        var directiveMap = {};
        for(var i=0 ; i<this._subTemplateDirectives.length ; i++){
            var currTemplateDirective = this._subTemplateDirectives[i];
            var anchorId = currTemplateDirective.getRootAnchor().getId();
            if(directiveMap[anchorId])
                directiveMap[anchorId].addAllTemplateBindings(currTemplateDirective.getTemplateBindings());
            else
                directiveMap[anchorId] = currTemplateDirective;
        }
        
        this._subTemplateDirectives = [];
        for(var anchorId in directiveMap){
            this._subTemplateDirectives.push(directiveMap[anchorId]);
        }
    };
    
    MbaTemplateDirective.prototype.recursiveMergeSubDirectives = function(){
        this.mergeSubDirectives();
        for(var i=0 ; i<this._subTemplateDirectives.length ; i++){
            this._subTemplateDirectives[i].recursiveMergeSubDirectives();
        }
    };    
    
    MbaTemplateDirective.prototype.getModelValue = function(model, route){
        checkType(route, MbaRoute);
        return this._accessorChain.getModelValueFromRoute(model, route);
    };
    
    MbaTemplateDirective.prototype.getLastRoute = function(){
        return this._accessorChain.getLastRoute();
    };
    
    MbaTemplateDirective.prototype.shortenRoute = function(route){
        checkType(route, MbaRoute);
        return this._accessorChain.shortenRoute(route);
    };
    
    if(arguments.length != 0){
        this.init(template, directive);
    }
}
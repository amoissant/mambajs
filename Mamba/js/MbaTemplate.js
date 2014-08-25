function MbaTemplate(template, directivesPrecursor){
    
    this._rootDirective;
    this._html;
    this._template;
    this._templateDirective;
    this._rootNode;
    this._isReadyForRender;
    this._superModel;
    
    MbaTemplate.prototype.init = function(template, directivesPrecursor){
        checkType(template, 'string');
        checkType(directivesPrecursor, 'object');
        
        this._rootDirective = new MbaRootDirective(directivesPrecursor);
        this._html = template;
        this.removeWhiteSpacesFromHtml();
        this._template = new MbaDomFromString(this._html);
        this._templateDirective = null;
        this._rootNode = null;
        this._isReadyForRender = false;
    };
    
    MbaTemplate.prototype.getRootDirective = function(){
        return this._rootDirective;    
    };
    
    MbaTemplate.prototype.getTemplate = function(){
        return this._template;
    };
    
    MbaTemplate.prototype.getTemplateDirective = function(){
        return this._templateDirective;    
    };
    
    MbaTemplate.prototype.getRootNode = function(){
        return this._rootNode;    
    };
    
    MbaTemplate.prototype.findDom = function(selector){
        checkType(selector, 'string');
        return this._template.find(selector);
    };
    
    MbaTemplate.prototype.findOneMaxDom = function(selector){
        checkType(selector, 'string');
        return this._template.findOneMax(selector);
    };
    
    MbaTemplate.prototype.findInRenderedDom = function(selector){
        checkType(selector, 'string');
        return this._rootNode.getRenderedDom().find(selector);
    };
    
    MbaTemplate.prototype.selectInRenderedDom = function(selector){
        checkType(selector, 'string');
        return this._rootNode.getRenderedDom().select(selector);
    };
    
    MbaTemplate.prototype.removeWhiteSpacesFromHtml = function(){
		this._html = this._html.replace(/>\s*</g, "><");
	};
    
    MbaTemplate.prototype.addTextNodeForBindingText =function(){
        var visitor = new AddTextNodesVisitor(this._template);
        this._rootDirective.visit(visitor);
    };
        
    MbaTemplate.prototype.constructTemplateDirective = function(){
        this._template.addMbaId();
        var visitor = new TemplateDirectiveAndBindingVisitor(this._template, this._rootDirective);    
        this._rootDirective.visit(visitor);
        this._templateDirective = visitor.getRootTemplateDirective();
    };
    
    MbaTemplate.prototype.mergeTemplateDirectives = function(){
        this._templateDirective.recursiveMergeSubDirectives();
        this._templateDirective.recursiveMergeBindings();
    };  
        
    MbaTemplate.prototype.constructRootNode = function(){
		var constructor = new MbaNodeConstructor();
        constructor.constructTree(this._template);
        this._rootNode = constructor.getRootNode();
	};
    
    MbaTemplate.prototype.integrateMambaAndBindingNodes = function(){
        var visitor = new IntegrateBindingAndDirectiveNodesVisitor();
        this._templateDirective.accept(visitor);
    };
        
    MbaTemplate.prototype.addActionBindingsIntoNodes = function(){
        var visitor = new AddActionBindingIntoNodesVisitor(this._template);
        this._rootDirective.visit(visitor);//TODO renommer cette méthode en accept
    };
    
    MbaTemplate.prototype.updateDomForSuperModel = function(){
        this.render(this._superModel);    
    };
    
    MbaTemplate.prototype.updateDomForModel = function(model){
        if(model == this._superModel)
            return this.updateDomForSuperModel();
        
        var visitor = new GetNodesAndAccessorsVisitor(); 
        this._rootNode.accept(visitor); 
        visitor.constructAccessorNodes();
        var accessorTree = visitor.getRootAccessorNode();
        var modelFinder = new ModelFinder(accessorTree, this._superModel, model);//TOOD peut etre que c'est le ModelFinder qui devrait construire le accessorTree ?
        modelFinder.searchForWantedModel();
        if(!modelFinder.hasFoundModel())
            throw new MbaError(42, 'Passed model is not a sub model of super model');
        var route = modelFinder.getTargetRoute();
        var nodes = modelFinder.getTargetMbaNodes();
        for(var i=0 ; i<nodes.length ; i++){
            var currNode = nodes[i];
            var renderRoute = currNode.computeRenderRouteForRoute(route);
            currNode.render(this._superModel, renderRoute);
        }
    };
    
    MbaTemplate.prototype.prepareForRender = function(){
        this.addTextNodeForBindingText();
        this.constructTemplateDirective();
        this.mergeTemplateDirectives();
        this.constructRootNode();        
        this.integrateMambaAndBindingNodes();
        this.addActionBindingsIntoNodes();
        this._isReadyForRender = true;
    };
        
    MbaTemplate.prototype.render = function(model){
        checkTypeOrNull(model);
        if(!this._isReadyForRender)
            this.prepareForRender();
        this.updateSuperModelReference(model);
        this._rootNode.startRender(model);
    };
    
    MbaTemplate.prototype.getRenderedDom = function(){
        return this._rootNode.getRenderedDom();
    };
    
    MbaTemplate.prototype.updateSuperModelReference = function(model){
        if(this._superModel != model){
            this._superModel = model;
            var visitor = new UpdateSuperModelReferenceVisitor(model);
            this._rootNode.accept(visitor);//TODO le premier set du superModel dans les actionBinding doit se faire ici
        }
    };
    
    if(arguments.length != 0){
        this.init(template, directivesPrecursor);
    }
}
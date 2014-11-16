function MbaTemplate(template, directivesPrecursor){
    
    this._directivesPrecursor
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
        
        this._directivesPrecursor = directivesPrecursor;
        this._rootDirective = null;
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
    
    MbaTemplate.prototype.getSuperModel = function(){
        return this._superModel;    
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
    
    MbaTemplate.prototype.constructDirectivesTree = function(){
        this._rootDirective = new MbaRootDirective(this._directivesPrecursor);
    };
    
    MbaTemplate.prototype.addTextNodeForBindingText =function(){
        var visitor = new AddTextNodesVisitor(this._template);
        this._rootDirective.accept(visitor);
    };
        
    MbaTemplate.prototype.constructTemplateDirective = function(){
        this._template.addMbaId();
        var visitor = new TemplateDirectiveConstructorVisitor(this._template, this._rootDirective);    
        this._rootDirective.accept(visitor);
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
    
    MbaTemplate.prototype.integrateDirectiveAndBindingNodes = function(){
        var visitor = new IntegrateBindingAndDirectiveNodesVisitor();
        this._templateDirective.accept(visitor);
    };
        
    MbaTemplate.prototype.addActionBindingsIntoNodes = function(){
        var visitor = new AddActionBindingIntoNodesVisitor(this._template);
        this._rootDirective.accept(visitor);//TODO renommer cette méthode en accept
    };
    
    MbaTemplate.prototype.updateDomForSuperModel = function(){
        this.render(this._superModel);    
    };
    
    MbaTemplate.prototype.updateDomForModel = function(model){
        if(model == this._superModel)
            return this.updateDomForSuperModel();
        
        var modelFinder = new MbaModelFinder(this, model);
        this.checkModelBelongsSuperModel(modelFinder);
        this.refreshNodesForRoute(modelFinder.getCurrentMbaNodes(), modelFinder.getCurrentRoute());
    };    
    
    MbaTemplate.prototype.refresh = function(subModel){
        if(subModel != null){
            this.updateDomForModel(subModel);
        }
        else
            this.updateDomForSuperModel();
        return this.getRenderedDom().getElements();
    };
    
    MbaTemplate.prototype.checkModelBelongsSuperModel = function(modelFinder){
        checkType(modelFinder, MbaModelFinder);
        modelFinder.searchForWantedModel();
        if(!modelFinder.hasFoundModel())
            throw new Error('Passed model is not a sub model of super model');
    };
    
    MbaTemplate.prototype.refreshNodesForRoute = function(nodes, route){
        checkType(nodes, 'array', MbaNode);
        checkType(route, MbaRoute);
        for(var i=0 ; i<nodes.length ; i++){
            var currNode = nodes[i];
            var renderRoute = currNode.computeRenderRouteForRoute(route);
            nodes[i].updateForModelAndRoute(this._superModel, renderRoute);
        }
    };
    
    MbaTemplate.prototype.prepareForRender = function(){
        this.constructDirectivesTree();
        this.addTextNodeForBindingText();
        this.constructTemplateDirective();
        this.mergeTemplateDirectives();
        this.constructRootNode();        
        this.integrateDirectiveAndBindingNodes();
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
    
    MbaTemplate.prototype.generateRefreshMethod = function(){
        var methodeGenerator = new MbaRefreshMethodGenerator(this);
        methodeGenerator.generateMethods();
    };
    
    if(arguments.length != 0){
        this.init(template, directivesPrecursor);
    }
}
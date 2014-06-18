function MbaTemplate(template, directives){
	
	MbaTemplate.prototype.init = function(template, directives){
		checkType(template, 'string');//TODO etre plus permissif par la suite ?
		checkType(directives, 'object');
		
		template = this.removeWhiteSpacesFromTemplate(template);
		
		this._baseDom = new MbaDom(template);
		this._renderedDom = this._baseDom.clone2();
		this._parent = null;
		this._children = [];
		this._mambas = [];
		this._model = null;
		
		directives = toArray(directives);
		this.markTemplateRootElements();
		this.createMbaTemplate();
		this.createMambasForDirectives(directives);
		this.unmarkTemplateRootElements();
	};
	MbaTemplate.prototype.getModel = function(){
		return this._model;
	};
	MbaTemplate.prototype.setModel = function(model){
		this._model = model;
	};
	//Here we don't want to inherit MbaNodeMamba
	MbaTemplate.prototype.getRenderedDom = MbaNode.prototype.getRenderedDom;
	
	MbaTemplate.prototype.removeWhiteSpacesFromTemplate = function(template){
		return template.replace(/>\s*</g, "><");
	};
	MbaTemplate.prototype.markTemplateRootElements = function(){
		var dom = this._renderedDom.getDom();
		for(var i=0 ; i<dom.length ; i++){
			var currElement = dom[i];
			currElement.isTemplateRoot = true;
		}
	};
	MbaTemplate.prototype.unmarkTemplateRootElements = function(){
		var dom = this._renderedDom.getDom();
		for(var i=0 ; i<dom.length ; i++){
			var currElement = dom[i];
			delete currElement.isTemplateRoot;
		}
	};
	MbaTemplate.prototype.createMambasForDirectives = function(directives){
		for(var i=0 ; i<directives.length ; i++){
			this._mambas[i] = this.createMambaForOneDirective(directives[i]);
		}
	};
	MbaTemplate.prototype.createMambaForOneDirective = function(directive){
		checkType(directive, 'object');
		
		//TODO : comme un Mamba calcule ses sous-mambas à sa création on calcule plusieurs fois les sous-mambas ?
		var mamba = new Mamba(null, this._renderedDom, new MbaDirective(directive));//TODO le model ne sera plus une donnée du mamba.
		var mambaRoot = mamba.getRoot(this._renderedDom);
		var mambaRootNodes = this.getNodesFromMbaDom(mambaRoot);
		//ajouter les textNodes
		var mambaNode = new MbaNodeMamba(null, mambaRoot, mamba);//TODO : ne pas passer de parent au MbaNodeMamba
		mambaNode.setBaseChildrenNodes(mambaRootNodes);
		mambaNode.replaceHtmlNodesIntoMbaTemplate();
		return mamba;
	};	
	MbaTemplate.prototype.createMbaTemplate = function(){
		var constructor = new MbaNodeConstructor();
		var rootElements = this._renderedDom.getDom();
		var childrenNodes = constructor.createMbaNodesForElements(this, rootElements);
		this.setChildren(childrenNodes);
	};
	MbaTemplate.prototype.appendChildrenWithOffset = function(dom, offset){
		checkType(dom, MbaDom);
		checkType(offset, 'number');
		
		this.getRenderedDom().insertAtIndex2(dom, offset);
	};
	MbaTemplate.prototype.removeChildrenRangeInclude = function(startIndex, endIndex){
		checkType(startIndex, 'number');
		checkType(endIndex, 'number');
		
		return this.getRenderedDom().removeRangeInclude(startIndex, endIndex);
	};
	MbaTemplate.prototype.render = function(model){
		model = toArray(model);
		if(arguments.length > 0)
			this.setModel(model);
		
		this.callRenderOnChildren(this._model);
	};
	MbaTemplate.prototype.beforeVisitMe = function(visitor){
		visitor.beforeVisitMbaTemplate(this);
	};
	MbaTemplate.prototype.afterVisitMe = function(visitor){
		visitor.afterVisitMbaTemplate(this);
	};
	MbaTemplate.prototype.debug = function(){
	   //TODO refacto DebugVisitor pour utiliser MbaNodeVisitor
        var visitor = new DebugVisitor();
		this.visit(visitor);
	};
	
	if(arguments.length > 0)
		this.init(template, directives);		
}
MbaTemplate.prototype = new MbaNodeMamba();
MbaTemplate.prototype.constructor = MbaTemplate;
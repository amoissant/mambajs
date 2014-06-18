function Mamba(model, template, directive, modelAccessor){
	 
	this.model = model;
	this.template = template;
	this.baseTemplate = template;
	this.directive = directive;
	this.modelAccessorParam = modelAccessor;
	this.modelAccessorCollection;
	this.bindings = [];
	this.subMambas = [];
	this.renderedDom;
	this.renderedDomsWithRoot = {};
	
	if(!(template instanceof MbaDom))
		this.template = new MbaDom(this.template);
	if(!(this.directive instanceof MbaDirective))
		this.directive = new MbaDirective(this.directive);
	
	this.addModelAccessor = function(accessor){
		this.modelAccessorCollection.addAccessor(accessor);
	};
	
	this.setModel = function(model){
		this.model = model;
	};
	
	this.setTemplate = function(newTemplate){
		this.template = new MbaDom(newTemplate);
		this.init();
	};
	
	this.setDirective = function(newDirective){
		this.directive = new MbaDirective(newDirective);
		this.init();
	};
	
	this.hasRoot = function(){
		return this.directive.hasRoot();
	};

	this.renderRootOrNot = function(model, template){		
		model = this.getModelValue(model);
		model = toArray(model);		
		var renderedDom = new MbaDom();
		this.referenceMambaIntoModel(model);
		
		if(this.hasRoot())
			renderedDom = this.renderWithRoot(model, template);
		else
			renderedDom = this.renderNoRoot(model, template);
		
		this.insertRenderedDomIntoTemplate(renderedDom);
		return renderedDom;
	};
	
	this.renderWithRoot = function(model, template){	
		checkType(template, MbaDom);
		var renderedDom = new MbaDom();
				
		var domToDuplicate = template;
		var domToDuplicateString = template.toString();
		
		for(var i=0 ; i<model.length; i++){
			var currModel = model[i];
			renderedDomOneModel = this.renderOneModelWithRoot(currModel, i, domToDuplicate);
			renderedDom.concat(renderedDomOneModel);
		}	
		
		return renderedDom;
	};
	
	this.renderOneModelWithRoot = function(model, index, template){
		var duplicatedDom = template.clone();
		var subRenderedDoms = this.renderSubMambas(model, duplicatedDom);
		var renderedDomOneModel = this.renderBindings(model, duplicatedDom, index);
		//TODO : domToDuplicate peut etre un string et renderedDom un MbaDom pour plus de claretée/perf/debug
		renderedDomOneModel = this.insertSubMambas(subRenderedDoms, renderedDomOneModel);
		
		this.renderedDomsWithRoot[index] = renderedDomOneModel;//TODO : c'est pas le genre de propriété qu'il faut raz si on fait un setDirective ?
		return renderedDomOneModel;
	};
	
	this.renderSubMambas = function(model, template){
		checkType(template, MbaDom);
		
		var subRenderedDoms = [];
		for(var i=0 ; i<this.subMambas.length ; i++){
			var currSubMamba = this.subMambas[i];
			var parents = currSubMamba.getDomToDuplicate();
			var subRenderedDom = currSubMamba.renderRootOrNot(model, parents);	
			subRenderedDoms.push(subRenderedDom);
		}
		return subRenderedDoms;
	};
	
	this.renderBindings = function(model, template, modelIndex){
		for(var j=0 ; j<this.bindings.length ; j++){
			var currBinding = this.bindings[j];
			template = currBinding.renderWithRoot(model, template, modelIndex);
		}	
		return template;
	};
	
	this.insertSubMambas = function(subRenderedDoms, renderedDom){
		for(var i=0 ; i<subRenderedDoms.length ; i++){
			var currSubMamba = this.subMambas[i];
			var subTemplate = currSubMamba.getRoot(renderedDom);
			var subRenderedDom = subRenderedDoms[i];
			var children = subTemplate.removeParents();
			renderedDom.replace(children, subRenderedDom);
		}
		
		return renderedDom;
	};

	this.renderNoRoot = function(model, template){
		checkType(template, MbaDom);
		var renderedDom = new MbaDom();
				
		var domToDuplicate = template;

		var renderedDom = domToDuplicate.clone();
					
		for(var i=0 ; i<this.bindings.length ; i++){
			var currBinding = this.bindings[i];
			renderedDom = currBinding.renderNoRoot(model, renderedDom);
		}	

		if(this.subMambas.length > 0){
			console.log('WARNING : mamba sans root avec subMambas, ajouter les "r00t".');
		}
		
		//On a pas de root mais le modèle ne contient qu'un seul élément, on peut quand même faire un rendu
		if(model.length == 1){
			for(var j=0 ; j<this.subMambas.length ; j++){
				var currSubMamba = this.subMambas[j];
				var subTemplate = currSubMamba.getRoot(renderedDom);
				var subRenderedDom = currSubMamba.renderRootOrNot(model[0], subTemplate);
				renderedDom.replace(subTemplate, subRenderedDom);
			}
		}
		
		return renderedDom;
	};
	
	this.render = function(){
		//TODO : tester le réinit sur structure récursive
		this.modelAccessorCollection.reinit();
		
		var domToDuplicate = this.getDomToDuplicate();
		var dom = this.renderRootOrNot(this.model, domToDuplicate);
		
		selectHack(this.renderedDom.getDom());//TODO à appeler pour le refresh d'un select aussi ?
		
		//TODO rendre ce concept de 'baseTemplate plus facile à comprendre
		var baseTemplate = this.baseTemplate.clone();
		var domToReplace = this.getDomToDuplicate(baseTemplate);
		baseTemplate.replace(domToReplace, this.renderedDom);
		
		return baseTemplate.getDom();
	};
	
	this.insertRenderedDomIntoTemplate = function(renderedDom){
		checkType(renderedDom, MbaDom);
		
		var template = this.template.clone();
		var domToReplace = this.getDomToDuplicate(template);
		this.renderedDom = template;
		this.renderedDom.replace(domToReplace, renderedDom);
	}; 
	
	//TODO : mettre à jour la prop renderedDom une fois le rendu fait
	this.updateRootOrNot = function(model, parentDom){		
		
		model = this.getModelValue(model);
		model = toArray(model);
		
		if(parentDom == null)
			parentDom = this.renderedDom;
		
		this.referenceMambaIntoModel(model);
		
		if(this.hasRoot())
			return this.updateWithRoot(model, parentDom);
		else
			return this.updateNoRoot(model, parentDom);
	};
	
	this.updateNoRoot = function(model, parentDom){
		checkType(model, 'array', 'object');
		checkType(parentDom, MbaDom);
		
		for(var i=0 ; i<this.bindings.length ; i++){
			var currBinding = this.bindings[i];
			if(currBinding.renderedDomIsEmpty()){
				//TODO : la position ca marche 'à plat', est-ce qu'on peut retrouver la position en profondeur ?
				var bindingRenderedDom = currBinding.updateNoRoot(model, this.template);
				var position = this.findPositionOfBinding(currBinding);
				parentDom.insertAtIndex(bindingRenderedDom, position);
			}
			else
				currBinding.updateNoRoot(model, this.template);
		}	
		
		if(model.length == 1){
			for(var j=0 ; j<this.subMambas.length ; j++){
				var currSubMamba = this.subMambas[j];
				currSubMamba.updateRootOrNot(model[0], this.renderedDom);
			}
		}
	};
	
	this.updateWithRoot = function(model, parentDom){
		checkType(model, 'array', 'object');
		checkType(parentDom, MbaDom);
		
		var oldModelSize = Object.keys(this.renderedDomsWithRoot).length;
		var newModelSize = model.length;
		
		var updateIndex = oldModelSize;
		if(oldModelSize > newModelSize)
			updateIndex = newModelSize;
		
		for(var i=newModelSize ; i<oldModelSize ; i++){
			var currDomToDelete = this.renderedDomsWithRoot[i];
			currDomToDelete.removeFromDom();
			delete this.renderedDomsWithRoot[i];
			this.renderedDom.remove(currDomToDelete);
		}
		
		for(var i=0 ; i<updateIndex; i++){
			var currModel = model[i];
		
			for(var j=0 ; j<this.bindings.length ; j++){
				var currBinding = this.bindings[j];
				var updatedDomOneModel = currBinding.updateWithRoot(currModel, i);
			}
			
			//TODO factoriser cette boucle avec celle d'updateNoRoot
			for(var j=0 ; j<this.subMambas.length ; j++){
				var currSubMamba = this.subMambas[j];
				currSubMamba.updateRootOrNot(currModel, this.renderedDom);
			}
		}
		
		for(var i=oldModelSize ; i<newModelSize ; i++){
			var currModel = model[i];
			var domToDuplicate = this.getDomToDuplicate();
			var renderedDomOneModel = this.renderOneModelWithRoot(currModel, i, domToDuplicate);
			this.renderedDom.concat(renderedDomOneModel);//TODO ca marche si renderedDom est null (le précédent modèle était null) ?
		}
	};
	
	//TODO : tu
	this.findPositionOfBinding = function(binding){
		var position = 0;
		
		var templateDom = this.template.getDom();
		for(var i=0 ; i<templateDom.length ; i++){
			var currTemplateElement = templateDom[i];
			
			if(isATextNode(currTemplateElement))
				continue;
			
			var currTemplateElementIsBindingAnchor = false;
			
			if(binding.getAnchor(this.template).getDom()[0] == currTemplateElement)
				return position;
				
			for(var j=0 ; j<this.bindings.length ; j++){
				var currBinding = this.bindings[j];
				var currBindingAnchor = currBinding.getAnchor(this.template).getDom()[0];//TODO implémenter méthode equals sur les MbaDom qui compare les éléments de dom
				if(currTemplateElement == currBindingAnchor){
					currTemplateElementIsBindingAnchor = true;
					break;
				}
			}
			
			if(currTemplateElementIsBindingAnchor){
				//position += currBinding.getRenderedDomLength();
				position += currBinding.renderedDomLength();//TODO faire du ménage entre getRenderedDomLength et renderedDomLength 
			}
			else{
				position += 1;
			}
		}
		return -1;
	};
	

	
	this.populate = function(){
		this.updateRootOrNot(this.model);
	};
	
	this.computeSubMambas = function(){
		//TODO que faire des sub-subDirectives qui sont dans une subDirective SANS root ?
		var subDirectives = this.directive.getSubDirectivesWithRoot();
		this.subMambas = [];

		for(var i=0 ; i<subDirectives.length ; i++){
			var currSubDirective = subDirectives[i];
			var currProp = currSubDirective.getParentProp(); 
			var accessor = new MbaFieldAccessor(currProp);
			var subTemplate = this.template; 

			var subMamba;
			if(currSubDirective.hasMamba()){
				subMamba = currSubDirective.getMamba();
				subMamba.addModelAccessor(accessor);
			}
			else
				subMamba = new Mamba(null, subTemplate, currSubDirective, accessor);
			
			this.subMambas.push(subMamba);
		}
	}
	
	this.computeBindings = function(){
		if(!this.template.hasMbaId())
			this.template.addMbaId();
		
		var bindings = this.directive.getMergedBindings();
		
		var bindingMap = {};
		for(var i=0 ; i<bindings.length ; i++){
			var currBinding = bindings[i];
			var anchor = currBinding.getAnchor(this.template);
			var domId = anchor.getId();
			
			if(bindingMap[domId] == null){
				currBinding.computeAnchor(this.template);
				bindingMap[domId] = currBinding;
			}
			else{
				bindingMap[domId].addAllTransformations(currBinding.getTransf())
			}		
		}
		this.bindings = [];
		for(var prop in bindingMap){
			this.bindings = this.bindings.concat(bindingMap[prop]);	
		}
	};
	
	this.getModelValue = function(superModel){
		//TODO : les classes MbaModelAccessorCollection et MbaModelSelfAccessor doivent-elles avoir une méthode setModelValue ? 
		return this.modelAccessorCollection.getModelValue(superModel);
	};

	this.getRoot = function(template){
		var rootSelector = this.directive.getRootSelector();
		if(rootSelector != null)
			return template.find(rootSelector);
		else
			return template;
	};
	
	this.getDomToDuplicate = function(template){
		if(template != null)//TODO écrire une fonction checkTypeIfNotNull ?
			checkType(template, MbaDom);
		
		if(template == null)
			template = this.template.clone();
	
		var root = this.getRoot(template).removeChildren();
		
		return root;
	};
	
	this.referenceMambaIntoModel = function(model){	
		for(var i=0 ; i<model.length ; i++){
			var currModel = model[i];
			currModel.mamba = this;
			currModel.populate = function(){
				this.mamba.setModel(this);
				this.mamba.populate();
			};
		}
	};
	
	this.init = function(){
		this.modelAccessorCollection = new MbaAccessorCollection();
		if(this.modelAccessorParam == null)
			this.addModelAccessor(new MbaModelSelfAccessor());
		else
			this.addModelAccessor(this.modelAccessorParam);
		
		this.directive.setMamba(this);
		this.computeBindings();
		this.computeSubMambas();
		
		this.baseTemplate = this.template;
		this.template = this.getRoot(this.template);
	};
	
	this.init();
}
function MbaBinding(cssSelector){

	this._selector;
	this._transformations;
	this._anchor;
	this._renderedDoms;
	this._oldModelSize;
	
	MbaBinding.prototype.init = function(cssSelector){
		checkType(cssSelector, 'string');
		
		this._selector = cssSelector;
		this._transformations = [];
		this._renderedDoms = {};
	};	
	
	MbaBinding.prototype.computeAnchor = function(template){
		checkType(template, MbaDom);
		this._anchor = this.getAnchor(template);
	};
	
	MbaBinding.prototype.getSelector = function(){
		return this._selector;
	};
	
	MbaBinding.prototype.getTransf = function(){
		return this._transformations;
	};
	
	this.getSelector = function(){
		return this._selector;
	};
	
	MbaBinding.prototype.getAnchor = function(template){
		checkType(template, MbaDom);
		
		var anchor = template.find(this._selector);
		anchor.removeChildren();
		return anchor;
	};
		
	MbaBinding.prototype.getRenderedDoms = function(index){
		if(index != null)
			return this._renderedDoms[index];
		else
			return this._renderedDoms;		
	};
	
	//TODO encore utilisé ?
	MbaBinding.prototype.getRenderedDomLength = function(){
		return Object.keys(this._renderedDoms).length;
		
	};
	
	MbaBinding.prototype.renderedDomIsEmpty = function(){
		//return this.getRenderedDomLength() == 0;
		var renderedDom = this.mergeRenderedDoms();
		return renderedDom.isEmpty();
	};
	
	MbaBinding.prototype.renderedDomLength = function(){
		var renderedDom = this.mergeRenderedDoms();
		return renderedDom.getDom().length;
	};
	
	//TODO mettre au propre getRenderedDomLength, getLength, renderedDomLength...
	MbaBinding.prototype.getLength = function(){
		var renderedDom = this.mergeRenderedDoms();
		return renderedDom.getLength();
	};
	
	MbaBinding.prototype.addTransformation = function(transformation){
		checkType(transformation, MbaTransf);
		
		this._transformations.push(transformation);        
        return this;
	};
	
	MbaBinding.prototype.addAllTransformations = function(transformations){
		checkType(transformations, 'array', MbaTransf);
		
		this._transformations = this._transformations.concat(transformations);
	};

	MbaBinding.prototype.renderWithRoot = function(model, template, modelIndex){
		checkType(model, 'object');
		checkType(template, MbaDom);
		checkType(modelIndex, 'number');
		
		//TODO comment optimiser en récursif ? en pas récursif on a pas besoin de rappeler cette fonction...
		this.computeAnchor(template);
		var renderedDom = this._anchor;
		for(var i in this._transformations){
			var currTransf = this._transformations[i];
			renderedDom = currTransf.render(renderedDom, model, modelIndex);
		}
		
		if(renderedDom == this._anchor)
			renderedDom = new MbaDom();
		
		this._renderedDoms[modelIndex] = renderedDom;
		
		template.replace(this._anchor, renderedDom);
		return template;
	};
	
	MbaBinding.prototype.updateWithRoot = function(model, modelIndex){
		checkType(model, 'object');
		checkType(modelIndex, 'number');
		
		//TODO factoriser du code avec updateNoRoot
		var renderedDom = this._renderedDoms[modelIndex];

		for(var i=0 ; i<this._transformations.length ; i++){
			var currTransf = this._transformations[i];
			renderedDom = currTransf.update(renderedDom, model, this._anchor, modelIndex);
		}
		this._renderedDoms[modelIndex] = renderedDom;
		
		return renderedDom;
	};
	
	
	//TODO que faire si le modèle ne contient pas le modèleValue ? supprimer l'élément de dom correspondant si toutes les transformations recoivent null comme model ?
	MbaBinding.prototype.renderNoRoot = function(model, template){
		checkType(model, 'array', 'object');
		checkType(template, MbaDom);
		
		this.computeAnchor(template);
		var renderedDom = new MbaDom();
		
		for(var i=0 ; i<model.length ; i++){
			var currModel = model[i];
			var currRenderedDom = this._anchor;
		
			currRenderedDom = this.renderNoRootOneModel(currModel,i, currRenderedDom);
			
			if(currRenderedDom == this._anchor)
				currRenderedDom = new MbaDom();
			
			renderedDom.concat(currRenderedDom);
			this._renderedDoms[i] = currRenderedDom;
		}
		
		template.replace(this._anchor, renderedDom);
		return template;
	};
	
	MbaBinding.prototype.renderNoRootOneModel = function(model, modelIndex, template){
		for(var j=0 ; j<this._transformations.length ; j++){
			var currTransf = this._transformations[j];
			template = currTransf.render(template, model, modelIndex);//TODO comme la transformation suivante se fait à partir du précédent, si deux transformations revoivent un tableau alors ca fait un produit cartésien, les résultats peuvent être bizarres, peut être ajouter ce cas à la validation
		}
		
		return template;
	};
	
	MbaBinding.prototype.updateNoRoot = function(model, template){
		checkType(model, 'array', 'object');
		checkType(template, MbaDom);
		
		this.computeAnchor(template);
		
		var newModelSize = model.length;
		var oldModelSize = Object.keys(this._renderedDoms).length; 
		
		var updateIndex = oldModelSize;
		if(oldModelSize > newModelSize)
			updateIndex = newModelSize;
		
		for(var i=0 ; i<updateIndex ; i++){
			var currModel = model[i];
			var currRenderedDom = this._renderedDoms[i];
			if(currRenderedDom.isEmpty()){
				currRenderedDom = this.renderNoRootOneModel(currModel, i, this._anchor);
			}else{
				currRenderedDom = this.updateNoRootOneModel(currModel, i, currRenderedDom);
			}
			this._renderedDoms[i] = currRenderedDom;
		}
		
		if(newModelSize < oldModelSize){
			for(var i=newModelSize ; i<oldModelSize ; i++){
				var currMbaDom = this._renderedDoms[i];
				currMbaDom.removeFromDom();
				delete this._renderedDoms[i];
			}
		}
		
		if(newModelSize > oldModelSize){
			//TODO factoriser ce code avec renderNoRoot()
			for(var i=oldModelSize ; i<newModelSize; i++){
				var currModel = model[i];
				var currRenderedDom = this.renderNoRootOneModel(currModel, i, this._anchor);
				this._renderedDoms[i] = currRenderedDom;
			}
		}
		
		var renderedDom = this.mergeRenderedDoms();		
		return renderedDom;
	};
	
	MbaBinding.prototype.updateNoRootOneModel = function(model, modelIndex, renderedDom){
		for(var j=0 ; j<this._transformations.length ; j++){
			var currTransf = this._transformations[j];
			renderedDom = currTransf.update(renderedDom, model, this._anchor, modelIndex);
		}
		
		return renderedDom;
	};
	
	/************************ Zone réécriture **************************/
		
	MbaBinding.prototype.render = function (model, template){
		checkType(model, 'array', 'object');
		checkType(template, MbaDom);
		
		var renderedDom = template.clone();
		for(var i=0 ; i<this._transformations.length ; i++){
			var currTransf = this._transformations[i];
			renderedDom = currTransf.render2(renderedDom, model);
		}
		
		return renderedDom;
	};
	
	MbaBinding.prototype.update = function (renderedDom, model){
		checkType(renderedDom, MbaDom);
		checkType(model, 'array', 'object');
		
		for(var i=0 ; i<this._transformations.length ; i++){
			var currTransf = this._transformations[i];
			currTransf.update2(renderedDom, model);
		}
		
		return renderedDom;
	};
	
	//TODO renommer en getRenderedDom ?
	MbaBinding.prototype.mergeRenderedDoms = function(){
		var renderedDom = new MbaDom();
		
		for(var prop in this._renderedDoms){
			var currDom = this._renderedDoms[prop];
			renderedDom.concat(currDom);
		}
		
		return renderedDom;
	};
	
	if(arguments.length > 0){
		this.init(cssSelector);
	}
};


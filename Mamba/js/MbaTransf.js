function MbaTransf(transf, accessor){
	
	checkType(transf, 'function');
	checkType(accessor, MbaAccessor);
	
	this.transf = transf;
	
	this.accessor = accessor;
	
	this.oldModelsValues = {};
	
	this.newModelValue = function(model){
		return this.accessor.getModelValue(model);
	};

	this.render = function(template, model, modelIndex){
		checkType(template, MbaDom);
		checkType(model, 'object');
		checkType(modelIndex, 'number');

		var renderedDom = new MbaDom(); 
		var modelValue = this.newModelValue(model);
		var modelValueArray = toArray(modelValue);
		
		for(var i=0 ; i<modelValueArray.length ; i++){
			var currModelValue = modelValueArray[i];
			var currRenderedDom = template.clone();
			
			var dom = currRenderedDom.getDom();
			for(var j=0 ; j<dom.length ; j++){
				this.transf(dom[j], currModelValue);
			}			
			
			renderedDom.concat(currRenderedDom);
		}
		
		if(renderedDom.isEmpty())
			renderedDom = template;
		
		this.oldModelsValues[modelIndex] = _.clone(modelValueArray);
		return renderedDom;
	};	
	
	this.update = function(dom, model, template, modelIndex){
		checkType(dom, MbaDom);
		checkType(template, MbaDom);
		checkType(model, 'object');
		checkType(modelIndex, 'number');
		
		var newModelValue = this.newModelValue(model);
		var newModelValueArray = toArray(newModelValue);
		var oldModelValues = this.oldModelsValues[modelIndex];
		var modelValueDomSize = dom.getDom().length/oldModelValues.length;
		
		var updatedDom = dom;
		
		var oldSize = oldModelValues.length;
		var newSize = newModelValueArray.length;
		
		if(newSize < oldSize){
			updatedDom.keepNthFirst(newModelValueArray.length);
		}
		else if(newSize > oldSize){
			var diff = newSize-oldSize;
			for(var i=0 ; i<diff ; i++){
				updatedDom.concat(template.clone());
			}
		}
		
		for(var i=0 ; i<newSize ; i++){
			var currModelValue = newModelValueArray[i];
			var oldModelValue = null;
			
			if(i<oldModelValues.length)
				oldModelValue = oldModelValues[i];
			
			for(var j=0 ; j<modelValueDomSize ; j++){
				this.transf(updatedDom.getDom()[i*modelValueDomSize+j], currModelValue, oldModelValue);
			}
		}
		
		return updatedDom;
	}
	
	/************************ Zone réécriture **************************/
	
	this.getModelValue = function(model){
		return this.accessor.getModelValue(model);
	};
	
	this.render2 = function(template, model){
		checkType(template, MbaDom);
		checkType(model, 'array', 'object');

		var renderedDom = new MbaDom();
		
		for(var i=0 ; i<model.length ; i++){
			var currModel = model[i];
			var currRenderedDom = this.render2OneModel(template, currModel);
			renderedDom.concat(currRenderedDom);
		}
		
		return renderedDom;
	};	
	
	this.render2OneModel = function(template, model){
		checkType(template, MbaDom);
		checkType(model, 'object');

		var renderedDom = template.clone();
		var modelValue = this.newModelValue(model);
		
		if($.isArray(modelValue))
			throw new Error("prévoir ce cas plus tard.");
		//TODO : cas particulier à implémenter 
		/*
		 * model = {list: [1, 2, 3]}
		 * directive = {list: "div"}
		 * 
		 * il faudrait ajouter une nouvelle nomenclature dans les directives '531f' ('self') pour indiquer un property accessor égal au modèle lui-même
		 * la directive ci-dessus serai alors trasnformée durant la phase computeBinding en :
		 * 
		 * {list: {531f: "div"}}
		 * 
		 *  Ce qui permettrait d'avoir un submamba à la place d'un binding et de gérer ce cas particulier 
		 */
		else{
			var domElement = renderedDom.getDom(0);//TODO tester quand l'ancre du binding représente plusieurs éléments -> est-ce que la phase compute binding permet ceci ? si non alors lever une erreur si on se retrouve avec plusieurs éléments de dom ici
			this.transf(domElement, modelValue);
		}
		
		return renderedDom;
	}
	
	this.render2OneModelValue = function(template, modelValue){
		checkType(template, MbaDom);
		//checkType(modelValue, 'object');//TODO checkType 'primitive' pour les types primitifs

		var renderedDom = template.clone();
		var domElement = renderedDom.getDom(0);//TODO tester quand l'ancre du binding représente plusieurs éléments -> est-ce que la phase compute binding permet ceci ? si non alors lever une erreur si on se retrouve avec plusieurs éléments de dom ici
		this.transf(domElement, modelValue);
		
		return renderedDom;
	}
	
	this.update2 = function(dom, model){
		checkType(dom, MbaDom);
		checkType(model, 'array', 'object');
		
		for(var i=0 ; i<model.length ; i++){
			var currModelValue = this.newModelValue(model[i]);
			var currDomElement = dom.getDom(i);
			this.transf(currDomElement, currModelValue);
		}
		
		//TODO: dans la version précédente on avait 'var modelValueDomSize = dom.getDom().length/oldModelValues.length;'
		//vérifier que l'on a pas perdu en fonctionnalités
	}
}
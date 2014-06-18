function MbaDirective(precursor, parentProp){
	
	this.rootSelector = null;
	this.parentProp = parentProp;
	this.data = {};
	this.mamba;
	
	precursor[MBA_CST.DIRECTIVE] = this;
	
	this.createOrRefrenceDirective = function(propValue, prop){
		checkType(propValue, 'object');
		checkType(prop, 'string');
		
		var directive;
		if(propValue[MBA_CST.DIRECTIVE]==null){					
			directive = new MbaDirective(propValue, prop);
		}
		else{
			directive = propValue[MBA_CST.DIRECTIVE];
			directive.parentProp = prop;//TODO que faire si une directive est utilisées dans plusieurs enfants et donc des parentProp différentes ? 
		}
		
		return directive;
	};
	
	this.createOrReferenceDirectiveArray = function(propValue, prop){
		checkType(propValue, 'array', 'object');
		checkType(prop, 'string');
		
		var directives = [];
		for(var i=0 ; i<propValue.length ; i++){
			var currDirective = this.createOrRefrenceDirective(propValue[i], prop);
			directives[i] = currDirective;
		}
		
		return directives;
	};
	
	this.getData = function(){
		return this.data;
	};
	
	this.getParentProp = function(){
		return this.parentProp;
	};
	
	this.getProp = function(prop){
		return this.data[prop];
	};
	
	this.hasRoot = function(){
		return this.rootSelector != null;
	};
	
	this.getMamba = function(){
		return this.mamba;
	};
	
	this.setMamba = function(mamba){
		checkType(mamba , Mamba);
		this.mamba = mamba;
	};
	
	this.hasMamba = function(){
		return this.mamba!= null;
	};
	
	this.getRootSelector = function(){
		return this.rootSelector;
	}
	
	this.isDirective = function(prop){
		return this.data[prop] instanceof MbaDirective;
	};
	
	this.isDirectiveArray = function(prop){
		var propValue = this.data[prop];
		if($.isArray(propValue)){
			for(var i=0 ; i<propValue.length ; i++){
				var currPropValue = propValue[i];
				if(!(currPropValue instanceof MbaDirective))
					return false;
			}
			return true;
		}
		else{
			return false;
		}		
	};
	
	this.getGuessedRoot = function(){
		var bindings = this.getAllBindings();
		if(bindings.length >= 1){
			return bindings[0].getSelector();
		}else
			return null
	};
	
	this.allBindingsHaveSameSelector = function(){
		var bindings = this.getAllBindings();
		if(bindings.length > 1){//TODO : voir pourquoi ca plante si on met '>=' au lieu de '>'
			var selector = bindings[0].getSelector();
			for(var i=1 ; i<bindings.length ; i++){
				var currBinding = bindings[i];
				if(currBinding.getSelector() != selector)
					return false;
			}
		}
		else
			return false;
		return true;		
	};
	
	this.getSubDirectivesWithRoot = function(){
		var subDirectives = [];
		for(var prop in this.data){
			var currPropValue = this.data[prop];
			if((this.isDirective(prop) && currPropValue.hasRoot()) || this.isDirectiveArray(prop)){
				subDirectives = subDirectives.concat(currPropValue);
			}
		}
		return subDirectives;
	};
	
	this.getSubDirectivesNoRoot = function(){
		var subDirectives = [];
		for(var prop in this.data){
			var currPropValue = this.data[prop];
			if(this.isDirective(prop) && !currPropValue.hasRoot()){
				subDirectives = subDirectives.concat(currPropValue);
			}
		}
		return subDirectives;
	};
	
	this.getAllBindings = function(){
		var bindings = [];
		for(var prop in this.data){
			var currPropValue = this.data[prop];
			if(!this.isDirective(prop) && !this.isDirectiveArray(prop)){
				bindings = bindings.concat(this.getBindings(prop));
			}
		}
		return bindings;
	};
	
	//TODO : on peut optimiser ici et faire des extract method...
	this.getMergedBindings = function(){
		var bindings = this.getAllBindings();
		for(var prop in this.data){
			var currPropValue = this.data[prop];
			if(this.isDirective(prop) && !currPropValue.hasRoot()){
				var subBindings = currPropValue.getAllBindings();
				for(var i=0 ; i<subBindings.length ; i++){
					var currSubBinding = subBindings[i];
					var transformations = currSubBinding.getTransf()
					for(var j=0 ; j<transformations.length ; j++){
						var currTransf = transformations[j];
						var chainAccessor = new MbaChainAccessor();
						chainAccessor.chainAccessor(currTransf.accessor);
						chainAccessor.chainAccessor(new MbaFieldAccessor(prop));
						currTransf.accessor = chainAccessor;
					}
				}
				bindings = bindings.concat(subBindings);
			}
		}
		
		return bindings;
	};
	
	//TODO : avec des regexp ca serait peut etre plus lisible
	this.splitOnComma = function (selector){
		var block = 0;
		var splitIndexes = [];
		for(var i=0 ; i<selector.length ; i++){
			var c = selector[i];
			
			if(c==',' && block==0)
				splitIndexes.push(i);
			else if(c=='{')
				block++
			else if(c=='}')
				block--;
		}
		
		if(block > 0)
			console.log('ERROR : invalid script : '+selector);
		
		var selectors = [];
		var previousSplitIndex = 0;
		for(var i=0 ; i<splitIndexes.length ; i++){
		  var currSplitIndex = splitIndexes[i];
		  var currSelector = selector.substring(previousSplitIndex, currSplitIndex);
          previousSplitIndex = currSplitIndex+1;          
          selectors.push(currSelector.trim());
		}
		
		var currSelector = selector.substring(previousSplitIndex, selector.length);
        selectors.push(currSelector.trim());
        
        return selectors;
	};
	
	this.getBindings = function(prop){
		var selector = this.data[prop];
		
		if(selector.lastIndexOf(',') >= 0){
			selector = this.splitOnComma(selector);
		}
		
		var result = [];
		
		selector = toArray(selector);
		for(var i=0 ; i<selector.length ; i++){
			var currSelector = selector[i];
			result[i] = this.getBinding(prop, currSelector);
		}
		
		return result;
	};
	
	//TODO blinder cette fonction pour détecter les erreurs et aider à l'utilisation
	this.getBinding = function(prop, selector){
		
		var mustacheStartIndex = selector.indexOf('{');
		var mustacheEndIndex = selector.lastIndexOf('}');
		var interrogationIndex = selector.lastIndexOf('?');
		var atIndex = selector.lastIndexOf('@');
		
		if(mustacheStartIndex > -1 && mustacheEndIndex > -1){
			if(interrogationIndex > -1 || atIndex > -1){
				console.log('ERREUR lors du parsage de '+selector);
				return null;
			}
				
			var script = selector.substring(mustacheStartIndex+1, selector.length-(selector.length-mustacheEndIndex));
			var script = 'var customFunction = '+script;
			eval(script);
			var element = selector.substring(0, mustacheStartIndex);
			
			return this.createMbaBinding(prop, element, null, customFunction);
		}
		
		if(interrogationIndex == -1){
			var attribute = null;
			var element = null;
			if(atIndex >= 0){
				attribute = selector.substring(atIndex+1, selector.length);
				element = selector.substring(0, atIndex);
				return this.createMbaBinding(prop, element, attribute, DOM_TRANSF.attr);
			}
			else{
				element = selector;
				return this.createMbaBinding(prop, element, null, DOM_TRANSF.text);
				//return this.createMbaBindingText(selector);
			}
		}
		else{
			if(atIndex - interrogationIndex != 2){
				console.log('ERREUR lors du parsage de '+selector);
				return null;
			}
			else{
				var operationSymbol = selector[atIndex-1];
				var attribute = null;
				var element = null;
				if(operationSymbol == '+' || operationSymbol == '-'){
					
					attribute = selector.substring(atIndex+1, selector.length);
					element = selector.substring(0, interrogationIndex);
					
					if(operationSymbol == '+'){
						return this.createMbaBinding(prop, element, attribute, DOM_TRANSF.addAttr);
					}
					else {
						return this.createMbaBinding(prop, element, attribute, DOM_TRANSF.remAttr);
					}
				}
				else{
					console.log('ERREUR lors du parsage de '+selector);
					return null;
				}
			}			
		}
	};
	
	
	
	this.createMbaBinding = function(prop, cssSelector, attribute, transf){
		var binding = new MbaBinding(cssSelector);
		
		var accessor = new MbaProxyAccessor(prop);
		var mbaTransf;
		
		if(attribute != null){
			var transformation = function(dom, newValue, oldValue){
				transf(dom, newValue, oldValue, attribute);
			};
			mbaTransf = new MbaTransf(transformation, accessor); 
		}else{
			mbaTransf = new MbaTransf(transf, accessor); 
		}
		
		binding.addTransformation(mbaTransf);
		
		return binding;
	};
	
    this.init = function () {
        //TODO : protection contre les directives récursives en cas de modèle récursif lui aussi ?
        if (isDirective(precursor)) { //TODO : en faire une méthode plutot que de l'appeler à la construction
            var properties = getDirectiveProperties(precursor);
            for (var i = 0; i < properties.length; i++) {
                var prop = properties[i];
                var propValue = precursor[prop];

                if (prop == MBA_CST.ROOT)
                    this.rootSelector = propValue;
                else if (isDirective(propValue))
                    this.data[prop] = this.createOrRefrenceDirective(propValue, prop);
                else if (isDirectiveArray(propValue))
                    this.data[prop] = this.createOrReferenceDirectiveArray(propValue, prop);
                else
                    this.data[prop] = propValue;
            }

            delete precursor[MBA_CST.DIRECTIVE];
        } else
            console.log('ERREUR : l\'objet passé n\'est pas une directive valide.');

        if (this.allBindingsHaveSameSelector()) {
            this.rootSelector = this.getGuessedRoot();
        }
    };
    
    this.init();
}
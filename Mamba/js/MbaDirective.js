function MbaDirective(precursor, parentPropertyName){
    
    this._precursor;
    this._bindings;
    this._subDirectives;
    this._rootSelector;
    this._accessorChain;
    this._actionBindings;
    
    MbaDirective.prototype.init = function(precursor, parentPropertyName){
        //checkType(precursor, 'object');//TODO checkTypeOrArrayOfType
        checkTypeOrNull(parentPropertyName, 'string');
        
        this._precursor = precursor;
        this._bindings = [];
        this._actionBindings = [];
        this._subDirectives = [];
        this._rootSelector = null;
        this.initDirectiveAccessorChain(parentPropertyName);
        this.parsePrecursor();
    };

    MbaDirective.prototype.getBindings = function(){
        return this._bindings;
    };
    
    MbaDirective.prototype.getActionBindings = function(){
        return this._actionBindings;
    };
    
    MbaDirective.prototype.getSubDirectives = function(){
        return this._subDirectives;
    };
    
    MbaDirective.prototype.hasRoot = function(){
        return this._rootSelector != null;
    };
    
    MbaDirective.prototype.getRootSelector = function(){
        return this._rootSelector;
    };
    
    MbaDirective.prototype.getAccessorChain = function(){
        return this._accessorChain;
    };
    
    MbaDirective.prototype.initDirectiveAccessorChain = function(parentPropertyName){
        this._accessorChain = this.createAccessorChain(parentPropertyName); 
    };
    
    MbaDirective.prototype.parsePrecursor = function(){
        for(var prop in this._precursor){
			var currPropValue = this._precursor[prop];
            if(prop == MBA_CST.ROOT){
                this._rootSelector = currPropValue;
            }
            else if(this.isSubDirective(currPropValue)){
				this.createSubDirective(currPropValue, prop);
			}
            else if(this.isArrayOfSubDirectives(currPropValue)){
                this.createDirectivesForArray(currPropValue, prop);
            }
			else if(this.isActionBinding(prop)){
                this.createActionBinding(prop);
            }
            else {
                this.createBindings(prop);
			}
		}   
    };
    
    MbaDirective.prototype.createSubDirective = function(precursor, parentPropertyName){
        checkType(precursor, 'object');
        checkType(parentPropertyName, 'string');
        
        var subDirective = new MbaDirective(precursor, parentPropertyName);
        subDirective.prependAccessors(this.getAccessorChain());
        if(!subDirective.hasRoot()){
            this._bindings = this._bindings.concat(subDirective.getBindings());
            this._subDirectives = this._subDirectives.concat(subDirective.getSubDirectives());
            this._actionBindings = this._actionBindings.concat(subDirective.getActionBindings());
        }
        else
            this._subDirectives.push(subDirective);
    };
    
    MbaDirective.prototype.prependAccessors = function(accessorChain){
        checkType(accessorChain, MbaAccessorChain);
        var bindings = this.getBindings();
        for(var i=0 ; i<bindings.length ; i++){
            bindings[i].prependAllAccessorsForTransformations(accessorChain);
        }
        var actionBindings = this.getActionBindings();
        for(var i=0 ; i<actionBindings.length ; i++){
            actionBindings[i].prependAccessors(accessorChain);
        }
        var subDirectives = this.getSubDirectives();
        for(var i=0 ; i<subDirectives.length ; i++){
            subDirectives[i].prependAccessors(accessorChain);
        }
        this.getAccessorChain().prependAll(accessorChain);
    };
    
    MbaDirective.prototype.createDirectivesForArray = function(precursorArray, parentPropertyName){
        checkType(precursorArray, 'array', 'object');
        checkType(parentPropertyName, 'string');
        
        for(var i=0 ; i<precursorArray.length ; i++){
            this.createSubDirective(precursorArray[i], parentPropertyName);
        }
    };
    
    MbaDirective.prototype.isSubDirective = function(propValue){
        return propValue instanceof Object && !(propValue instanceof Array);
    };
    
    MbaDirective.prototype.isArrayOfSubDirectives = function(propValue){
        return propValue instanceof Array;
    };
    
    MbaDirective.prototype.isActionBinding = function(prop){
        checkType(prop, 'string');
        return prop.indexOf('/') == 0;
    };
    
    MbaDirective.prototype.createBindings = function(prop){
        checkType(prop, 'string');
        
        var directive = this._precursor[prop];
        var splitter = new DirectiveSplitter();
        var splittedDirectives = splitter.splitDirective(directive);
        var bindings = [];		
        for(var i=0 ; i<splittedDirectives.length ; i++){
			var currDirective = splittedDirectives[i];
            var currBinding = this.createBinding(prop, currDirective);
            currBinding.prependAllAccessorsForTransformations(this.getAccessorChain());
			bindings[i] = currBinding;
		}
		this._bindings = this._bindings.concat(bindings);
	};
	
    MbaDirective.prototype.createBinding = function(prop, directive){
        checkType(prop, 'string');
        checkType(directive, 'string');
        
        var parser = new DirectiveParser();
        var transformation = parser.createTransformation(directive);
        var selector = parser.extractSelector();
        transformation.setAccessorChain(this.createAccessorChain(prop));
        var anchorProvider = parser.getAnchorProvider();
        return new MbaBinding(selector, anchorProvider, transformation);
    };
    
    MbaDirective.prototype.createAccessorChain = function(prop){
        var mbaAccessorChain = new MbaAccessorChain();
        mbaAccessorChain.prependAccessor(this.createAccessor(prop));
        return mbaAccessorChain;
    };
    
    MbaDirective.prototype.createAccessor = function(prop){
        //TODO : à enrichir pour tous les type d'accesseurs...
        return new MbaFieldAccessor(prop);
    };
       
    MbaDirective.prototype.createActionBinding = function(prop){
        checkType(prop, 'string');
        var action = prop.substring(1, prop.length);
        var directive = this._precursor[prop];
        var parser = new DirectiveParser();
        parser.setDirective(directive);
        parser.computeIndexes();
        var selector = parser.extractSelector();
        var events = parser.computeEvents();
        var accessorChain = this.getAccessorChain();
        var actionBinding = new MbaActionBinding(selector, accessorChain, action, events);
        this._actionBindings.push(actionBinding);
    };
    
    MbaDirective.prototype.visit = function(visitor){
        checkType(visitor, MbaDirectiveVisitor);
        visitor.beforeVisitDirective(this);
        for(var i=0 ; i<this._bindings.length ; i++){
            this._bindings[i].visit(visitor);
        }
        for(var i=0 ; i<this._actionBindings.length ; i++){
            this._actionBindings[i].visit(visitor);
        }
        for(var i=0 ; i<this._subDirectives.length ; i++){
            this._subDirectives[i].visit(visitor);
        }
        visitor.afterVisitDirective(this);
    };
    
    if(arguments.length != 0){
        this.init(precursor, parentPropertyName);
    }
}

function MbaBinding(cssSelector, anchorProvider, firstTransf){

	this._selector;
	this._transformations;
	this._anchor;
    this._anchorProvider;
	
	MbaBinding.prototype.init = function(cssSelector, anchorProvider, firstTransf){
		checkType(cssSelector, 'string');
        checkType(anchorProvider, AnchorProvider);
        checkType(firstTransf, MbaTransf);
		
		this._selector = cssSelector;
		this._transformations = [];
        this._anchorProvider = anchorProvider;
        this.addTransformation(firstTransf);
	};	
	
    MbaBinding.prototype.getAnchorProvider = function(){
        return this._anchorProvider;    
    };
    
    MbaBinding.prototype.prependAllAccessorsForTransformations = function(accessorChain){
        for(var i=0; i<this._transformations.length ; i++){
            this._transformations[i].getAccessorChain().prependAll(accessorChain);
        }    
    };
	
	MbaBinding.prototype.getSelector = function(){
		return this._selector;
	};
	
	MbaBinding.prototype.getTransformations = function(){
		return this._transformations;
	};
			
	MbaBinding.prototype.addTransformation = function(transformation){
		checkType(transformation, MbaTransf);
		
		this._transformations.push(transformation);        
        return this;
	};
    
	MbaBinding.prototype.update = function (renderedDom, model){
		checkType(renderedDom, MbaDom);
		checkType(model, 'array', 'object');
		
		for(var i=0 ; i<this._transformations.length ; i++){
			var currTransf = this._transformations[i];
			currTransf.update(renderedDom, model);
		}
		
		return renderedDom;
	};
	
    MbaBinding.prototype.visit = function(visitor){
        checkType(visitor, MbaDirectiveVisitor);
        visitor.beforeVisitBinding(this);
        for(var i=0 ; i<this._transformations.length ; i++){
            this._transformations[i].visit(visitor);
        }
        visitor.afterVisitBinding(this);
    };
    
    MbaBinding.prototype.getRepresentation = function(){
        return {selector : this._selector,
                self: this};    
    };
    
	if(arguments.length > 0){
		this.init(cssSelector, anchorProvider, firstTransf);
	}
};


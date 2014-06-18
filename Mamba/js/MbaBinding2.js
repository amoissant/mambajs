function MbaBinding2(cssSelector, anchorProvider, firstTransf){

	this._selector;
	this._transformations;
	this._anchor;
	this._renderedDoms;
	this._oldModelSize;
    this._anchorProvider;
	
	MbaBinding2.prototype.init = function(cssSelector, anchorProvider, firstTransf){
		checkType(cssSelector, 'string');
        checkType(anchorProvider, AnchorProvider);
        checkType(firstTransf, MbaTransf2);
		
		this._selector = cssSelector;
		this._transformations = [];
		this._renderedDoms = {};
        this._anchorProvider = anchorProvider;
        this.addTransformation(firstTransf);
	};	
	
    MbaBinding2.prototype.getAnchorProvider = function(){
        return this._anchorProvider;    
    };
    
    MbaBinding2.prototype.prependAllAccessorsForTransformations = function(accessorChain){
        for(var i=0; i<this._transformations.length ; i++){
            this._transformations[i].getAccessorChain().prependAll(accessorChain);
        }    
    };
    
	MbaBinding2.prototype.computeAnchor_ = function(template){
		checkType(template, MbaDom);
		this._anchor = this.getAnchor(template);
	};
	
	MbaBinding2.prototype.getSelector = function(){
		return this._selector;
	};
	
	MbaBinding2.prototype.getTransformations = function(){
		return this._transformations;
	};
			
	MbaBinding2.prototype.addTransformation = function(transformation){
		checkType(transformation, MbaTransf2);
		
		this._transformations.push(transformation);        
        return this;
	};
    
	MbaBinding2.prototype.update = function (renderedDom, model){
		checkType(renderedDom, MbaDom);
		checkType(model, 'array', 'object');
		
		for(var i=0 ; i<this._transformations.length ; i++){
			var currTransf = this._transformations[i];
			currTransf.update(renderedDom, model);
		}
		
		return renderedDom;
	};
	
    MbaBinding2.prototype.visit = function(visitor){
        checkType(visitor, MbaDirectiveVisitor);
        visitor.beforeVisitBinding(this);
        for(var i=0 ; i<this._transformations.length ; i++){
            this._transformations[i].visit(visitor);
        }
        visitor.afterVisitBinding(this);
    };
    
	if(arguments.length > 0){
		this.init(cssSelector, anchorProvider, firstTransf);
	}
};


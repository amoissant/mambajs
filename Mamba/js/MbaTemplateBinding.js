function MbaTemplateBinding(template, binding){
    
    this._selector;
    this._anchor;
    this._template;
    this._binding;
	this._transformations;
    this._anchorProvider;
    
    MbaTemplateBinding.prototype.init = function(template, binding){
        checkType(template, MbaDom);
        checkType(binding, MbaBinding2);
        
        this._template = template;        
        this._selector = binding.getSelector();
        this._transformations = binding.getTransformations();
        this._anchorProvider = binding.getAnchorProvider();
    };
    
    MbaTemplateBinding.prototype.getTransformations = function(){
		return this._transformations;
	};
    
    MbaTemplateBinding.prototype.getAccessorChains = function(){
        var accessorChains = [];
        for(var i=0 ; i<this._transformations.length ; i++){
            accessorChains.push(this._transformations[i].getAccessorChain());
        }
        return accessorChains;
    };
    
    MbaTemplateBinding.prototype.getAnchor = function(){
        if(this._anchor == null){
            this._anchor = this._anchorProvider.getAnchor(this._template, this._selector);
        }
        return this._anchor;
    };
    
    MbaTemplateBinding.prototype.setAnchor = function(anchor){
        checkType(anchor, MbaDom);
        this._anchor = anchor;
    }; 
    
    MbaTemplateBinding.prototype.setTemplate = function(template){
        checkType(template, template);
        this._template = template;
        this._anchor = null;
    };
    
    MbaTemplateBinding.prototype.addAllTransformations = function(templateBinding){
        checkType(templateBinding, MbaTemplateBinding);
        this._transformations = this._transformations.concat(templateBinding.getTransformations());
    };
    
    MbaTemplateBinding.prototype.render = function (model, route, parentDirectiveNode){
        checkType(route, MbaRoute);
        checkType(parentDirectiveNode, MbaNode2);
		for(var i=0 ; i<this._transformations.length ; i++){
			var currTransf = this._transformations[i];
			currTransf.update(this.getAnchor(), model, route, parentDirectiveNode);
		}
	};
    
    MbaTemplateBinding.prototype.bindEvents = function(node, route){
        checkType(node, MbaNode2);
        checkType(route, MbaRoute);
        for(var i=0 ; i<this._transformations.length ; i++){
			var currTransf = this._transformations[i];
			currTransf.bindAllEvents(this.getAnchor(), node, route);
		}
    };
	
    if(arguments.length != 0){
        this.init(template, binding);
    }
}
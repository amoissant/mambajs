function MbaTemplateBinding(template, binding){
    
    this._selector;
    this._anchor;
    this._template;
    this._binding;
	this._transformations;
    this._anchorProvider;
    
    if(arguments.length != 0){
        this.init(template, binding);
    }
}

MbaTemplateBinding.prototype.init = function(template, binding){
    checkType(template, MbaDom);
    checkType(binding, MbaBinding);
    
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
  
MbaTemplateBinding.prototype.setTemplate = function(template){
    checkType(template, template);
    this._template = template;
    this._anchor = null;
};

MbaTemplateBinding.prototype.addAllTransformations = function(templateBinding){
    checkType(templateBinding, MbaTemplateBinding);
    this._transformations = this._transformations.concat(templateBinding.getTransformations());
};

MbaTemplateBinding.prototype.render = function (dom, model, route, parentDirectiveNode){
    checkType(dom, MbaDomSingle);
    checkType(route, MbaRoute);
    checkType(parentDirectiveNode, MbaNode);
    var allModelValuesAreUndefined = true;
    for(var i=0 ; i<this._transformations.length ; i++){
        var currTransf = this._transformations[i];
        var modelHasNotMemberForTransf = currTransf.update(dom, model, route, parentDirectiveNode);
        allModelValuesAreUndefined &= modelHasNotMemberForTransf;	}
    return allModelValuesAreUndefined;
};

MbaTemplateBinding.prototype.prepareBindingEvents = function(dom, node, route){
    checkType(dom, MbaDom);
    checkType(node, MbaNode);
    checkType(route, MbaRoute);
    for(var i=0 ; i<this._transformations.length ; i++){		var currTransf = this._transformations[i];
        currTransf.prepareAllBindingHandler(dom, node, route);	}
};

MbaTemplateBinding.prototype.accept = function(visitor){
    checkType(visitor, MbaTemplateDirectiveVisitor);
    visitor.beforeVisitTemplateBinding(this);
    for(var i=0 ; i<this._transformations.length ; i++){
        this._transformations[i].accept(visitor);
    }
    visitor.afterVisitTemplateBinding(this);
};
  
MbaTemplateBinding.prototype.getRepresentation = function(){
    var anchorIsTextNode = this._anchorProvider instanceof TextNodeAnchorProvider;
    var representation = {}; 
    if(anchorIsTextNode)
        representation.textNodeSelector = this._selector;
    else
        representation.selector = this._selector;    
    representation.anchor = this.getAnchor();
    representation.self = this;
    
    return representation;
};
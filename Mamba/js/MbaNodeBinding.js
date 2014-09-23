function MbaNodeBinding(baseDom, binding) {

    this._templateBinding;

	MbaNodeBinding.prototype.init = function(baseDom, templateBinding) {
		MbaNode.prototype.init.call(this, null, baseDom, false);

		checkType(templateBinding, MbaTemplateBinding);

		this._templateBinding = templateBinding;
	};
	
    MbaNodeBinding.prototype.getTemplateBinding = function() {
		return this._templateBinding;
	};
    
    MbaNodeBinding.prototype.getAccessorChains = function(){
        return this._templateBinding.getAccessorChains();
    };
       
    MbaNodeBinding.prototype.getTransformations = function(){
        return this._templateBinding.getTransformations();  
    };
    
    MbaNodeBinding.prototype.updateDom = function(model, route){
        checkType(route, MbaRoute);
        //console.log('updateDom', this.getParent().getBaseDom().getElement(), route.getIndexes());
        var parentDirectiveNode = this.getParentDirectiveNode();
        var renderedDomForRoute = this.getRenderedDomForRoute(route);
        var allModelValueAreUndefined = 
            this._templateBinding.render(renderedDomForRoute, model, route, parentDirectiveNode);
        if(allModelValueAreUndefined){
            //console.log('remove dom ', renderedDomForRoute.getElement(), route.getIndexes());
            //this.deleteDom(route);
            //TODO si parent de type binding textNode alors
            if(renderedDomForRoute instanceof MbaDomSingle && isATextNode(renderedDomForRoute.getElement()))
                this.getParent().deleteDom(route);
            else
                this.deleteDom(route);
        }
            
    };

    MbaNodeBinding.prototype.prepareBindingEvents = function(route){
        checkType(route, MbaRoute);
        this._templateBinding.prepareBindingEvents(this.getRenderedDomForRoute(route), this, route);
    };
    
    MbaNodeBinding.prototype.updateNodeReferenceIntoDomElement = function(){
        this.getBaseDom().setMbaNode(this);
    };
    
	if (arguments.length > 0)
		this.init(baseDom, binding);
}
MbaNodeBinding.prototype = new MbaNode();
MbaNodeBinding.prototype.constructor = MbaNodeBinding;

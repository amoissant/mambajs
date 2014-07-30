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
       
    MbaNodeBinding.prototype.updateDom = function(model, route){
        checkType(route, MbaRoute);
        this._templateBinding.setAnchor(this.getRenderedDomForRoute(route));
        var parentDirectiveNode = this.getParentDirectiveNode();
        this._templateBinding.render(model, route, parentDirectiveNode);
    };
	
    MbaNodeBinding.prototype.bindRefreshEvents = function(route){
        checkType(route, MbaRoute);
        this._templateBinding.setAnchor(this.getRenderedDomForRoute(route));
        this._templateBinding.bindEvents(this, route);
    };
    
    MbaNodeBinding.prototype.updateNodeReferenceIntoDomElement = function(){
        this.referenceMeIntoDomElement(this.getBaseDom());
    };
    
	if (arguments.length > 0)
		this.init(baseDom, binding);
}
MbaNodeBinding.prototype = new MbaNode();
MbaNodeBinding.prototype.constructor = MbaNodeBinding;

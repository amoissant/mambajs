function MbaNodeBinding2(baseDom, binding) {

    this._templateBinding;

	MbaNodeBinding2.prototype.init = function(baseDom, templateBinding) {
		MbaNode2.prototype.init.call(this, null, baseDom, false);

		checkType(templateBinding, MbaTemplateBinding);

		this._templateBinding = templateBinding;
	};
	
    MbaNodeBinding2.prototype.getTemplateBinding = function() {
		return this._templateBinding;
	};
    
    MbaNodeBinding2.prototype.getAccessorChains = function(){
        return this._templateBinding.getAccessorChains();
    };
       
    MbaNodeBinding2.prototype.updateDom = function(model, route){
        checkType(route, MbaRoute);
        this._templateBinding.setAnchor(this.getRenderedDomForRoute(route));
        var parentDirectiveNode = this.getParentDirectiveNode();
        this._templateBinding.render(model, route, parentDirectiveNode);
    };
	
    MbaNodeBinding2.prototype.bindRefreshEvents = function(route){
        checkType(route, MbaRoute);
        this._templateBinding.setAnchor(this.getRenderedDomForRoute(route));
        this._templateBinding.bindEvents(this, route);
    };
    
    MbaNodeBinding2.prototype.updateNodeReferenceIntoDomElement = function(){
        this.referenceMeIntoDomElement(this.getBaseDom());
    };
    
	if (arguments.length > 0)
		this.init(baseDom, binding);
}
MbaNodeBinding2.prototype = new MbaNode2();
MbaNodeBinding2.prototype.constructor = MbaNodeBinding2;

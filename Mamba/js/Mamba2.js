function Mamba2(template, directive){
	
	this._template;
	this._directive;
	this._bindings;
	this._subMambas;
	
	Mamba2.prototype.init = function(template, directive){
		checkType(directive, 'object');
		checkType(template, MbaDom);
		
		this._template = template;
		this._directive = new MbaDirective(directive);
		this.computeBindings();
		this.computeSubMambas();
	};
	
	Mamba2.prototype.computeBindings = function(){
		if(!this._template.hasMbaId())
			this._template.addMbaId();
		
		var bindings = this._directive.getMergedBindings();
		
		var bindingMap = {};
		for(var i=0 ; i<bindings.length ; i++){
			var currBinding = bindings[i];
			var anchor = currBinding.getAnchor(this._template);
			var domId = anchor.getId();
			
			if(bindingMap[domId] == null){
				currBinding.computeAnchor(this.template);
				bindingMap[domId] = currBinding;
			}
			else{
				bindingMap[domId].addAllTransformations(currBinding.getTransf())
			}		
		}
		this.bindings = [];
		for(var prop in bindingMap){
			this.bindings = this.bindings.concat(bindingMap[prop]);	
		}
	};
	
	Mamba2.prototype.computeSubMambas = function(){
		
	};
	
	/*
	 * this.computeSubMambas = function(){
		//TODO que faire des sub-subDirectives qui sont dans une subDirective SANS root ?
		var subDirectives = this.directive.getSubDirectivesWithRoot();
		this.subMambas = [];

		for(var i=0 ; i<subDirectives.length ; i++){
			var currSubDirective = subDirectives[i];
			var currProp = currSubDirective.getParentProp(); 
			var accessor = new MbaFieldAccessor(currProp);
			var subTemplate = this.template; 

			var subMamba;
			if(currSubDirective.hasMamba()){
				subMamba = currSubDirective.getMamba();
				subMamba.addModelAccessor(accessor);
			}
			else
				subMamba = new Mamba(null, subTemplate, currSubDirective, accessor);
			
			this.subMambas.push(subMamba);
		}
	}
	
	this.computeBindings = function(){
		
	};
	 */
	if(arguments.length != 0){
		this.init(directive);
	}
}
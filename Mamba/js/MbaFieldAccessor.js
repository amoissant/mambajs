function MbaFieldAccessor(prop){
	
	checkType(prop, 'string');
	
	this.prop = prop;
	
	this.getModelValue = function(model){
		checkType(model, 'object');
		
		return model[this.prop];
	};	
	
	this.setModelValue = function(model, value){
		model[this.prop] = value;
	};
	
	this.type = MbaFieldAccessor;
}
MbaFieldAccessor.prototype = new MbaAccessor(); 
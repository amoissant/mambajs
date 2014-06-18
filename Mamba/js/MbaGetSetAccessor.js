function MbaGetSetAccessor(getter, setter){
	
	checkType(getter, 'string');
	checkType(setter, 'string');
	
	this.getter = getter;
	this.setter = setter;
	
	this.getModelValue = function(model){
		return model[this.getter]();
	};
	
	this.setModelValue = function(model, value){
		model[this.setter](value);
	};
	
	this.type = MbaGetSetAccessor;
}
MbaGetSetAccessor.prototype = new MbaAccessor(); 
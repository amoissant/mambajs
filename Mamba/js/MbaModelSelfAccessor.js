function MbaModelSelfAccessor(){
	
	this.getModelValue = function(model){
		return model;
	};
	
	this.type = MbaModelSelfAccessor;
}
MbaModelSelfAccessor.prototype = new MbaAccessor();
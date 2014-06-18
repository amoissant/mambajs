function MbaAccessorCollection(){
	
	this.accessors = [];
	this.accessorIndex = 0;
	
	this.addAccessor = function(accessor){
		checkType(accessor, MbaAccessor);
		this.accessors.push(accessor);
	};
	
	this.getModelValue = function(model){
		var currAccessor = this.accessors[this.accessorIndex];
		
		if(currAccessor.type == MbaModelSelfAccessor)
			this.accessorIndex = (this.accessorIndex+1) % this.accessors.length;
		
		return currAccessor.getModelValue(model);
	};
	
	/*this.setModelValue = function(model, value){
		var currAccessor = this.accessors[this.accessorIndex];
		currAccessor.setModelValue(model, value);
	};*/
	
	this.type = MbaAccessorCollection;
	
	this.reinit = function(){
		this.accessorIndex = 0;
	};
}
MbaAccessorCollection.prototype = new MbaAccessor();
function MbaChainAccessor(){
	
	this.accessors = [];
	
	this.chainAccessor = function(accessor){
		if(accessor instanceof MbaChainAccessor){
			this.accessors = accessor.getAccessors().concat(this.accessors);			
		}
		else{
			this.accessors = toArray(accessor).concat(this.accessors);			
		}
	};
	
	this.getAccessors = function(){
		return this.accessors;
	};
	
	this.getModelValue = function(model){
		
		var modelValue = model;
		for(var i=0; i<this.accessors.length ; i++){
			var currAccessor = this.accessors[i];
			if(modelValue != null){
				if($.isArray(modelValue)){
					var values = [];
					for(var j=0 ; j<modelValue.length ; j++){
						var currModelValue = modelValue[j];
						values = values.concat(currAccessor.getModelValue(currModelValue));
					}
					modelValue = values;
				}
				else{
					modelValue=currAccessor.getModelValue(modelValue);
				}
			}
			else{
				modelValue = null;
				break;
			}
		}
		
		return modelValue;
	};
	
	this.type = MbaChainAccessor;
}
MbaChainAccessor.prototype = new MbaAccessor();
function MbaProxyAccessor(prop){

	checkType(prop, 'string');
	
	this.getter;
	this.setter;
	
	if(prop.contains(',')){
		var splittedAccessor = prop.split(',');
		
		if(splittedAccessor.length != 2){
			console.log('ERROR : l\'accesseur '+prop+' n\'est pas valide.');
		}
		else{
			this.getter = splittedAccessor[0].trim();
			this.setter = splittedAccessor[1].trim();
		}
	}
	else{
		this.getter = prop.trim();
		this.setter = this.getter;
	}
		
	
	//TODO : on peut optimiser en mettant du cache ici
	this.getAccessor = function(model){
		if(typeof model[this.getter] == 'function')
			return new MbaGetSetAccessor(this.getter, this.setter);
		
		return new MbaFieldAccessor(this.getter);
	};
	
	this.getModelValue = function(model){
		return this.getAccessor(model).getModelValue(model);
	};
	
	this.setModelValue = function(model, value){
		this.getAccessor(model).setModelValue(model, value);
	};
	
	this.type = MbaProxyAccessor;
}
MbaProxyAccessor.prototype = new MbaAccessor(); 
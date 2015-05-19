function MbaError(code, message){
	
	this.code;
	this.message;
	
	MbaError.prototype.init = function(code, message){
		checkType(code, 'number');
		checkType(message, 'string');
		this.message = message;
		this.code = code;
	};
    
    MbaError.prototype.init2 = function(message){
		checkType(message, 'string');
		this.message = message;
        return this;
	};
	
	if(arguments.length > 0)
		this.init(code, message);
}
MbaError.prototype = Error.prototype;
MbaError.prototype.constructor = MbaError;
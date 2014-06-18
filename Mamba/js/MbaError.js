function MbaError(code, message){
	
	this.code;
	this.message;
	
	MbaError.prototype.init = function(code, message){
		checkType(code, 'number');
		checkType(message, 'string');
		this.message = message;
		this.code = code;
	};
	
	if(arguments.length > 0)
		this.init(code, message);
}
MbaError.prototype = new Error();
MbaError.prototype.constructor = MbaError;
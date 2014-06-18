function MbaRefFunctionTransf(functionName){

    this._function;
    
    MbaRefFunctionTransf.prototype.init = function(functionName){
        var refFunction = MBA_CST.REF_FUNCTIONS[functionName]; 
        if(refFunction == null)
            throw new MbaError(3, 'Referenced function \''+functionName+'\' not found in MBA_CST.REF_FUNCTIONS.');
        this._function = refFunction;
    };
    
    MbaRefFunctionTransf.prototype.updateDomWithModel = function(domElement, newValue, oldValue){
        checkType(domElement, 'dom');
        checkArgNb(arguments, 3);
        
        this._function(domElement, newValue, oldValue);
    };
    
    MbaRefFunctionTransf.prototype.getFunction = function(){
        return this._function;  
    };
    
    
    if(arguments.length > 0)
        this.init(functionName);
    
}
MbaRefFunctionTransf.prototype = new MbaTransf2();
MbaRefFunctionTransf.prototype.constructor = MbaRefFunctionTransf;

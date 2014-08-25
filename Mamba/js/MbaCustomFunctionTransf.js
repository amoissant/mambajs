function MbaCustomFunctionTransf(customFunctionText){
    
    this._customFunction;
        
    if(arguments.length > 0)
        this.init(customFunctionText);
}
MbaCustomFunctionTransf.prototype = new MbaTransf();
MbaCustomFunctionTransf.prototype.constructor = MbaCustomFunctionTransf;

MbaCustomFunctionTransf.prototype.init = function(customFunctionText){
    MbaTransf.prototype.init.call(this);
    var script = 'var customFunction = '+customFunctionText;
    eval(script);
    this._customFunction = customFunction;
};

MbaCustomFunctionTransf.prototype.getCustomFunction = function(){
    return this._customFunction;  
};

MbaCustomFunctionTransf.prototype.updateDomWithModel = function(domElement, newValue, oldValue){
    checkType(domElement, 'dom');
    checkArgNb(arguments, 3);

    this._customFunction(domElement, newValue, oldValue, false);//dernier paramètre pour savoir si on doit lire ou ecrire le dom
};

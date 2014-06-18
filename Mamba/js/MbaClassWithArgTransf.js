function MbaClassWithArgTransf(className){
    
    this._className;
    
    MbaClassWithArgTransf.prototype.init = function(className){
        this._className = className;
    };
    
    MbaClassWithArgTransf.prototype.updateDomWithModel = function(domElement, newValue, oldValue){
        checkType(domElement, 'dom');
        checkArgNb(arguments, 3);
        
        if(typeof(newValue) != 'boolean')
            throw new MbaError(2, 'Received a non boolean value, use div@class directive instead.');
        
        if(newValue)
            domElement.classList.add(this._className);    
        else
            domElement.classList.remove(this._className);
    };
    
    MbaClassWithArgTransf.prototype.readValueFromDom = function(domElement, oldValue){
        checkType(domElement, 'dom');
        checkArgNb(arguments, 2);
        return domElement.classList.contains(this._className);
    };
    
    MbaClassWithArgTransf.prototype.getClassName = function(){
        return this._className;  
    };
    
    if(arguments.length > 0)
        this.init(className);
}
MbaClassWithArgTransf.prototype = new MbaTransf2();
MbaClassWithArgTransf.prototype.constructor = MbaClassWithArgTransf;

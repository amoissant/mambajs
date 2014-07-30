function MbaClassTransf(){
    
    MbaClassTransf.prototype.updateDomWithModel = function(domElement, newValue, oldValue){
        checkType(domElement, 'dom');
        checkArgNb(arguments, 3);
        
        if(typeof(newValue) == 'boolean')
            throw new MbaError(1, 'Received a boolean value, use div@class(className) directive with boolean values.');
        
        if(oldValue != null)
            domElement.classList.remove(oldValue);    
        if(newValue != null)
            domElement.classList.add(newValue);
    };
    
    MbaClassTransf.prototype.canReadValueFromDom = function(){
        return false;  
    };
}
MbaClassTransf.prototype = new MbaTransf();
MbaClassTransf.prototype.constructor = MbaClassTransf;
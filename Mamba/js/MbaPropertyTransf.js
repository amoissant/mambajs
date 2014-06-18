function MbaPropertyTransf(propertyName){
    
    this._propertyName;
    
    MbaPropertyTransf.prototype.init = function(propertyName){
        this._propertyName = propertyName;  
    };    
    
    MbaPropertyTransf.prototype.updateDomWithModel = function(domElement, newValue, oldValue){
        checkType(domElement, 'dom');
        checkArgNb(arguments, 3);
        domElement[this._propertyName] = newValue;
    };
    
    MbaPropertyTransf.prototype.readValueFromDom = function(domElement, oldValue){
        checkType(domElement, 'dom');
        checkArgNb(arguments, 2);
        return domElement[this._propertyName];
    };
    
    if(arguments.length > 0)
        this.init(propertyName);
}
MbaPropertyTransf.prototype = new MbaTransf2();
MbaPropertyTransf.prototype.constructor = MbaPropertyTransf;
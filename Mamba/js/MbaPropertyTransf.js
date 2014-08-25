function MbaPropertyTransf(propertyName){
    
    this._propertyName;
    
    if(arguments.length > 0)
        this.init(propertyName);
}
MbaPropertyTransf.prototype = new MbaTransf();
MbaPropertyTransf.prototype.constructor = MbaPropertyTransf;

MbaPropertyTransf.prototype.init = function(propertyName){
    MbaTransf.prototype.init.call(this);
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

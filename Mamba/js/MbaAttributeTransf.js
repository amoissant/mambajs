function MbaAttributeTransf(attribute){
    
    this._attribute;
    
    MbaAttributeTransf.prototype.init = function(attribute){
        checkType(attribute, 'string');
        this._attribute = attribute;
    };
    
    MbaAttributeTransf.prototype.getAttribute = function(){
        return this._attribute;
    };
    
    MbaAttributeTransf.prototype.updateDomWithModel = function(domElement, newValue, oldValue){
        checkArgNb(arguments, 3);
        checkType(domElement, 'dom');
        if(typeof(newValue) == 'boolean'){
            if(newValue)
                domElement.setAttribute(this._attribute, '');
            else
                domElement.removeAttribute(this._attribute);
        }
        else
            domElement.setAttribute(this._attribute, newValue);
    };
    
    MbaAttributeTransf.prototype.readValueFromDom = function(domElement, oldValue){
        checkType(domElement, 'dom');
        checkArgNb(arguments, 2);
        if(typeof(oldValue) == 'boolean'){
            return domElement.hasAttributes(this._attribute);
        }
        else if(domElement.hasAttributes(this._attribute))
            return domElement.getAttribute(this._attribute);
        else
            throw new MbaError(0, 'Dom element has no attribute '+this._attribute+', can\'t read value from.');
    }
    
    if(arguments.length > 0)
        this.init(attribute);
}
MbaAttributeTransf.prototype = new MbaTransf();
MbaAttributeTransf.prototype.constructor = MbaAttributeTransf;
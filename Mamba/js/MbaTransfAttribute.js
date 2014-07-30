function MbaTransfAttribute(transf, accessorChain, attribute){
    
    this._attribute;
    
    MbaTransfAttribute.prototype.init = function(transf, accessorChain, attribute){
        MbaTransf.prototype.init.call(this, transf, accessorChain);            
        this._attribute = attribute;
    };
}
MbaTransfAttribute.prototype = new MbaTransf();
MbaTransfAttribute.prototype.constructor = MbaTransfAttribute;
function MbaTransfAttribute(transf, accessorChain, attribute){
    
    this._attribute;
    
    MbaTransfAttribute.prototype.init = function(transf, accessorChain, attribute){
        MbaTransf2.prototype.init.call(this, transf, accessorChain);            
        this._attribute = attribute;
    };
}
MbaTransfAttribute.prototype = new MbaTransf2();
MbaTransfAttribute.prototype.constructor = MbaTransfAttribute;
function AddSuperModelAccessorVisitor(property){
    
    this._property;
    
    AddSuperModelAccessorVisitor.prototype.init = function(property){
        checkType(property, 'string');
        this._property = property;    
    };
    
    AddSuperModelAccessorVisitor.prototype.beforeVisitNode = function(node){
        switch(node.constructor){
            case MbaNodeDirective:
                this.addSuperModelAccessorForDirectiveNode(node);
            break;
            case MbaNodeBinding:
                this.addSuperModelAccessorForBindingNode(node);
            break;
        }
    };
    
    AddSuperModelAccessorVisitor.prototype.addSuperModelAccessorForDirectiveNode = function(node){
        checkType(node, MbaNodeDirective);
        node.getAccessorChain().prependAccessor(this.createSuperModelAccessor());
    };
    
    AddSuperModelAccessorVisitor.prototype.addSuperModelAccessorForBindingNode = function(node){
        checkType(node, MbaNodeBinding);
        var accessorChains = node.getAccessorChains();
        for(var i=0 ; i<accessorChains.length ; i++){
            accessorChains[i].prependAccessor(this.createSuperModelAccessor());
        }
    };
    
    AddSuperModelAccessorVisitor.prototype.createSuperModelAccessor = function(){
        return new MbaFieldAccessor(this._property);
    };
    
    if(arguments.length > 0)
        this.init(property);
    
}
AddSuperModelAccessorVisitor.prototype = new MbaNodeVisitor();
AddSuperModelAccessorVisitor.prototype.constructor = AddSuperModelAccessorVisitor;
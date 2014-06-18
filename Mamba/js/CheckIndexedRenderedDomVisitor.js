function CheckIndexedRenderedDomVisitor(){
    
    this._error = false;
    
    CheckIndexedRenderedDomVisitor.prototype.beforeVisitNode = function(node){
        if(Object.getPrototypeOf(node).constructor ==  MbaNodeDirective){
            for(var index in node.getIndexedRenderedDom()){
                if(index == '')
                    this._error = true;
                if(node.getRenderedDomForIndex(index).isEmpty())
                    this._error = true;
            }
        }
    };
    
    CheckIndexedRenderedDomVisitor.prototype.containsErrors = function(){
        return this._error;
    }
}
CheckIndexedRenderedDomVisitor.prototype = new MbaNodeVisitor();
CheckIndexedRenderedDomVisitor.prototype.constructor = CheckIndexedRenderedDomVisitor;
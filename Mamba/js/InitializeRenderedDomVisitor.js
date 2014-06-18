function InitializeRenderedDomVisitor(){
    
    InitializeRenderedDomVisitor.prototype.beforeVisitNode = function(node, indexInParent){
        checkType(node, MbaNode2);
        //checkType(indexInParent, 'number');//TODO si on a pas besoin de l'index alors le virer sinon le passer correctement
        
        if(node instanceof MbaNodeDirective)
            node.setRenderedDom(new MbaDom());
    };
    
    InitializeRenderedDomVisitor.prototype.afterVisitNode = function(node, indexInParent){
        checkType(node, MbaNode2);
        //checkType(indexInParent, 'number');//TODO si on a pas besoin de l'index alors le virer sinon le passer correctement
        if(!(node instanceof MbaRootNode)){
            node.appendChildrenInitialDom();
        }
           
    };
}
InitializeRenderedDomVisitor.prototype = new MbaNodeVisitor();
InitializeRenderedDomVisitor.prototype.constructor = new InitializeRenderedDomVisitor();

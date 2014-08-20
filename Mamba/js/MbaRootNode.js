function MbaRootNode(templateRoot){
	
    this._indexes;//TODO à suppr ?
    this._renderedDom;
    this._parentDom;
    this._offsetInParent;
    
	MbaRootNode.prototype.init = function(templateRoot){
        checkType(templateRoot, MbaDom);
        MbaNode.prototype.init.call(this, null, templateRoot);
	};	
    
    MbaRootNode.prototype.getParent = function(){
	   throw new MbaError(0, "getParent is not applicable for a MbaRootNode.")
	};
    
	MbaRootNode.prototype.setParent = function(parent){
        throw new MbaError(0, "setParent is not applicable for a MbaRootNode.")
	};    
    
    MbaRootNode.prototype.getRenderedDomForRoute = function(route){
        return this._parentDom;
    };
    
    MbaRootNode.prototype.getChildOffset = function(child, currentRoute) {
        return MbaNode.prototype.getChildOffset.call(this, child, currentRoute) + this._offsetInParent;
    };
    
    MbaRootNode.prototype.appendDomIntoParent = function(dom, route){
        checkType(dom, MbaDom);
        checkType(route, MbaRoute);
        throw new Error('Must not call method "appendDomIntoParent" on MbaRootNode.');
    };
    
    MbaRootNode.prototype.appendDom = function(child, childDom, route){
        if(this._parentDom != null)
            MbaNode.prototype.appendDom.call(this, child, childDom, route);
    }
        
    MbaRootNode.prototype.removeDom = function(dom, route){
        checkType(dom, MbaDom);
		checkType(route, MbaRoute);
        if(this._parentDom != null)
            MbaNode.prototype.removeDom.call(this, dom, route);
	};
    
    MbaRootNode.prototype.startRender = function(model){
        this.trySetParentDom();
        this.render(model, this.getLastRoute());
        this.whenDomUpdated();
    };
    
    MbaRootNode.prototype.render = MbaNode.prototype.callRenderOnChildren;
    
    MbaRootNode.prototype.getModelValue = function(model, route){
        return toArray(model);
    };
    
    MbaRootNode.prototype.getLastRoute = function(){
        return new MbaRoute([]);
    };
    
    MbaRootNode.prototype.getRenderedDom = function(){
        var renderedDom = new MbaDomEmpty();
        for(var i=0 ; i<this._children.length ; i++){
		  var currChild = this._children[i];
		  renderedDom.add(currChild.getRenderedDom());
        }
        this._renderedDom = renderedDom;
        return this._renderedDom;
    };
    
    MbaRootNode.prototype.trySetParentDom = function(){
        this.getRenderedDom();//TODO on peut optimiser en ajoutant/supprimant dans this_renderedDom quand on fait appendDom/removeDom
        var firstElementWithParent = this.findFirstRenderedDomElementWithParent();
        if(firstElementWithParent != null){
            this._parentDom = new MbaDom([firstElementWithParent.parentElement]);//TODO MbaNodeSingle
            this._offsetInParent = this.getPositionInParent(firstElementWithParent);
        }
    };
    
    //TODO déplacer dans MbaDom ?
    MbaRootNode.prototype.findFirstRenderedDomElementWithParent = function(){
        for(var i=0 ; i<this._renderedDom.getLength() ; i++){
            var currDomElement = this._renderedDom.getDom(i);
            if(currDomElement.parentElement != null){
                return currDomElement;                
            }
        } 
        return null;
    };
        
    //TODO déplacer dans MbaDom ?
    MbaRootNode.prototype.getPositionInParent = function(domElement){
        checkType(domElement, 'dom');
        var childen = this._parentDom.getDom(0).childNodes;
        for(var i=0 ; i<childen.length ; i++){
            if(domElement == childen[i])
                return i;
        }
    };
    
    MbaRootNode.prototype.debug = function(printIndexedRenderedDom){
        var visitor = new DebugNodeVisitor(printIndexedRenderedDom);
        this.accept(visitor);
	};
    
    MbaRootNode.prototype.debugAccessors = function(){
        var visitor = new DebugNodeAndAccessorVisitor();
        this.accept(visitor);
	};
    
    MbaRootNode.prototype.match = function(test){
        var visitor= new TestNodeVisitor(test);
        this.accept(visitor);
        return visitor.testSucceed();
    };
    
    MbaRootNode.prototype.indexedRenderedDomIsValid = function(){
        var visitor = new CheckIndexedRenderedDomVisitor();
        this.accept(visitor);
        return !visitor.containsErrors();
    };
    
    MbaRootNode.prototype.updateForModelAndRoute = function(model, route){
        checkType(route, MbaRoute);
        this.startRender(model);
        this.whenDomUpdated();
    };
    
    MbaRootNode.prototype.whenDomUpdated = function(){
        var visitor = new MbaConnectEventsVisitor();
        this.accept(visitor);
    };
    
    if(arguments.length != 0){
	   this.init(templateRoot);		
    }
}
MbaRootNode.prototype = new MbaNodeDirective();
MbaRootNode.prototype.constructor = MbaRootNode;
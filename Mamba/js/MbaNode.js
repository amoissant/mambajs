function MbaNode(parent, baseDom){
	
    this._baseDom;
	this._parent;
	this._children;
    this._indexedRenderedDom;
    this._actionBindings;
	
	MbaNode.prototype.init = function(parent, baseDom){
        checkTypeOrNull(parent, MbaNode);
		checkType(baseDom, MbaDom);
		
        this._baseDom = baseDom;
		this._parent = parent;
		this._children = [];
        this._indexedRenderedDom = {};
        this._actionBindings = [];
	};	
    
    
    MbaNode.prototype.getClosestRoute = function(route){
        checkType(route, MbaRoute);
        var closestRoute = route.clone();
        while(closestRoute.length > 0){
            if(this.hasNoRenderedDomForRoute(closestRoute))
                closestRoute.removeLastIndex();
            else
                break;
        }
        return closestRoute;
    };
    
    MbaNode.prototype.addActionBinding = function(actionBinding){
        checkType(actionBinding, MbaActionBinding);
        this._actionBindings.push(actionBinding);
    };
    
    MbaNode.prototype.getActionBindings = function(){
      return this._actionBindings;  
    };
    
    /**************************************************************/
    /****** méthodes relatives à l'arborescences de MbaNodes ******/
    /**************************************************************/
    
    MbaNode.prototype.getParent = function(){
		return this._parent;
	};
    
	MbaNode.prototype.setParent = function(parent){
		checkType(parent, MbaNode);
		this._parent = parent;
	};
    
	MbaNode.prototype.getChildren = function(){
		return this._children;
	};
    
	MbaNode.prototype.setChildren = function(children){
		checkType(children, 'array', MbaNode);
		this._children = children;
	};
    
    MbaNode.prototype.removeChildren = function(){
		var children = this._children;
		this._children = [];
		return children;
	};
    
	MbaNode.prototype.addChild = function(child){
		checkType(child, MbaNode);
		this._children.push(child);
	};
    
	MbaNode.prototype.getChild = function(index){
		checkType(index, 'number');
		
		if(index < this._children.length)
			return this._children[index];
		else
			return null;//TODO throw error plutot
	};
    
    MbaNode.prototype.setChildAtIndex = function(child, index){
        checkType(child, MbaNode);
		checkType(index, 'number');
        this._children[index] = child;  
    };
    
    MbaNode.prototype.replaceChildrenIncludedInIndexes = function(startIndex, endIndex, replacementNode){
        checkType(startIndex, 'number');
        checkType(endIndex, 'number');
        checkType(replacementNode, MbaNode);
        
        var newChildren = [];
        for(var i=0 ; i<startIndex ; i++){
            newChildren.push(this._children[i]);
        }
        newChildren.push(replacementNode);
        for(var i=endIndex+1 ; i<this._children.length ; i++){
            newChildren.push(this._children[i]);
        }
        this._children = newChildren;
    };

    //TODO à suppr, fait doublon avec celle dessous
    MbaNode.prototype.getChildPosition = function(child){
		checkType(child, MbaNode);
		return this._children.indexOf(child);
	};
    
    MbaNode.prototype.getChildIndex = function(child){
        checkType(child, MbaNode);
        return this._children.indexOf(child);
    };
    
    MbaNode.prototype.getPositionInParent = function(){
      return this._parent.getChildPosition(this);  
    };
    
	MbaNode.prototype.getMinChildrenPosition = function(children){
		checkType(children, 'array', MbaNode);
		
		if(children.length > 0){
			var minPos = this._children.indexOf(children[0]);
			for(var i=1 ; i<children.length ; i++){
				var currChild = children[i];
				var currPos = this._children.indexOf(currChild);
				if(currPos < minPos)
					minPos = currPos;
			}
			return minPos;
		}
		else
			console.log('ERROR : children must not be empty');
	};
    
    MbaNode.prototype.replaceInTree = function(toBeReplacedNode){
        checkType(toBeReplacedNode, MbaNode);
        var parent = toBeReplacedNode.getParent();
        this.setParent(parent);
        var positionInParent = parent.getChildPosition(toBeReplacedNode);
        parent.setChildAtIndex(this, positionInParent);
        
        this.setChildren(toBeReplacedNode.getChildren());
        for(var i=0 ; i<this._children.length ; i++){
            this._children[i].setParent(this);
        }
    }
    
    MbaNode.prototype.checkImTheParentOfMyChildren = function(){
		for(var i=0 ; i<this._children.length ; i++){
			var currChild = this._children[i];
			if(currChild.getParent() != this)
				throw new Error("My child is not my child !");
			else
				currChild.checkImTheParentOfMyChildren();
		}
	};
    
    MbaNode.prototype.getParentDirectiveNode = function(){
        var parentNode = this.getParent();
        while(!(parentNode instanceof MbaNodeDirective)){
              parentNode = parentNode.getParent();
        }
        return parentNode;
    };
    
    MbaNode.prototype.getRootNode = function(){
        if(this instanceof MbaRootNode)
            return this;
        var parentNode = this.getParent();
        while(!(parentNode instanceof MbaRootNode)){
              parentNode = parentNode.getParent();
        }
        return parentNode;
    };
    
    /************************************************************************/
    /****** méthodes relatives à l'ajout/suppression d'éléments de dom ******/
    /************************************************************************/
    
    MbaNode.prototype.getInitialDom = function(){
        return this._baseDom.cloneWithoutChildren();
    };
    
    MbaNode.prototype.getBaseDom = function(){
		return this._baseDom;
	};
    
    MbaNode.prototype.setBaseDom = function(baseDom){
		checkType(baseDom, MbaDom);
		this._baseDom = baseDom;
	};    
    
    MbaNode.prototype.getIndexedRenderedDom = function(){
        return this._indexedRenderedDom;
    };
    
    MbaNode.prototype.getRenderedDomForIndex = function(index){
        checkType(index, 'string');
        //TODO : faire des assert qu'on pourra désactiver contenant ce genre de code lourd
        if(this.hasNoRenderedDomForIndex(index))
            throw new MbaError(0, 'There is no renderedDom for index : \''+index+'\'');
        return this._indexedRenderedDom[index];
	};
    
    MbaNode.prototype.getRenderedDomForRoute = function(route){
        checkType(route, MbaRoute);
        return this.getRenderedDomForIndex(route.getIndexes());
	};
        
    MbaNode.prototype.getRenderedDom = function(){
        var renderedDom = new MbaDom();
        for(var index in this._indexedRenderedDom){
            renderedDom.add(this.getRenderedDomForIndex(index));
        }
        return renderedDom;
	};
    
    MbaNode.prototype.getDomSizeForRoute = function(route){
        return this.getRenderedDomForRoute(route).getLength();    
    };
    
    MbaNode.prototype.setRenderedDomForRoute = function(dom, route){
        checkType(dom, MbaDom);
        checkType(route, MbaRoute);
        this._indexedRenderedDom[route.getIndexes()] = dom;
    };
    
    MbaNode.prototype.deleteRenderedDomForRoute = function(route){
        checkType(route, MbaRoute);
        delete this._indexedRenderedDom[route.getIndexes()];
    };
      
    MbaNode.prototype.hasNoRenderedDomForIndex = function(index){
        checkType(index, 'string');
        return !this._indexedRenderedDom.hasOwnProperty(index);
    };
    
    MbaNode.prototype.hasNoRenderedDomForRoute = function(route){
        checkType(route, MbaRoute);
        return this.hasNoRenderedDomForIndex(route.getIndexes());
    };       
    
    MbaNode.prototype.createInitialDom = function(route){
        checkType(route, MbaRoute);
        var initialDom = this.getInitialDom();
        this.setRenderedDomForRoute(initialDom, route);
        this.prepareBindingEvents(route);
        this.prepareActionEvents(initialDom, route);
        return initialDom;
    };
    
    MbaNode.prototype.prepareBindingEvents = function(route){
        checkType(route, MbaRoute);
        //we do nothing here but subtypes do
    };
    
    MbaNode.prototype.prepareActionEvents = function(dom, route){
        checkType(dom, MbaDom);
        checkType(route, MbaRoute);
        for(var i=0 ; i<this._actionBindings.length ; i++){
            this._actionBindings[i].prepareActionEventHandler(dom, route, this);
        }
    };
    
	MbaNode.prototype.getSize = function(){
		return this.getRenderedDom().getLength();
	};
    
	//TODO bouger dans MbaDom
	MbaNode.prototype.referenceMeIntoDomElement = function(mbaDom){
		checkType(mbaDom, MbaDom);
		
		var dom = mbaDom.getDom();
		for(var i=0 ; i<dom.length ; i++){
			var currDom = dom[i];
			currDom.mbaNode = this;
		}
	};
            
    MbaNode.prototype.appendDomIntoParent = function(childDom, route){
        checkType(childDom, MbaDom);
        checkType(route, MbaRoute);
        this._parent.appendDom(this, childDom, route, route);
    };
    
    MbaNode.prototype.appendDom = function(child, childDom, route){
        checkType(child, MbaNode);
        checkType(childDom, MbaDom);
        checkType(route, MbaRoute);
        var currentRoute = this.getClosestRoute(route);
        var dom = this.getRenderedDomForRoute(currentRoute);
        var offset = this.getChildOffset(child, currentRoute);        
        dom.insertChildAtIndex2(childDom, offset);//TODO à renommer
    };
    
    MbaNode.prototype.getChildOffset = function(child, route){
		checkType(child, MbaNode);
        checkType(route, MbaRoute);
		
		var offset = 0;
        var children = this.getChildren();
        for(var i=0 ; i<children.length ; i++){
            var currChild = children[i];
            var childrenSize = currChild.getDomSizeForRoute(route);
            offset += childrenSize;
            if(currChild == child)
                break;                
        }
        return offset;
	};
    
	MbaNode.prototype.removeDomIntoParent = function(dom, route){
        checkType(dom, MbaDom);
		checkType(route, MbaRoute);
		this._parent.removeDom(dom, route);
	};
    
    MbaNode.prototype.removeDom = function(dom, route){
        checkType(dom, MbaDom);
		checkType(route, MbaRoute);
        var currentRoute = this.getClosestRoute(route);
		this.getRenderedDomForRoute(currentRoute).removeChild(dom);//TODO renommer en removeChildren;
	};
    
    MbaNode.prototype.deleteDom = function(route){
        checkType(route, MbaRoute);
        this.deleteChildrenDom(route);
        this.removeDomIntoParent(this.getRenderedDomForRoute(route), route);
        this.deleteRenderedDomForRoute(route);        
    };
    
    MbaNode.prototype.deleteChildrenDom = function(route){
        checkType(route, MbaRoute);
        var children = this.getChildren();
        for(var i=0 ; i<children.length ; i++){
            children[i].deleteDom(route);
        }
    };
    
    MbaNode.prototype.callRenderOnChildren = function(model, route){
        checkType(route, MbaRoute);
		for(var i=0 ; i<this._children.length ; i++){
			var currChild = this._children[i];
			currChild.render(model, route);
		}	
	};
    
    MbaNode.prototype.render = function(model, route) {
        checkType(route, MbaRoute);
        if(this.hasNoRenderedDomForRoute(route)){
            var newDom = this.createInitialDom(route);
            this.appendDomIntoParent(newDom, route);    
        }
        this.callRenderOnChildren(model, route);
        this.updateDom(model, route);
	};
    
    MbaNode.prototype.updateDom = function(model, route){
        checkType(route, MbaRoute);
        //we do nothing here but subtypes do
    };
	
    MbaNode.prototype.updateSuperModelReference = function(newSuperModel){
        for(var i=0 ; i<this._actionBindings.length ; i++){
            this._actionBindings[i].setSuperModel(newSuperModel);
        }
    };
    
    MbaNode.prototype.updateFromClosestParentDirective = function(model, route){
        checkType(route, MbaRoute);
        var parentDirectiveNode = this.getParentDirectiveNode();
        parentDirectiveNode.updateForModelAndRoute(model, route);
    };
    
    MbaNode.prototype.accept = function(visitor){
        checkType(visitor, MbaNodeVisitor);
        visitor.beforeVisitNode(this);
        this.callAcceptOnChildren(visitor);
        visitor.afterVisitNode(this);
    };
    
    MbaNode.prototype.callAcceptOnChildren = function(visitor){
        checkType(visitor, MbaNodeVisitor);
        for(var i=0 ; i<this._children.length ; i++){
			var currChild = this._children[i];
            currChild.accept(visitor);
		}
    };
    
    MbaNode.prototype.getId = function(){
        return this._baseDom.getId();
    }
    
	if(arguments.length  > 0)
		this.init(parent, baseDom);
}

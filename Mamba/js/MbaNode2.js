function MbaNode2(parent, baseDom){
	
    this._baseDom;
	this._parent;
	this._children;
    this._indexedRenderedDom;
    this._actionBindings;
	
	MbaNode2.prototype.init = function(parent, baseDom){
        checkTypeOrNull(parent, MbaNode2);
		checkType(baseDom, MbaDom);
		
        this._baseDom = baseDom;
		this._parent = parent;
		this._children = [];
        this._indexedRenderedDom = {};
        this._actionBindings = [];
	};	
    
    
    MbaNode2.prototype.getClosestRoute = function(route){
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
    
    MbaNode2.prototype.addActionBinding = function(actionBinding){
        checkType(actionBinding, MbaActionBinding);
        this._actionBindings.push(actionBinding);
    };
    
    /**************************************************************/
    /****** méthodes relatives à l'arborescences de MbaNodes ******/
    /**************************************************************/
    
    MbaNode2.prototype.getParent = function(){
		return this._parent;
	};
    
	MbaNode2.prototype.setParent = function(parent){
		checkType(parent, MbaNode2);
		this._parent = parent;
	};
    
	MbaNode2.prototype.getChildren = function(){
		return this._children;
	};
    
	MbaNode2.prototype.setChildren = function(children){
		checkType(children, 'array', MbaNode2);
		this._children = children;
	};
    
    MbaNode2.prototype.removeChildren = function(){
		var children = this._children;
		this._children = [];
		return children;
	};
    
	MbaNode2.prototype.addChild = function(child){
		checkType(child, MbaNode2);
		this._children.push(child);
	};
    
	MbaNode2.prototype.getChild = function(index){
		checkType(index, 'number');
		
		if(index < this._children.length)
			return this._children[index];
		else
			return null;//TODO throw error plutot
	};
    
    MbaNode2.prototype.setChildAtIndex = function(child, index){
        checkType(child, MbaNode2);
		checkType(index, 'number');
        this._children[index] = child;  
    };
    
    MbaNode2.prototype.replaceChildrenIncludedInIndexes = function(startIndex, endIndex, replacementNode){
        checkType(startIndex, 'number');
        checkType(endIndex, 'number');
        checkType(replacementNode, MbaNode2);
        
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
    
	MbaNode2.prototype.addChildAtIndex = function(child, index){
		checkType(child, MbaNode2);
		checkType(index, 'number');
		
		var newChildren = [];
		newChildren = newChildren.concat(_.first(this._children, index));
		newChildren.push(child);
		newChildren = newChildren.concat(_.rest(this._children, index));
		
		this._children = newChildren;
	};
    
	MbaNode2.prototype.removeChild = function(child){
		checkType(child, MbaNode2);
		
		this._children = _.without(this._children, child);
	};
    //TODO à suppr, fait doublon avec celle dessous
    MbaNode2.prototype.getChildPosition = function(child){
		checkType(child, MbaNode2);
		return this._children.indexOf(child);
	};
    
    MbaNode2.prototype.getChildIndex = function(child){
        checkType(child, MbaNode2);
        return this._children.indexOf(child);
    };
    
    MbaNode2.prototype.getPositionInParent = function(){
      return this._parent.getChildPosition(this);  
    };
    
	MbaNode2.prototype.getMinChildrenPosition = function(children){
		checkType(children, 'array', MbaNode2);
		
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
    
    MbaNode2.prototype.replaceInTree = function(toBeReplacedNode){
        checkType(toBeReplacedNode, MbaNode2);
        var parent = toBeReplacedNode.getParent();
        this.setParent(parent);
        var positionInParent = parent.getChildPosition(toBeReplacedNode);
        parent.setChildAtIndex(this, positionInParent);
        
        this.setChildren(toBeReplacedNode.getChildren());
        for(var i=0 ; i<this._children.length ; i++){
            this._children[i].setParent(this);
        }
    }
    
    MbaNode2.prototype.checkImTheParentOfMyChildren = function(){
		for(var i=0 ; i<this._children.length ; i++){
			var currChild = this._children[i];
			if(currChild.getParent() != this)
				throw new Error("My child is not my child !");
			else
				currChild.checkImTheParentOfMyChildren();
		}
	};
    
    MbaNode2.prototype.getParentDirectiveNode = function(){
        var parentNode = this.getParent();
        while(!(parentNode instanceof MbaNodeDirective)){
              parentNode = parentNode.getParent();
        }
        return parentNode;
    };
    
    MbaNode2.prototype.getRootNode = function(){
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
    
    MbaNode2.prototype.getInitialDom = function(){
        return this._baseDom.cloneWithoutChildren();
    };
    
    MbaNode2.prototype.getBaseDom = function(){
		return this._baseDom;
	};
    
    MbaNode2.prototype.setBaseDom = function(baseDom){
		checkType(baseDom, MbaDom);
		this._baseDom = baseDom;
	};    
    
    MbaNode2.prototype.getIndexedRenderedDom = function(){
        return this._indexedRenderedDom;
    };
    
    MbaNode2.prototype.getRenderedDomForIndex = function(index){
        checkType(index, 'string');
        //TODO : faire des assert qu'on pourra désactiver contenant ce genre de code lourd
        if(this.hasNoRenderedDomForIndex(index))
            throw new MbaError(0, 'There is no renderedDom for index : \''+index+'\'');
        return this._indexedRenderedDom[index];
	};
    
    MbaNode2.prototype.getRenderedDomForRoute = function(route){
        checkType(route, MbaRoute);
        return this.getRenderedDomForIndex(route.getIndexes());
	};
        
    MbaNode2.prototype.getRenderedDom = function(){
        var renderedDom = new MbaDom();
        for(var index in this._indexedRenderedDom){
            renderedDom.add(this.getRenderedDomForIndex(index));
        }
        return renderedDom;
	};
    
    MbaNode2.prototype.getDomSizeForRoute = function(route){
        return this.getRenderedDomForRoute(route).getLength();    
    };
    
    MbaNode2.prototype.setRenderedDomForRoute = function(dom, route){
        checkType(dom, MbaDom);
        checkType(route, MbaRoute);
        this._indexedRenderedDom[route.getIndexes()] = dom;
    };
    
    MbaNode2.prototype.deleteRenderedDomForRoute = function(route){
        checkType(route, MbaRoute);
        delete this._indexedRenderedDom[route.getIndexes()];
    };
      
    MbaNode2.prototype.hasNoRenderedDomForIndex = function(index){
        checkType(index, 'string');
        return !this._indexedRenderedDom.hasOwnProperty(index);
    };
    
    MbaNode2.prototype.hasNoRenderedDomForRoute = function(route){
        checkType(route, MbaRoute);
        return this.hasNoRenderedDomForIndex(route.getIndexes());
    };       
    
    MbaNode2.prototype.createInitialDom = function(route){
        checkType(route, MbaRoute);
        var initialDom = this.getInitialDom();
        this.setRenderedDomForRoute(initialDom, route);
        this.bindRefreshEvents(route);
        this.bindActionEvents(initialDom, route);
        return initialDom;
    };
    
    MbaNode2.prototype.bindRefreshEvents = function(route){
        checkType(route, MbaRoute);
        //we do nothing here but subtypes do
    };
    
    MbaNode2.prototype.bindActionEvents = function(dom, route){
        checkType(dom, MbaDom);
        checkType(route, MbaRoute);
        for(var i=0 ; i<this._actionBindings.length ; i++){
            this._actionBindings[i].bindAction(dom, route, this);
        }
    };
    
	MbaNode2.prototype.getSize = function(){
		return this.getRenderedDom().getLength();
	};
    
	//TODO bouger dans MbaDom
	MbaNode2.prototype.referenceMeIntoDomElement = function(mbaDom){
		checkType(mbaDom, MbaDom);
		
		var dom = mbaDom.getDom();
		for(var i=0 ; i<dom.length ; i++){
			var currDom = dom[i];
			currDom.mbaNode = this;
		}
	};
            
    MbaNode2.prototype.appendDomIntoParent = function(childDom, route){
        checkType(childDom, MbaDom);
        checkType(route, MbaRoute);
        this._parent.appendDom(this, childDom, route, route);
    };
    
    MbaNode2.prototype.appendDom = function(child, childDom, route){
        checkType(child, MbaNode2);
        checkType(childDom, MbaDom);
        checkType(route, MbaRoute);
        var currentRoute = this.getClosestRoute(route);
        var dom = this.getRenderedDomForRoute(currentRoute);
        var offset = this.getChildOffset(child, currentRoute);        
        dom.insertChildAtIndex2(childDom, offset);//TODO à renommer
    };
    
    MbaNode2.prototype.getChildOffset = function(child, route){
		checkType(child, MbaNode2);
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

    
	MbaNode2.prototype.removeDomIntoParent = function(dom, route){
        checkType(dom, MbaDom);
		checkType(route, MbaRoute);
		this._parent.removeDom(dom, route);
	};
    
    MbaNode2.prototype.removeDom = function(dom, route){
        checkType(dom, MbaDom);
		checkType(route, MbaRoute);
        var currentRoute = this.getClosestRoute(route);
		this.getRenderedDomForRoute(currentRoute).removeChild(dom);//TODO renommer en removeChildren;
	};
    
    MbaNode2.prototype.deleteDom = function(route){
        checkType(route, MbaRoute);
        this.deleteChildrenDom(route);
        this.removeDomIntoParent(this.getRenderedDomForRoute(route), route);
        this.deleteRenderedDomForRoute(route);        
    };
    
    MbaNode2.prototype.deleteChildrenDom = function(route){
        checkType(route, MbaRoute);
        var children = this.getChildren();
        for(var i=0 ; i<children.length ; i++){
            children[i].deleteDom(route);
        }
    };
    
    MbaNode2.prototype.callRenderOnChildren = function(model, route){
        checkType(route, MbaRoute);
		for(var i=0 ; i<this._children.length ; i++){
			var currChild = this._children[i];
			currChild.render(model, route);
		}	
	};
    
    MbaNode2.prototype.render = function(model, route) {
        checkType(route, MbaRoute);
        if(this.hasNoRenderedDomForRoute(route)){
            var newDom = this.createInitialDom(route);
            this.appendDomIntoParent(newDom, route);    
        }
        this.callRenderOnChildren(model, route);
        this.updateDom(model, route);
	};
    
    MbaNode2.prototype.updateDom = function(model, route){
        checkType(route, MbaRoute);
        //we do nothing here but subtypes do
    };
	
    MbaNode2.prototype.updateSuperModelReference = function(newSuperModel){
        for(var i=0 ; i<this._actionBindings.length ; i++){
            this._actionBindings[i].setSuperModel(newSuperModel);
        }
    };
    
    MbaNode2.prototype.updateFromClosestParentDirective = function(model, route){
        checkType(route, MbaRoute);
        var parentDirectiveNode = this.getParentDirectiveNode();
        //parentDirectiveNode.updateChildrenForModelAndRoute(model, route);
        parentDirectiveNode.updateForModelAndRoute(model, route);
    };
    
    MbaNode2.prototype.accept = function(visitor){
        checkType(visitor, MbaNodeVisitor);
        visitor.beforeVisitNode(this);
        this.callAcceptOnChildren(visitor);
        visitor.afterVisitNode(this);
    };
    
    MbaNode2.prototype.callAcceptOnChildren = function(visitor){
        for(var i=0 ; i<this._children.length ; i++){
			var currChild = this._children[i];
            currChild.accept(visitor);
		}
    };
    
    MbaNode2.prototype.getId = function(){
        return this._baseDom.getId();
    }
    
	if(arguments.length  > 0)
		this.init(parent, baseDom);
}

function MbaNode(parent, baseDom){
	
	this._baseDom;
    this._baseDom2;
	this._parent;
	this._children;
	this._renderedDom;
	
	MbaNode.prototype.init = function(parent, baseDom, appendIntoParent){
        checkTypeOrNull(parent, MbaNode);
		checkType(baseDom, MbaDom);
		
		this._baseDom = baseDom.clone2();//TODO : faire du ménage avec les clones...
        this._baseDom2 = baseDom;
		this._parent = parent;
		this._children = [];
		this._renderedDom = baseDom;
		
		if(parent != null)
			parent.addChild(this);
		
		if(appendIntoParent==null || appendIntoParent)
			this.appendBaseDomElementsIntoParentIfNeeded();
	};	
	MbaNode.prototype.getBaseDom = function(){
		return this._baseDom;
	};
    //TODO : se débarrasser de baseDom qui est un clone et renommer baseDom2 en baseDom
    MbaNode.prototype.getBaseDom2 = function(){
		return this._baseDom2;
	};
	MbaNode.prototype.setBaseDom = function(baseDom){
		checkType(baseDom, MbaDom);
		this._baseDom = baseDom;
	};
	MbaNode.prototype.getParent = function(){
		return this._parent;
	};
	MbaNode.prototype.setParent = function(parent){
		checkType(parent, MbaNode);
		this._parent = parent;
	};
	MbaNode.prototype.detachFromParent = function(){
		this._parent = null;
	};
	MbaNode.prototype.getRenderedDom = function(){
		return this._renderedDom;
	};
	MbaNode.prototype.getSize = function(){
		return this.getRenderedDom().getLength();
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
			return null;
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
    //TODO : à supprimer si non utilisée
	MbaNode.prototype.addChildAtIndex = function(child, index){
		checkType(child, MbaNode);
		checkType(index, 'number');
		
		var newChildren = [];
		newChildren = newChildren.concat(_.first(this._children, index));
		newChildren.push(child);
		newChildren = newChildren.concat(_.rest(this._children, index));
		
		this._children = newChildren;
	};
	MbaNode.prototype.removeChild = function(child){
		checkType(child, MbaNode);
		
		this._children = _.without(this._children, child);
	};
	MbaNode.prototype.getChildPosition = function(child){
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
	//TODO : c'est pas un méthode de mbaDom plutot ? 
	MbaNode.prototype.getNodesFromMbaDom = function(dom){
		checkType(dom, MbaDom);
		
		var nodes = [];
		for(var i=0 ; i<dom.getLength() ; i++){
			var currDomElement = dom.getDom(i);
			nodes.push(currDomElement.mbaNode);
		}
		
		return nodes;
	};
    MbaNode.prototype.allNodesHaveSameParent = function(nodes){
        checkType(nodes, 'array', MbaNode);
        var parent = nodes[0].getParent();
        for(var i=1 ; i<nodes.length ; i++){
            if(nodes[i].getParent() != parent)
                return false;
        }
        return true;
    };
	
	MbaNode.prototype.referenceMeIntoDomElement = function(mbaDom){
		checkType(mbaDom, MbaDom);
		
		var dom = mbaDom.getDom();
		for(var i=0 ; i<dom.length ; i++){
			var currDom = dom[i];
			currDom.mbaNode = this;
		}
	};
	MbaNode.prototype.getChildOffset = function(child){
		checkType(child, MbaNode);
		
		var childStartIndex = this.getChildStartIndex(child);
		if(childStartIndex < 0)
			throw new Error("this child is not mine !");
		var childOffset = childStartIndex+child.getSize();		
		return childOffset;
	};
	MbaNode.prototype.getChildStartIndex = function(child){
		checkType(child, MbaNode);
		
		var thisChildIsMine = false;
		var childStartIndex = 0;
		for(var i=0 ; i<this._children.length ; i++){
			var currChild = this._children[i];
			if(currChild == child){
				thisChildIsMine = true;
				break;
			}
			childStartIndex += currChild.getSize();
		}
		if(!thisChildIsMine)
			return -1;
		return childStartIndex;
	};
	MbaNode.prototype.getChildEndIndex = function(child){
		checkType(child, MbaNode);
		
		return this.getChildOffset(child)-1;
	};
	MbaNode.prototype.appendDomIntoParent = function(dom){
		checkType(dom, MbaDom);
		
		this._parent.appendDomForChild(this, dom);
		this.getRenderedDom().add(dom);
	};
	MbaNode.prototype.appendDomForChild = function(child, dom){
		checkType(child, MbaNode);
		checkType(dom, MbaDom);
		
		var childOffset = this.getChildOffset(child);
		this.appendChildrenWithOffset(dom, childOffset);
	};
	MbaNode.prototype.appendDomForChildWithOffset = function(child, dom, offset){
		checkType(child, MbaNode);
		checkType(dom, MbaDom);
		checkType(offset, 'number');
		
		var childOffset = this.getChildStartIndex(child);
		childOffset += offset;
		
		this.appendChildrenWithOffset(dom, childOffset);
	};
	MbaNode.prototype.appendChildrenWithOffset = function(dom, offset){
		checkType(dom, MbaDom);
		checkType(offset, 'number');
		
		this.getRenderedDom().insertChildAtIndex(dom, offset);
	};
	MbaNode.prototype.appendBaseDomElementsIntoParentIfNeeded = function(){
		//TODO on pourra optimiser cette fonction si besoin
		for(var i=0 ; i<this.getRenderedDom().getLength() ; i++){
			var currElement = this.getRenderedDom().getDom(i);
			if(currElement.parentElement == null && !currElement.isTemplateRoot){
				var currMbaDom = new MbaDom(currElement);
				if(this._parent != null){
					this._parent.appendDomForChild(this, currMbaDom);
				}
			}
		}
	};
	MbaNode.prototype.removeDomIntoParent = function(){		
		this.removeDomIntoParentFromIndex(0);
	};
	MbaNode.prototype.removeDomIntoParentFromIndex = function(index){
		checkType(index, 'number');
		
		var removedDom = this._parent.removeDomForChildFromIndex(this, index);
		this.getRenderedDom().remove(removedDom);
	};
	MbaNode.prototype.removeDomForChildFromIndex = function(child, index){
		checkType(child, MbaNode);
		checkType(index, 'number');
		
		var childStartIndexBase = this.getChildStartIndex(child);
		if(childStartIndexBase < 0)
			throw new Error("this child is not mine !");
		
		var childStartIndex = childStartIndexBase+index;
		var childEndIndex = this.getChildEndIndex(child);
		
		return this.removeChildrenRangeInclude(childStartIndex, childEndIndex);
	};
	MbaNode.prototype.removeDomForChildBetweenIndexes = function(child, startIndex, endIndex){
		checkType(child, MbaNode);
		checkType(startIndex, 'number');
		checkType(endIndex, 'number');
		
		var childStartIndex = 0;
		var childEndIndex = childStartIndex;
		for(var i=0 ; i<this._children.length ; i++){
			var currChild = this._children[i];
			if(currChild == child){
				break;
			}
			else{
				childStartIndex += currChild.getSize();
				childEndIndex = childStartIndex;
			}
		}
		return this.removeChildrenRangeInclude(childStartIndex+startIndex, childStartIndex+endIndex);
	};
	MbaNode.prototype.removeChildrenRangeInclude = function(startIndex, endIndex){
		checkType(startIndex, 'number');
		checkType(endIndex, 'number');
		
		return this.getRenderedDom().removeChildrenBetween(startIndex, endIndex);
	};
	MbaNode.prototype.callRenderOnChildren = function(model){
		checkType(model, 'array', 'object');
		
		for(var i=0 ; i<this._children.length ; i++){
			var currChild = this._children[i];
			currChild.render(model);
		}	
	};
	MbaNode.prototype.render = function(model){
		this.callRenderOnChildren(model);	
	};
	MbaNode.prototype.checkImTheParentOfMyChildren = function(){
		for(var i=0 ; i<this._children.length ; i++){
			var currChild = this._children[i];
			if(currChild.getParent() != this)
				throw new Error("My child is not my child !");
			else
				currChild.checkImTheParentOfMyChildren();
		}
	};
	MbaNode.prototype.visit = function(visitor){
		checkType(visitor, MbaVisitor);
        visitor.beforeVisitNode(this);
		this.visitChildren(visitor);
        visitor.afterVisitNode(this);
	};
	
	MbaNode.prototype.visitChildren = function(visitor){
		checkType(visitor, MbaVisitor);
		for(var i=0 ; i<this._children.length ; i++){
			var currChild = this._children[i];
			currChild.visit(visitor);
		}
	};

    MbaNode.prototype.accept = function(visitor, indexInParent){
        checkType(visitor, MbaNodeVisitor);
        visitor.beforeVisitNode(this, indexInParent);
        this.callAcceptOnChildren(visitor);
        visitor.afterVisitNode(this, indexInParent);
    };
    
    MbaNode.prototype.callAcceptOnChildren = function(visitor){
        for(var i=0 ; i<this._children.length ; i++){
			var currChild = this._children[i];
            currChild.accept(visitor, i);
		}
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
    
	if(arguments.length  > 0)
		this.init(parent, baseDom);
}

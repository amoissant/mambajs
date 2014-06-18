function MbaNodeMamba(parent, baseDom, mamba){//TODO : la  paramètre parent n'est paut être jamais utilisé pour la construction, à voir si on le garde...
	
	this._mamba = mamba;

	this._bindingNodes = [];
	this._subMambasNodes = [];
	this._baseChildrenNodes = null;
	
	MbaNodeMamba.prototype.init = function(parent, baseDom, mamba){
		MbaNode.prototype.init.call(this, parent, baseDom, false);//TODO supprimer ce paramètre appendInToParent car il a compliqué les choses ?
		
		checkType(mamba, Mamba);

		this._mamba = mamba;
		var root = this._mamba.getRoot(baseDom);
		this._baseDom = root.clone(); 
		
		//TODO extract method
		for(var i=0 ; i<this._mamba.subMambas.length ; i++){
			var currSubMamba = this._mamba.subMambas[i];
			var mambaRoot = currSubMamba.getRoot(root);
			var mambaRootNodes = this.getNodesFromMbaDom(mambaRoot);
			var subMambaNode = new MbaNodeMamba(null, mambaRoot, currSubMamba);
			subMambaNode.setBaseChildrenNodes(mambaRootNodes);
			this._subMambasNodes.push(subMambaNode);
		}
		
		//TODO extract method
		for(var i=0 ; i<this._mamba.bindings.length ; i++){
			var currBinding = this._mamba.bindings[i];
			var bindingAnchor = currBinding.getAnchor(root);
			if(bindingAnchor.isEmpty())
				throw new MbaError(0, 'Selector \''+currBinding.getSelector()+'\' doesn\'t match any element of the template.');
			var bindingAnchorNode = this.getNodesFromMbaDom(bindingAnchor)[0];
			var bindingNode = new MbaNodeBinding(null, bindingAnchor, currBinding);
			bindingNode.setBaseNode(bindingAnchorNode);
			this._bindingNodes.push(bindingNode);
		}
		
		this._renderedDom = null;
	};
	MbaNodeMamba.prototype.setBaseChildrenNodes = function(baseChildren){
		checkType(baseChildren, 'array', MbaNodeHtmlElement);
		this._baseChildrenNodes = baseChildren;
	};

	//TODO refactor pour en faire une méthode, ici c'est un style statique
	MbaNodeMamba.prototype.replaceHtmlNodesByMambaNode = function(nodesToReplace, mambaNode){
		checkType(nodesToReplace, 'array', MbaNode);
		checkType(mambaNode, MbaNode);
		
		if(!this.allNodesHaveSameParent(nodesToReplace))
			throw new Error('ERROR : try to replace nodes without same parent.');
		if(nodesToReplace.length <= 0)
			throw new Error('ERROR : try to replace an empty set of nodes.');
		
		var firstChild = nodesToReplace[0]; 
		var parent = firstChild.getParent();
		parent.removeChild(mambaNode);
		var positionInParent = parent.getMinChildrenPosition(nodesToReplace);
		for(var i=0 ; i<nodesToReplace.length ; i++){
			var currNodeToReplace = nodesToReplace[i];
			parent.removeChild(currNodeToReplace);
			currNodeToReplace.setParent(mambaNode);
		}	
		mambaNode.setParent(parent);
		mambaNode.setChildren(nodesToReplace);
		parent.addChildAtIndex(mambaNode, positionInParent);
			
	};
	MbaNodeMamba.prototype.replaceHtmlNodesIntoMbaTemplate = function(){
		this.replaceHtmlNodesByMambaNode(this._baseChildrenNodes, this);
		
		for(var i=0 ; i<this._subMambasNodes.length ; i++){
			var currSubMambaNode = this._subMambasNodes[i];
			currSubMambaNode.replaceHtmlNodesIntoMbaTemplate();
		}
		
		for(var j=0 ; j<this._bindingNodes.length ; j++){
			var currBindingNode = this._bindingNodes[j];
			currBindingNode.replaceHtmlNodesIntoMbaTemplate();
		}
	};
	MbaNodeMamba.prototype.getRenderedDom = function(){
		var renderedDom = new MbaDom();
		
		for(var i=0 ; i<this._children.length ; i++){
			var currChild = this._children[i];
			renderedDom.add(currChild.getRenderedDom());
		}
		
		return renderedDom;
	};
	MbaNodeMamba.prototype.appendChildrenWithOffset = function(dom, offset){
		checkType(dom, MbaDom);
		checkType(offset, 'number');
		
		this._parent.appendDomForChildWithOffset(this, dom, offset);
	};
	MbaNodeMamba.prototype.removeChildrenRangeInclude = function(startIndex, endIndex){
		checkType(startIndex, 'number');
		checkType(endIndex, 'number');
		
		return this._parent.removeDomForChildBetweenIndexes(this, startIndex, endIndex);
	};
	MbaNodeMamba.prototype.isMyChild = function(child){
		checkType(child, MbaNode);
		return this.getChildStartIndex(child) >= 0;
	};
	MbaNodeMamba.prototype.beforeVisitMe = function(visitor){
		visitor.beforeVisitNodeMamba(this);
	};
	MbaNodeMamba.prototype.afterVisitMe = function(visitor){
		visitor.afterVisitNodeMamba(this);
	};
	if(arguments.length > 0)
		this.init(parent, baseDom, mamba);
}
MbaNodeMamba.prototype = new MbaNode();
MbaNodeMamba.prototype.constructor = MbaNodeMamba;

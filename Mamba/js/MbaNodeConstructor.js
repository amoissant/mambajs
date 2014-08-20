function MbaNodeConstructor(){
	
    this._rootNode;
    
	MbaNodeConstructor.prototype.init = function(){
	};	

    MbaNodeConstructor.prototype.getRootNode = function(){
        return this._rootNode;
    };
    
	MbaNodeConstructor.prototype.createMbaNodesForElements = function(parentNode, domElements){
		checkType(parentNode, MbaNode);
		checkType(domElements, 'array', 'dom');
		
		var nodes = [];
		for(var i=0 ; i<domElements.length ; i++){
			var currElement = domElements[i];
			var currNode = this.createMbaNodeForElement(parentNode, currElement);				
            nodes.push(currNode);
		}
		return nodes;
	};
    
	MbaNodeConstructor.prototype.createMbaNodeForElement = function(parentNode, domElement){
		checkType(parentNode, MbaNode);
		checkType(domElement, 'dom');
		
		var baseDom = new MbaDom([domElement]);//TODO MbaNodeSingle
		var node = new MbaNodeHtmlElement(parentNode, baseDom);
		var children = getDomChildren(domElement);//TODO ca marche pas avec un domElement.children direct ?
		var childrenNodes = this.createMbaNodesForElements(node, children);
		node.setChildren(childrenNodes);
		node.referenceMeIntoDomElement(baseDom);
		return node;
	};
    
    MbaNodeConstructor.prototype.constructTree = function(templateRoots){
        checkType(templateRoots, MbaDom);
        this._rootNode = new MbaRootNode(templateRoots);
        var rootNodeChildren = this.createMbaNodesForElements(this._rootNode, templateRoots.getDom());
        this._rootNode.setChildren(rootNodeChildren);
    };
	
	if(arguments.length  > 0)
		this.init();
}

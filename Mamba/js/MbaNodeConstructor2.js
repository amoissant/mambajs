function MbaNodeConstructor2(){
	
    this._rootNode;
    
	MbaNodeConstructor2.prototype.init = function(){
	};	

    MbaNodeConstructor2.prototype.getRootNode = function(){
        return this._rootNode;
    };
    
	MbaNodeConstructor2.prototype.createMbaNodesForElements = function(parentNode, domElements){
		checkType(parentNode, MbaNode2);
		checkType(domElements, 'array', 'dom');
		
		var nodes = [];
		for(var i=0 ; i<domElements.length ; i++){
			var currElement = domElements[i];
			var currNode = this.createMbaNodeForElement(parentNode, currElement);				
            nodes.push(currNode);
		}
		return nodes;
	};
    
	MbaNodeConstructor2.prototype.createMbaNodeForElement = function(parentNode, domElement){
		checkType(parentNode, MbaNode2);
		checkType(domElement, 'dom');
		
		var baseDom = new MbaDom(domElement);
		var node = new MbaNodeHtmlElement2(parentNode, baseDom);
		var children = getDomChildren(domElement);//TODO ca marche pas avec un domElement.children direct ?
		var childrenNodes = this.createMbaNodesForElements(node, children);
		node.setChildren(childrenNodes);
		node.referenceMeIntoDomElement(baseDom);
		return node;
	};
    
    MbaNodeConstructor2.prototype.constructTree = function(templateRoots){
        checkType(templateRoots, MbaDom);
        this._rootNode = new MbaRootNode(templateRoots);
        var rootNodeChildren = this.createMbaNodesForElements(this._rootNode, templateRoots.getDom());
        this._rootNode.setChildren(rootNodeChildren);
    };
	
	if(arguments.length  > 0)
		this.init();
}

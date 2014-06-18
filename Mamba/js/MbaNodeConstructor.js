function MbaNodeConstructor(){
		
	MbaNodeConstructor.prototype.init = function(){
	};	

	MbaNodeConstructor.prototype.isValidToCreateMbaNode = function(domElement){
		checkType(domElement, 'dom');
		return true;
	};
	MbaNodeConstructor.prototype.createMbaNodesForElements = function(parentNode, domElements){
		checkType(parentNode, MbaNode);
		checkType(domElements, 'array', 'dom');
		
		var nodes = [];
		for(var i=0 ; i<domElements.length ; i++){
			var currElement = domElements[i];
			if(this.isValidToCreateMbaNode(currElement)){
				var currNode = this.createMbaNodeForElement(parentNode, currElement);				
				nodes.push(currNode);
			}
		}
		return nodes;
	};
    
	MbaNodeConstructor.prototype.createMbaNodeForElement = function(parentNode, domElement){
		checkType(parentNode, MbaNode);
		checkType(domElement, 'dom');
		
		var baseDom = new MbaDom(domElement);
		var node = new MbaNodeHtmlElement(parentNode, baseDom);
		var children = getDomChildren(domElement);//TODO ca marche pas avec un domElement.children direct ?
		var childrenNodes = this.createMbaNodesForElements(node, children);
		node.setChildren(childrenNodes);
		node.referenceMeIntoDomElement(baseDom);
		return node;
	};
	
	if(arguments.length  > 0)
		this.init();
}

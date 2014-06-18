function TextNodeAnchorProvider(){
    
    TextNodeAnchorProvider.prototype.getAnchor = function(template, selector){
		checkType(template, MbaDom);
        checkType(selector, 'string');
		
		var anchor = template.find2(selector);
		var textNodeElement; 
		if(this.anchorContainsOneAndOnlyOneTextNode(anchor))
			textNodeElement = anchor.getDom(0).childNodes[0];
		else if(this.anchorHasNoChildren(anchor)){
			textNodeElement = document.createTextNode('');
			var anchorElement = anchor.getDom(0);
			anchorElement.appendChild(textNodeElement);
		}
		else	
			this.throwAnError();
		
		return new MbaDom(textNodeElement);
	};
	TextNodeAnchorProvider.prototype.anchorHasNoChildren = function(anchor){
		checkType(anchor, MbaDom);
		var anchorElement = anchor.getDom(0);
		var children = anchorElement.childNodes;
		return children.length == 0;
	};
	
	TextNodeAnchorProvider.prototype.anchorContainsOneAndOnlyOneTextNode = function(anchor){
		checkType(anchor, MbaDom);
		var anchorElement = anchor.getDom(0);
		var children = anchorElement.childNodes;
		return children.length == 1 && isATextNode(children[0]);
	};
	
	TextNodeAnchorProvider.prototype.throwAnError = function(){
		throw new MbaError(0, 'This class has to be used only if there is one children wich must be a TextNode.');
	};
}
TextNodeAnchorProvider.prototype = new AnchorProvider();
TextNodeAnchorProvider.prototype.constructor = TextNodeAnchorProvider;
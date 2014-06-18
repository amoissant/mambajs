function MbaBindingText(cssSelector, anchorProvider, firstTransf){
	
    
    //TODO : à revoir, ca doit juste retourner le premier textNode de l'élément correspondant au selecteur
	MbaBindingText.prototype.getAnchor = function(template){
		checkType(template, MbaDom);
		
		var anchor = template.find(this._selector);
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
	MbaBindingText.prototype.anchorHasNoChildren = function(anchor){
		checkType(anchor, MbaDom);
		var anchorElement = anchor.getDom(0);
		var children = anchorElement.childNodes;
		return children.length == 0;
	};
	
	MbaBindingText.prototype.anchorContainsOneAndOnlyOneTextNode = function(anchor){
		checkType(anchor, MbaDom);
		var anchorElement = anchor.getDom(0);
		var children = anchorElement.childNodes;
		return children.length == 1 && isATextNode(children[0]);
	};
	
	MbaBindingText.prototype.throwAnError = function(){
		throw new MbaError(0, 'This class has to be used only if there is one children wich must be a TextNode.');
	};
	
	if(arguments.length != 0){
		MbaBinding2.prototype.init.call(this, cssSelector, anchorProvider, firstTransf);
	}
};
MbaBindingText.prototype = new MbaBinding2();
MbaBindingText.prototype.constructor = MbaBindingText;


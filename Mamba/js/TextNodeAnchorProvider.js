function TextNodeAnchorProvider(){
    
    TextNodeAnchorProvider.prototype.getAnchor = function(template, selector){
		checkType(template, MbaDom);
        checkType(selector, 'string');
		
		var anchor = template.find2(selector);
		var textNodeElements = [];
		if(this.anchorContainsOneAndOnlyOneTextNode(anchor)){            
            for(var i=0 ; i<anchor.getLength() ; i++){
                textNodeElements.push(anchor.getDom(i).childNodes[0]);    
            }
        }
		else	
			this.throwAnError();
		
		return new MbaDom(textNodeElements);
	};
	TextNodeAnchorProvider.prototype.anchorHasNoChildren = function(anchor){
		checkType(anchor, MbaDom);
		var anchorElement = anchor.getDom(0);
		var children = anchorElement.childNodes;
		return children.length == 0;
	};
	
	TextNodeAnchorProvider.prototype.anchorContainsOneAndOnlyOneTextNode = function(anchor){
		checkType(anchor, MbaDom);
        for(var i=0 ; i<anchor.getLength() ; i++){
            var anchorElement = anchor.getDom(i);
		    var children = anchorElement.childNodes;        
            if(children.length != 1 || !isATextNode(children[0]))
                return false;
        }
        return true;
	};
	
	TextNodeAnchorProvider.prototype.throwAnError = function(){
		throw new MbaError(0, 'This class has to be used only if there is one children wich must be a TextNode.');
	};
}
TextNodeAnchorProvider.prototype = new AnchorProvider();
TextNodeAnchorProvider.prototype.constructor = TextNodeAnchorProvider;
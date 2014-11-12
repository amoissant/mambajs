function TextNodeAnchorProvider(){
    this._selector;
    this._anchor;
}
TextNodeAnchorProvider.prototype = new AnchorProvider();
TextNodeAnchorProvider.prototype.constructor = TextNodeAnchorProvider;

TextNodeAnchorProvider.prototype.getAnchor = function(template, selector){
    checkType(template, MbaDom);
    checkType(selector, 'string');
	this._selector = selector;
    this._anchor = template.find(this._selector);
	var textNodeElements = [];
	if(this.anchorContainsOneAndOnlyOneTextNode()){            
           for(var i=0 ; i<this._anchor.getLength() ; i++){
               textNodeElements.push(this._anchor.getElement(i).childNodes[0]);    
           }
       }
	else	
		this.throwAnError();	
       return new MbaAnchor(textNodeElements);
};

TextNodeAnchorProvider.prototype.anchorElementHasNotOnlyOneChild = function(anchorElement){
    checkType(anchorElement, 'dom');
	var children = anchorElement.childNodes;
	return children.length != 1;
};

TextNodeAnchorProvider.prototype.theOnlyChildIsNotATextNode = function(anchorElement){
    checkType(anchorElement, 'dom');
	return !isATextNode(anchorElement.childNodes[0]);
};

TextNodeAnchorProvider.prototype.anchorContainsOneAndOnlyOneTextNode = function(){
       for(var i=0 ; i<this._anchor.getLength() ; i++){
           var anchorElement = this._anchor.getElement(i);
           if(this.anchorElementHasNotOnlyOneChild(anchorElement) 
              || this.theOnlyChildIsNotATextNode(anchorElement))
               return false;
       }
       return true;
};

TextNodeAnchorProvider.prototype.throwAnError = function(){
	throw new Error('The elements found with \''+this._selector+'\' css selector are not empty.\n'
                    +'You can\'t bind into their innerHTML, did you want to bind into an HTML attribute '
                    +'('+this._selector+'@value) or a dom property ('+this._selector+'$value) ?');
};
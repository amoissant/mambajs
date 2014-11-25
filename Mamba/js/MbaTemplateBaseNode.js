function MbaTemplateBaseNode(){
    this._childNodes;
}

MbaTemplateBaseNode.prototype.init = function(){
    this._childNodes = [];
    return this;
};

MbaTemplateBaseNode.prototype.addChild = function(child){
    checkType(child, MbaTemplateBaseNode);
    this._childNodes.push(child);
}

MbaTemplateBaseNode.prototype.constructChildrenForDomElements = function(domElements){
    checkIsDomSetOrEmpty(domElements);
    for(var i=0 ; i<domElements.length ; i++){
        var currentDomElement = domElements[i];
        var currentNode = new MbaTemplateNode().init(this, currentDomElement);
        this.addChild(currentNode);
        currentNode.constructChildrenForDomElements(currentDomElement.childNodes);
    }
};
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

MbaTemplateBaseNode.prototype.constructChildrenForDomElements = function(domElements, templateNodeInstanciator){
    checkIsDomSetOrEmpty(domElements);
    checkType(templateNodeInstanciator, MbaTemplateNodeInstanciator);
    for(var i=0 ; i<domElements.length ; i++){
        var currentDomElement = domElements[i];
        var currentNode = templateNodeInstanciator.instanciateTemplateNode(currentDomElement._mbaId);
        currentNode.init(this, currentDomElement);
        this.addChild(currentNode);
        currentNode.constructChildrenForDomElements(currentDomElement.childNodes, templateNodeInstanciator);
    }
};

MbaTemplateBaseNode.prototype.getChildNodes = function(){
    return this._childNodes;
}
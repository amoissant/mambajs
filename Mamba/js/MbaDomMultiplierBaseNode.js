function MbaDomMultiplierBaseNode(){
    this._childNodes;    
}

MbaDomMultiplierBaseNode.prototype.init = function(){
    this._childNodes = [];
    return this;
};

MbaDomMultiplierBaseNode.prototype.addNodeForDomMultiplier = function(domMultiplier){
    checkType(domMultiplier, MbaDomMultiplier);
    var candidateChild = this.findChildToBeParentOfDomMultiplier(domMultiplier);
    if(candidateChild != null)
        candidateChild.addNodeForDomMultiplier(domMultiplier);
    else
        this.createNodeForDomMultiplier(domMultiplier);      
};

MbaDomMultiplierBaseNode.prototype.createNodeForDomMultiplier = function(domMultiplier){
    checkType(domMultiplier, MbaDomMultiplier);
    var domMultiplierNode = new MbaDomMultiplierNode().init(domMultiplier);
    this._childNodes.push(domMultiplierNode);
};

MbaDomMultiplierBaseNode.prototype.findChildToBeParentOfDomMultiplier = function(domMultiplier){
    checkType(domMultiplier, MbaDomMultiplier);
    for(var i=0 ; i<this._childNodes.length ; i++){
        var currentChildNode = this._childNodes[i];
        if(currentChildNode.modelAccessorHasSameRoot(domMultiplier))
            return currentChildNode;
    }
    return null;
};

MbaDomMultiplierBaseNode.prototype.getChildNodes = function(){
    return this._childNodes;
};
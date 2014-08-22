function MbaDom2(dom){
    this._dom;
    
    if(arguments.length > 0)
        this.init(dom);
}

MbaDom2.prototype.init = function(dom){
    checkIsDomSet(dom);
    this._dom = dom;
    if(!this.childrenHaveSameParent())
        throw new Error('All the dom elements must have the same parent.');
    if(this.isEmpty())
        throw new Error('The provided dom element array must not be empty.');
    //todo check enfant on des positions consécutives dans le parent !
    //todo il faudrait peut être faire cette vérification qui doit être couteuse seulement avant le premier render pour valider le template et les directives ?
};

MbaDom2.prototype.getElements = function(){
    return this._dom;
};

MbaDom2.prototype.getParent = function(){
    if(this.isEmpty())
        return null;
    else
        return this._dom[0].parentElement;
};

MbaDom2.prototype.isEmpty = function(){
    return this._dom.length == 0;
};

MbaDom2.prototype.childrenHaveSameParent = function(){
    if(!this.isEmpty()){
        var firstParent = this._dom[0].parentElement;
        for(var i=1 ; i<this._dom.length ; i++){
            if(this._dom[i].parentElement != firstParent)
                return false;
        }    
    }
    return true;
};

MbaDom2.prototype.toString = function(){
    var stringRepresentations = [];
    for(var i=0 ; i<this._dom.length ; i++){
        stringRepresentations.push(this._dom[i].outerHTML);
    }
    return stringRepresentations.join('');
};

MbaDom2.prototype.positionInParent = function(){
    var minPosition = this.getParent().childNodes.length;
    for(var i=0 ; i<this._dom.length ; i++){
        var currPosition = this.positionInParentOfNthElement(i);
        if(currPosition < minPosition)
            minPosition = currPosition;
    }
    return minPosition;
};

//TODO factoriser code
MbaDom2.prototype.positionInParentOfNthElement = function(nth){
    var position = -1;
    var siblings = this.getParent().childNodes;
    for(var i=0 ; i<siblings.length ; i++){
        if(siblings[i] == this._dom[nth]){
            position = i;
            break;
        }
    }    
    return position;
};

MbaDom2.prototype.removeFromParent = function(){
    var parent = this.getParent();
    for(var i=0 ; i<this._dom.length ; i++){
        parent.removeChild(this._dom[i]);
    }
};

MbaDom2.prototype.hasChildren = function(){
    for(var i=0 ; i<this._dom.length; i++){
        if(this._dom[i].childNodes.length > 0)
            return true;
    }
    return false;
};

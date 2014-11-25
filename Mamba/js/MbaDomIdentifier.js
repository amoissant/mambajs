function MbaDomIdentifier(){
    this._domElements;
    this._currentId;
}

MbaDomIdentifier.prototype.init = function(domElements){
    this._domElements = domElements;
    return this;
};

MbaDomIdentifier.prototype.addIdsLevelOrder = function(){
    this._currentId = 0;
    this.addIdsToDomCollection(this._domElements);
};

MbaDomIdentifier.prototype.addIdsToDomCollection = function(domCollection){
    for(var i=0 ; i<domCollection.length ; i++){
        var currentDomElement = domCollection[i];
        currentDomElement._mbaId = ++this._currentId;
        this.addIdsToDomCollection(currentDomElement.childNodes);
        currentDomElement._mbaMaxChildId = this._currentId;
    }
};
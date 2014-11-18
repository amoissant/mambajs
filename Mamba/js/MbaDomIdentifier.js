function MbaDomIdentifier(domArray){
    
    this._domArray;
    this._currentId;
    
    if(arguments.length > 0)
        this.init(domArray);
}

MbaDomIdentifier.prototype.init = function(domArray){
    this._domArray = domArray;
};

MbaDomIdentifier.prototype.addIdsLevelOrder = function(){
    this._currentId = 0;
    this.addIdsToDomCollection(this._domArray);
};

MbaDomIdentifier.prototype.addIdsToDomCollection = function(domCollection){
    for(var i=0 ; i<domCollection.length ; i++){
        var currentDomElement = domCollection[i];
        currentDomElement._mbaId = ++this._currentId;
        this.addIdsToDomCollection(currentDomElement.childNodes);
        currentDomElement._mbaMaxChildId = this._currentId;
    }
};
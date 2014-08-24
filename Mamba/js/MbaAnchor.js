function MbaAnchor(dom){
    
    this._dom;
    
    if(arguments.length > 0)
        this.init(dom);
}
MbaAnchor.prototype = new MbaDom();
MbaAnchor.prototype.constructor = MbaAnchor;

MbaAnchor.prototype.init = function(dom){
    checkIsDomSet(dom);
    this._dom = dom;
};

//TODO séparer dans mbaDom les fonction de lecture et d\'insertion/suppression pour que MbaAnchor hérite seulement des fonctions de lecture


MbaAnchor.prototype.hasChildren = function(){
    for(var i=0 ; i<this._dom.length; i++){
        if(this._dom[i].childNodes.length > 0)
            return true;
    }
    return false;
};

function MbaAnchor(dom){
    
    this._dom;
    
    if(arguments.length > 0)
        this.init(dom);
}
MbaAnchor.prototype = new MbaDom();
MbaAnchor.prototype.constructor = MbaAnchor;
//TODO voir si vraiement on a besoin d'hériter de MbaDom ou pas

MbaAnchor.prototype.init = function(dom){
    checkIsDomSet(dom);
    this._dom = dom;
};

MbaAnchor.prototype.getElements = function(){
    return this._dom;
};

MbaAnchor.prototype.getId = function(){
    var ids= [];
    for(var i=0 ; i<this._dom.length ; i++){
        ids.push(this._dom[i]._mbaId);
    }

    ids.sort(function(a, b){return a-b;});
    var formattedId = '';
    for(var i=0 ; i<ids.length ; i++){
        formattedId += ids[i]+'-';
    }

    return formattedId.substr(0, formattedId.length-1);
};

function MbaDom2(dom){
    this._dom;
    
    if(arguments.length > 0)
        this.init(dom);
}

MbaDom2.prototype.init = function(dom){
    checkType(dom, 'array', 'domElement');
    this._dom = dom;
};

MbaDom2.prototype.getElements = function(){
    return this._dom;
};
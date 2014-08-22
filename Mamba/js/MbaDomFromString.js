function MbaDomFromString(stringDom){
    
    this._dom;
    
    if(arguments.length > 0)
        this.init(stringDom);
}
MbaDomFromString.prototype = new MbaDom();
MbaDomFromString.prototype.constructor = MbaDomFromString;

MbaDomFromString.prototype.init = function(stringDom){
    if(typeof stringDom != 'string')
        throw new Error('stringDom must be a string.');
    this._dom = stringToDom(stringDom); 
};

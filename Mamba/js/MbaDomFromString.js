function MbaDomFromString(stringDom){
    
    if(arguments.length > 0)
        this.init(stringDom);
}
MbaDomFromString.prototype = new MbaDom();
MbaDomFromString.prototype.constructor = MbaDomFromString;

MbaDomFromString.prototype.init = function(stringDom){
    if(typeof stringDom != 'string')
        throw new Error('stringDom must be a string.');
    var dom = stringToDom(stringDom);
    MbaDom.prototype.init.call(this, dom);
};

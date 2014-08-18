function DefaultAnchorProvider(){
    
    DefaultAnchorProvider.prototype.getAnchor = function(template, selector){
        checkType(template, MbaDom);
        checkType(selector, 'string');
        return template.find(selector);
    };
}
DefaultAnchorProvider.prototype = new AnchorProvider();
DefaultAnchorProvider.prototype.constructor = DefaultAnchorProvider;
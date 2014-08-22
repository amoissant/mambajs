function DefaultAnchorProvider(){
    
    DefaultAnchorProvider.prototype.getAnchor = function(template, selector){
        checkType(template, MbaDom);
        checkType(selector, 'string');
        var dom = template.select(selector);
        return new MbaAnchor(dom);
    };
}
DefaultAnchorProvider.prototype = new AnchorProvider();
DefaultAnchorProvider.prototype.constructor = DefaultAnchorProvider;
function DirectiveExtractor(){
    
    DirectiveExtractor.prototype.getDirective = function(){
        return this._directive;
    };
    
    DirectiveExtractor.prototype.matchBinding = function(directive){
        checkType(directive, 'string');
        this._directive = directive;
        return this.match();
    };
    
    DirectiveExtractor.prototype.match = function(){};    
    DirectiveExtractor.prototype.extractSelector = function(){};
    DirectiveExtractor.prototype.extractBinding = function(){};
    DirectiveExtractor.prototype.extractEvents = function(){};
}
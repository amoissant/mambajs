function BaseExtractor(){
    
    this._bindingIndex;
    this._eventIndex;
    
    BaseExtractor.prototype.match = function(){
        var matchIndex = this.findBindingIndex();
        var match = matchIndex > -1;
        if(match)
            this.computeIndexes(matchIndex);
        return match;
    };
    
    BaseExtractor.prototype.computeIndexes = function(matchIndex){
        checkType(matchIndex, 'number');
        this._bindingIndex = matchIndex;
        this._eventIndex = this.findEventIndex();
        if(this._eventIndex < 0)
            this._eventIndex = this.getDirective().length;
        if(this._bindingIndex < 0)
            this._bindingIndex = this._eventIndex;
    };
    
    BaseExtractor.prototype.findBindingIndex = function(){
        return this.getDirective().indexOf(this.getBindingKey());
    };
    
    BaseExtractor.prototype.findEventIndex = function(){
        return this.getDirective().indexOf('->');
    };
    
    BaseExtractor.prototype.extractSelector = function(){
        return this.getDirective().substring(0, this._bindingIndex);
    };
    
    BaseExtractor.prototype.extractBinding = function(){
        return this.getDirective().substring(this._bindingIndex, this._eventIndex);
    };
    
    BaseExtractor.prototype.extractEvents = function(){
        var directive = this.getDirective();
        return directive.substring(this._eventIndex, directive.length);
    };
    
    BaseExtractor.prototype.getBindingIndex = function(){
        return this._bindingIndex;
    };
    
    BaseExtractor.prototype.getEventIndex = function(){
        return this._eventIndex;
    };
    
    BaseExtractor.prototype.getAnchorProvider = function(){
        return new DefaultAnchorProvider();
    }
    
    BaseExtractor.prototype.getBindingKey = function(){};
}
BaseExtractor.prototype = new DirectiveExtractor();
BaseExtractor.prototype.constructor = BaseExtractor;

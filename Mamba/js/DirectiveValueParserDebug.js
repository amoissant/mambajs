function DirectiveValueParserDebug(){
    
}
DirectiveValueParserDebug.prototype = new DirectiveValueParser();
DirectiveValueParserDebug.prototype.constructor = DirectiveValueParserDebug;

DirectiveValueParserDebug.prototype.computeIndexes = function(){
    DirectiveValueParser.prototype.computeIndexes.call(this);
    this.printDebugInfos();
};

DirectiveValueParser.prototype.printDebugInfos = function(){
    var binding = this.extractBinding();
    var selector = this.extractSelector();
    var events = this.computeEvents();
    
    console.log('Parse directive "'+this._directive+'" : ',
                'selector="'+selector+'",',
                'binding="'+binding+'",',
                'events=['+events.join(',')+']');
};
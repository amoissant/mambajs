function DirectiveParserDebug(){
    
}
DirectiveParserDebug.prototype = new DirectiveParser();
DirectiveParserDebug.prototype.constructor = DirectiveParserDebug;

DirectiveParserDebug.prototype.computeIndexes = function(){
    DirectiveParser.prototype.computeIndexes.call(this);
    this.printDebugInfos();
};

DirectiveParser.prototype.printDebugInfos = function(){
    var binding = this.extractBinding();
    var selector = this.extractSelector();
    var events = this.computeEvents();
    
    console.log('Parse directive "'+this._directive+'" : ',
                'selector="'+selector+'",',
                'binding="'+binding+'",',
                'events=['+events.join(',')+']');
};
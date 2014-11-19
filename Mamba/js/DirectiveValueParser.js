function DirectiveValueParser(){
    
    this._directive;
    this._extractor;
    this._events;
}
    
DirectiveValueParser.prototype.computeIndexes = function(){
    var extractors = this.getExtractors();
    for(var i=0 ; i<extractors.length ; i++){
        if(extractors[i].matchBinding(this._directive)){
            this._extractor = extractors[i];
            break;
        }
    }
};

DirectiveValueParser.prototype.setDirective = function(directive){
    checkType(directive, 'string');
    this._directive = directive;
};

DirectiveValueParser.prototype.createTransformation = function(directive){
    checkType(directive, 'string');
    this.setDirective(directive);
    this.computeIndexes();
    var transformation = this._extractor.createTransformation();
    transformation.setEvents(this.computeEvents());
    return transformation;
};

DirectiveValueParser.prototype.extractSelector = function(){
    return this._extractor.extractSelector();
};

DirectiveValueParser.prototype.extractBinding = function(){
    return this._extractor.extractBinding();
};

DirectiveValueParser.prototype.extractEvents = function(){
    return this._extractor.extractEvents();
};

DirectiveValueParser.prototype.computeEvents = function(){
    var eventsString = this._extractor.extractEvents();
    this._events = [];
    var reg = new RegExp('->\\(?([^\\)]*)\\)?');
    if(reg.test(eventsString)){
        eventsString = reg.exec(eventsString)[1];
        this._events = eventsString.split(',');   
    }        
    for(var i=0 ; i<this._events.length ; i++){
        this._events[i] = this._events[i].trim();
    }
    return this._events;
};


DirectiveValueParser.prototype.getAnchorProvider = function(){
    return this._extractor.getAnchorProvider();    
};

DirectiveValueParser.prototype.getExtractors = function(){
    var extractors = [];
    extractors.push(new CustomFunctionExtractor());
    extractors.push(new ClassWithArgExtractor());
    extractors.push(new ClassExtractor());
    extractors.push(new AttributeExtractor());
    extractors.push(new RefFunctionExtractor());
    extractors.push(new PropertyExtractor());
    extractors.push(new SimpleExtractor());
    return extractors;
};

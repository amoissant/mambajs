function DirectiveParser(){
    
    this._directive;
    this._extractor;
    
    DirectiveParser.prototype.computeIndexes = function(){
        var extractors = this.getExtractors();
        for(var i=0 ; i<extractors.length ; i++){
            if(extractors[i].matchDirective(this._directive)){
                this._extractor = extractors[i];
                break;
            }
        }
    };
    
    DirectiveParser.prototype.setDirective = function(directive){
        checkType(directive, 'string');
        this._directive = directive;
    };
    
    DirectiveParser.prototype.createTransformation = function(directive){
        checkType(directive, 'string');
        this.setDirective(directive);
        this.computeIndexes();
        var transformation = this._extractor.createTransformation();
        transformation.setEvents(this.computeEvents());
        return transformation;
    };
    
    DirectiveParser.prototype.extractSelector = function(){
        return this._extractor.extractSelector();
    };
    
    DirectiveParser.prototype.extractBinding = function(){
        return this._extractor.extractBinding();
    };
    
    DirectiveParser.prototype.extractEvents = function(){
        return this._extractor.extractEvents();
    };
    
    DirectiveParser.prototype.computeEvents = function(){
        var eventsString = this._extractor.extractEvents();
        var events = [];
        var reg = new RegExp('->\\(?([^\\)]*)\\)?');
        if(reg.test(eventsString)){
            eventsString = reg.exec(eventsString)[1];
            events = eventsString.split(',');   
        }        
        for(var i=0 ; i<events.length ; i++){
            events[i] = events[i].trim();
        }
        return events;
    };
    
    DirectiveParser.prototype.getAnchorProvider = function(){
        return this._extractor.getAnchorProvider();    
    };
    
    DirectiveParser.prototype.getExtractors = function(){
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
}
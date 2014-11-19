function MbaTextBindingParser(){
    this._textBinding;
    this._extractorList;
    this._matchingExtractor;
    this._domTransformation;
    this._selector;
    this._events;
}

MbaTextBindingParser.prototype.parseTextBinding = function(textBinding){
    checkType(textBinding, 'string');
    this._textBinding = textBinding;
    this.initExtractorList();
    this.findMatchingExtractor();
    this.extractDomTransformation();
    this.extractSelector();
    this.extractEvents();
};

MbaTextBindingParser.prototype.initExtractorList = function(){
    this._extractorList = [];
    this._extractorList.push(new CustomFunctionExtractor());
    this._extractorList.push(new ClassWithArgExtractor());
    this._extractorList.push(new ClassExtractor());
    this._extractorList.push(new AttributeExtractor());
    this._extractorList.push(new RefFunctionExtractor());
    this._extractorList.push(new PropertyExtractor());
    this._extractorList.push(new SimpleExtractor());
};

MbaTextBindingParser.prototype.findMatchingExtractor = function(){
    for(var i=0 ; i<this._extractorList.length ; i++){
        var currentExtractor = this._extractorList[i];
        if(currentExtractor.matchBinding(this._textBinding)){
            this._matchingExtractor = currentExtractor;
            return;
        }
    }
};

MbaTextBindingParser.prototype.extractDomTransformation = function(){
    this._domTransformation = this._matchingExtractor.createTransformation();
};

MbaTextBindingParser.prototype.extractSelector = function(){
    this._selector = this._matchingExtractor.extractSelector();
};

MbaTextBindingParser.prototype.extractEvents = function(){
    this._events = [];
    var textEvents = this._matchingExtractor.extractEvents();
    this.splitTextEvents(textEvents);
    this.trimEvents();
};

MbaTextBindingParser.prototype.splitTextEvents = function(textEvents){
    checkType(textEvents, 'string');
    var eventRegExp = new RegExp('->\\(?([^\\)]*)\\)?');
    if(eventRegExp.test(textEvents)){
        textEvents = eventRegExp.exec(textEvents)[1];
        this._events = textEvents.split(',');   
    }//TODO ca donne quoi si on passe 'div$value->' ? faudrait pas avoir un event vide
};

MbaTextBindingParser.prototype.trimEvents = function(){
    for(var i=0 ; i<this._events.length ; i++){
        this._events[i] = this._events[i].trim();
    }
};

MbaTextBindingParser.prototype.getSelector = function(){
    return this._selector;
};

MbaTextBindingParser.prototype.getDomTransformation = function(){
    return this._domTransformation;
};

MbaTextBindingParser.prototype.getEvents = function(){
    return this._events;
};


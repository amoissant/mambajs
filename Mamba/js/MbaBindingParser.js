function MbaBindingParser(){
    this._textBinding;
    this._memberChain;
    this._extractorList;
    this._matchingExtractor;
    this._domTransformation;
    this._selector;
    this._events;
}

MbaBindingParser.prototype.createPropertyBinding = function(textBinding, memberChain){
    checkType(textBinding, 'string');
    checkType(memberChain, 'array', 'string');
    this._textBinding = textBinding;
    this._memberChain = memberChain;
    this.initExtractorList();
    this.findMatchingExtractor();
    this.extractDomTransformation();
    this.extractSelector();
    this.extractEvents();
    return this.constructPropertyBinding();
};

MbaBindingParser.prototype.initExtractorList = function(){
    this._extractorList = [];
    this._extractorList.push(new CustomFunctionExtractor());
    this._extractorList.push(new ClassWithArgExtractor());
    this._extractorList.push(new ClassExtractor());
    this._extractorList.push(new AttributeExtractor());
    this._extractorList.push(new RefFunctionExtractor());
    this._extractorList.push(new PropertyExtractor());
    this._extractorList.push(new SimpleExtractor());
};

MbaBindingParser.prototype.findMatchingExtractor = function(){
    for(var i=0 ; i<this._extractorList.length ; i++){
        var currentExtractor = this._extractorList[i];
        if(currentExtractor.matchBinding(this._textBinding)){
            this._matchingExtractor = currentExtractor;
            return;
        }
    }
};

MbaBindingParser.prototype.extractDomTransformation = function(){
    this._domTransformation = this._matchingExtractor.createTransformation();
};

MbaBindingParser.prototype.extractSelector = function(){
    this._selector = this._matchingExtractor.extractSelector();
};

MbaBindingParser.prototype.extractEvents = function(){
    this._events = [];
    var textEvents = this._matchingExtractor.extractEvents();
    this.splitTextEvents(textEvents);
    this.trimEvents();
};

MbaBindingParser.prototype.splitTextEvents = function(textEvents){
    checkType(textEvents, 'string');
    var eventRegExp = new RegExp('->\\(?([^\\)]*)\\)?');
    if(eventRegExp.test(textEvents)){
        textEvents = eventRegExp.exec(textEvents)[1];
        this._events = textEvents.split(',');   
    }//TODO ca donne quoi si on passe 'div$value->' ? faudrait pas avoir un event vide
};

MbaBindingParser.prototype.trimEvents = function(){
    for(var i=0 ; i<this._events.length ; i++){
        this._events[i] = this._events[i].trim();
    }
};

MbaBindingParser.prototype.constructPropertyBinding = function(){
    return new MbaPropertyBinding()
                .init(this._selector,
                      this._memberChain, 
                      this._domTransformation,
                      this._events);
};
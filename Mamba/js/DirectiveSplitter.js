function DirectiveSplitter(){
      
    this._directive;
    this._commaIndexesToAvoid;
    this._filteredCommaIndexes;
    this._allCommaIndexes;
    
    DirectiveSplitter.prototype.setDirective = function(directive){
        checkType(directive, 'string');
        this._directive = directive;
    };
    
    DirectiveSplitter.prototype.getDirective = function(){
        return this._directive;  
    };
    
    DirectiveSplitter.prototype.computeMultipleEventRanges = function(){
        var eventRanges = [];
        var diretive = this.getDirective();
        var regexp = new RegExp('->\\(([^,\\(\\)]*,[^,\\(\\)]*)+\\)', 'g');
        var match;
        while((match = regexp.exec(diretive)) != null){
            var currRange = {};
            currRange.start = match.index; 
            currRange.end = match.index+match[0].length;
            eventRanges.push(currRange);
        }
        return eventRanges;
    };
    
    DirectiveSplitter.prototype.computeCustomFunctionRanges = function(){
        var customFunctionsRanges = [];
        var customFunctionExtractor = new CustomFunctionExtractor();
        var currDirective = this.getDirective();
        var currIndexOffset = 0;
        while(customFunctionExtractor.matchDirective(currDirective)){
            var currRange = {};
            currRange.start = customFunctionExtractor.getBindingIndex()+currIndexOffset
            currRange.end = customFunctionExtractor.getEventIndex()+currIndexOffset;
            customFunctionsRanges.push(currRange);

            currDirective = currDirective.substring(currRange.end, currDirective.length);
            currIndexOffset += currRange.end;
        }
        return customFunctionsRanges;
    };
    
    DirectiveSplitter.prototype.computeAllCommaIndexes = function(){
        this._allCommaIndexes = [];
        var diretive = this.getDirective();
        var regexp = new RegExp(',', 'g');
        var match;
        while((match = regexp.exec(diretive)) != null){
            this._allCommaIndexes.push(match.index);
        }
    };
    
    DirectiveSplitter.prototype.computeCommaRangesToAvoid = function(){
        var eventRanges = this.computeMultipleEventRanges();
        var customFunctionIndexes = this.computeCustomFunctionRanges();
        this._commaRangesToAvoid = eventRanges.concat(customFunctionIndexes);        
    };
    
    DirectiveSplitter.prototype.filterCommaIndexes = function(){
        this.computeCommaRangesToAvoid();
        this.computeAllCommaIndexes();
        this._filteredCommaIndexes = [];
        for(var i=0 ; i<this._allCommaIndexes.length ; i++){
            var currIndex = this._allCommaIndexes[i];
            var toInclude = true;
            for(var j=0 ; j<this._commaRangesToAvoid.length ; j++){
                var range = this._commaRangesToAvoid[j];
                if(currIndex > range.start && currIndex < range.end){
                    toInclude = false;
                    break;
                }
            }
            if(toInclude)
                this._filteredCommaIndexes.push(currIndex);
        }
        this._filteredCommaIndexes.push(this._directive.length);
    };
    
    DirectiveSplitter.prototype.splitDirective = function(directive){
        checkType(directive, 'string');
        this.setDirective(directive);
        var splittedDirectives = [];
        this.filterCommaIndexes();
        var previousIndex = 0;
        for(var i=0 ; i<this._filteredCommaIndexes.length ; i++){
            var currIndex = this._filteredCommaIndexes[i];
            var currDirective = this.getDirective().substring(previousIndex, currIndex);
            currDirective = currDirective.replace(/^,\s*/, '');
            splittedDirectives.push(currDirective);
            previousIndex = currIndex;
        }
        
        return splittedDirectives;
    };
}
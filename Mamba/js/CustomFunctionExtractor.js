function CustomFunctionExtractor(){
    
    CustomFunctionExtractor.prototype.getBindingKey = function(){
        return '${';  
    };
    
    CustomFunctionExtractor.prototype.findEventIndex = function(){
        return this.findCustomFunctionEndIndex();
    };
    
    //not reliable a 100% but may be sufficient for a custom function used for test
    CustomFunctionExtractor.prototype.findCustomFunctionEndIndex = function(){
        var openedBrackets = 0;
        var directive = this.getDirective();
        var isBeetweenQuotes = false;
        var closingQuote;
        for(var i=this._bindingIndex+1 ; i<directive.length ; i++){
            var currChar = directive.charAt(i);
            if(currChar == '\'' || currChar == '"'){
                isBeetweenQuotes = !isBeetweenQuotes;
                closingQuote = currChar;
            }
            if(currChar == '{' && !isBeetweenQuotes)    
                openedBrackets++;
            if(currChar == '}' && !isBeetweenQuotes)
                openedBrackets--;
            if(openedBrackets==0)
                return ++i;
        }
        throw new MbaError(0, 'Malformed directive, missing a \'}\': '+directive);
    };
    
    CustomFunctionExtractor.prototype.createTransformation = function(){
        var binding = this.extractBinding();
        var customFunction = binding.substring(this.getBindingKey().length, binding.length-1);
        return new MbaCustomFunctionTransf(customFunction);
    }
}
CustomFunctionExtractor.prototype = new BaseExtractor();
CustomFunctionExtractor.prototype.constructor = CustomFunctionExtractor;
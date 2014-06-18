function SimpleExtractor(){
    
    SimpleExtractor.prototype.getBindingKey = function(){
        return '';  
    };
    
    SimpleExtractor.prototype.computeIndexes = function(matchIndex){
        checkType(matchIndex, 'number');
        BaseExtractor.prototype.computeIndexes.call(this, -1);
    };
    
    SimpleExtractor.prototype.createTransformation = function(){
        return new MbaTextTransf();
    };
    
    SimpleExtractor.prototype.getAnchorProvider = function(){
        return new TextNodeAnchorProvider();  
    };
}
SimpleExtractor.prototype = new BaseExtractor();
SimpleExtractor.prototype.constructor = SimpleExtractor;
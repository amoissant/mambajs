function ClassExtractor(){
    
    ClassExtractor.prototype.getBindingKey = function(){
      return '@class';  
    };
    
    ClassExtractor.prototype.createTransformation = function(){
        return new MbaClassTransf();
    };
}
ClassExtractor.prototype = new AttributeExtractor();
ClassExtractor.prototype.constructor = ClassExtractor;
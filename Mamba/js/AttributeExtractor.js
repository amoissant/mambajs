function AttributeExtractor(){
    
    AttributeExtractor.prototype.getBindingKey = function(){
      return '@';  
    };
    
    AttributeExtractor.prototype.createTransformation = function(){
        var binding = this.extractBinding();
        var attribute = binding.substring(this.getBindingKey().length, binding.length);
        return new MbaAttributeTransf(attribute);
    };
}
AttributeExtractor.prototype = new BaseExtractor();
AttributeExtractor.prototype.constructor = AttributeExtractor;
function ClassWithArgExtractor(){
    
    ClassWithArgExtractor.prototype.getBindingKey = function(){
      return '@class(';  
    };
    
    ClassWithArgExtractor.prototype.createTransformation = function(){
        var binding = this.extractBinding();
        var className = binding.substring(this.getBindingKey().length, binding.length-1);
        return new MbaClassWithArgTransf(className);
    };
}
ClassWithArgExtractor.prototype = new BaseExtractor();
ClassWithArgExtractor.prototype.constructor = ClassWithArgExtractor;

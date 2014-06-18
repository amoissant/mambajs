function RefFunctionExtractor(){
    
    RefFunctionExtractor.prototype.getBindingKey = function(){
      return '$:';  
    };
    
    RefFunctionExtractor.prototype.createTransformation = function(){
        var binding = this.extractBinding();
        var refFunction = binding.substring(this.getBindingKey().length, binding.length);
        return new MbaRefFunctionTransf(refFunction);
    }
}
RefFunctionExtractor.prototype = new BaseExtractor();
RefFunctionExtractor.prototype.constructor = RefFunctionExtractor;
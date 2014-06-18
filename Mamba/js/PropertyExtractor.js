function PropertyExtractor(){
    
    PropertyExtractor.prototype.findBindingIndex = function(){
        var reg = new RegExp('\\$[^=]');
        var match = reg.exec(this.getDirective());
        if(match != null)
            return match.index;
        else
            return -1;
    };
    
    PropertyExtractor.prototype.createTransformation = function(){
        var binding = this.extractBinding();
        var propertyName = binding.substring(1, binding.length);
        return new MbaPropertyTransf(propertyName);
    };
}
PropertyExtractor.prototype = new BaseExtractor();
PropertyExtractor.prototype.constructor = PropertyExtractor;

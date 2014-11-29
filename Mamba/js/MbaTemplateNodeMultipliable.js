function MbaTemplateNodeMultipliable(){
}
MbaTemplateNodeMultipliable.prototype = new MbaTemplateNode();
MbaTemplateNodeMultipliable.prototype.constructor = MbaTemplateNodeMultipliable;

MbaTemplateNodeMultipliable.prototype.multiplyForAccessorAndRoute = function(modelAccessor, route){
    checkType(modelAccessor, MbaAccessorChain2);
    checkType(route, 'array', 'string');
    console.log(this._domElement.outerHTML, modelAccessor.toString(), route.toString());
    this.renderForAccessorAndRoute(modelAccessor, route);
};
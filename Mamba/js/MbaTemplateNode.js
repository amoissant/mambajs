function MbaTemplateNode(){
    this._domElement;
    this._parent;
    this._renderedDomMap;//TODO : ici au lieux d'avoir une map de map il suffit d'avoir une map de tableau
}
MbaTemplateNode.prototype = new MbaTemplateBaseNode();
MbaTemplateNode.prototype.constructor = MbaTemplateNode;

MbaTemplateNode.prototype.init = function(parent, domElement){
    checkType(parent, MbaTemplateBaseNode);
    checkType(domElement, 'dom');
    MbaTemplateBaseNode.prototype.init.call(this);
    this._parent = parent;
    this._domElement = domElement;
    this._renderedDomMap = {};
    return this;
};

MbaTemplateNode.prototype.renderForAccessorAndRoute = function(modelAccessor, route){
    checkType(modelAccessor, MbaAccessorChain2);
    checkType(route, 'array', 'string');
    this.createDomElementForAccessorAndRoute(modelAccessor, route);
    this.renderChildrenForAccessorAndRoute(modelAccessor, route);
};

MbaTemplateNode.prototype.createDomElementForAccessorAndRoute = function(modelAccessor, route){
    checkType(modelAccessor, MbaAccessorChain2);
    checkType(route, 'array', 'string');
    if(!this.hasRenderedDomForAccessor(modelAccessor))
        this.initRenderedDomForAccessor(modelAccessor);
    var newDomElement = this._domElement.cloneNode(false);
    this.setDomElementForAccessorAndRoute(newDomElement, modelAccessor, route); 
    this.insertIntoParent(newDomElement, modelAccessor, route);
}; 

MbaTemplateNode.prototype.hasRenderedDomForAccessor = function(modelAccessor){
    checkType(modelAccessor, MbaAccessorChain2);
    return this._renderedDomMap[modelAccessor.getId()] != null;
};

MbaTemplateNode.prototype.initRenderedDomForAccessor = function(modelAccessor){
    checkType(modelAccessor, MbaAccessorChain2);
    this._renderedDomMap[modelAccessor.getId()] = {};//TODO tableau ici plutot
};

MbaTemplateNode.prototype.getDomElementForAccessorAndRoute = function(modelAccessor, route){
    checkType(modelAccessor, MbaAccessorChain2);
    checkType(route, 'array', 'string');
    return this._renderedDomMap[modelAccessor.getId()][route];//TODO ; utiliser la fin de la route 
    //ex : return this._renderedDomMap[modelAccessor.getId()][dernier élément de la route]
};

MbaTemplateNode.prototype.setDomElementForAccessorAndRoute = function(domElement, modelAccessor, route){
    checkType(domElement, 'domElement');
    checkType(modelAccessor, MbaAccessorChain2);
    checkType(route, 'array', 'string');
    this._renderedDomMap[modelAccessor.getId()][route] = domElement;
};

MbaTemplateNode.prototype.insertIntoParent = function(domElement, modelAccessor, route){
    checkType(domElement, 'domElement');
    checkType(modelAccessor, MbaAccessorChain2);
    checkType(route, 'array', 'string');
    var domId = this._domElement._mbaId;
    this._parent.insertDomElement(domElement, domId, modelAccessor, route);
};

MbaTemplateNode.prototype.insertDomElement = function(domElement, domId, modelAccessor, route){
    checkType(domElement, 'domElement');
    checkType(domId, 'number');
    checkType(modelAccessor, MbaAccessorChain2);
    checkType(route, 'array', 'string');
    //TODO optimiser ici, mettre en cache les parentModelAccessor par exemple
    var parentModelAccessor = new MbaAccessorChain2().initFromAccessorChain(modelAccessor);
    var parentRoute = route.slice();
    while(!this.hasRenderedDomForAccessor(parentModelAccessor) && parentModelAccessor.getSize() > 0){
        parentModelAccessor.removeLastAccessor();
        parentRoute.pop();
    }
    var parentDomElement = this.getDomElementForAccessorAndRoute(parentModelAccessor, parentRoute);
    parentDomElement.appendChild(domElement);
};

MbaTemplateNode.prototype.getId = function(){
    return this._domElement._mbaId;
};
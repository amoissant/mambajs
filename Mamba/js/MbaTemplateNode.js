function MbaTemplateNode(){
    this._domElement;
    this._parent;
    this._renderedDomMap;
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

MbaTemplateNode.prototype.createDomForRoute = function(modelRoute){
    checkType(modelRoute, MbaRoute2);
    this.createDomElementForRoute(modelRoute);
    this.askChildrenCreateDomForRoute(modelRoute);
};

MbaTemplateNode.prototype.createDomElementForRoute = function(modelRoute){
    checkType(modelRoute, MbaRoute2);
    if(!this.hasRenderedDomForRoute(modelRoute))
        this.initRenderedDomForRoute(modelRoute);
    var newDomElement = this._domElement.cloneNode(false);
    this.setDomElementForRoute(newDomElement, modelRoute); 
    this.insertIntoParent(newDomElement, modelRoute);
}; 

MbaTemplateNode.prototype.hasRenderedDomForRoute = function(modelRoute){
    checkType(modelRoute, MbaRoute2);
    return this._renderedDomMap[modelRoute.getAccessorId()] != null;
};

MbaTemplateNode.prototype.initRenderedDomForRoute = function(modelRoute){
    checkType(modelRoute, MbaRoute2);
    this._renderedDomMap[modelRoute.getAccessorId()] = [];
};

MbaTemplateNode.prototype.setDomElementForRoute = function(domElement, modelRoute){
    checkType(domElement, 'domElement');
    checkType(modelRoute, MbaRoute2);
    this._renderedDomMap[modelRoute.getAccessorId()][modelRoute.getIndex()] = domElement;
};

MbaTemplateNode.prototype.insertIntoParent = function(domElement, modelRoute){
    checkType(modelRoute, MbaRoute2);
    var domId = this._domElement._mbaId;
    this._parent.insertDomElement(domElement, domId, modelRoute);
};

MbaTemplateNode.prototype.insertDomElement = function(domElement, domId, modelRoute){
    checkType(domElement, 'domElement');
    checkType(domId, 'number');
    checkType(modelRoute, MbaRoute2);
    //TODO optimiser ici, mettre en cache les parentModelAccessor par exemple
    var parentRoute = modelRoute.clone();
    while(!this.hasRenderedDomForRoute(parentRoute)){
        if(parentRoute.isEmpty())
            throw new Error('can\'t find rendered dom for parent route');
        parentRoute.removeLastPart();
    }
    var parentDomElement = this.getDomElementForRoute(parentRoute);
    parentDomElement.appendChild(domElement);
};

MbaTemplateNode.prototype.getDomElementForRoute = function(modelRoute){
    checkType(modelRoute, MbaRoute2);
    return this._renderedDomMap[modelRoute.getAccessorId()][modelRoute.getIndex()];
};

MbaTemplateNode.prototype.getId = function(){
    return this._domElement._mbaId;
};
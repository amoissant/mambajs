function MbaTemplateNode(){
    this._domElement;
    this._parent;
    this._renderedDomMap;
    this._domSizeForParentRoute;
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
    this._domSizeForParentRoute = {};
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
    var newDomElementId = this._domElement._mbaId;
    this.setDomElementForRoute(newDomElement, modelRoute); 
    this.insertDomElementIntoParent(newDomElement, newDomElementId, modelRoute);
}; 

MbaTemplateNode.prototype.hasRenderedDomForRoute = function(modelRoute){
    checkType(modelRoute, MbaRoute2);
    return this._renderedDomMap[modelRoute.getAccessorId()] != null;
};

MbaTemplateNode.prototype.initRenderedDomForRoute = function(modelRoute){
    checkType(modelRoute, MbaRoute2);
    this._renderedDomMap[modelRoute.getAccessorId()] = {};
};

MbaTemplateNode.prototype.setDomElementForRoute = function(domElement, modelRoute){
    checkType(domElement, 'domElement');
    checkType(modelRoute, MbaRoute2);
    this._renderedDomMap[modelRoute.getAccessorId()][modelRoute.getIndexesId()] = domElement;
};

MbaTemplateNode.prototype.insertDomElementIntoParent = function(domElement, domId, modelRoute){
    checkType(modelRoute, MbaRoute2);
    checkType(domId, 'number');
    var parentRoute = this._parent.computeParentRoute(modelRoute);//TODO optimiser car c'est appelé deux fois
    this._parent.insertChildDomElement(domElement, domId, modelRoute);
    this.increaseDomSizeForParentRoute(parentRoute);
};

MbaTemplateNode.prototype.computeParentRoute = function(childRoute){
    checkType(childRoute, MbaRoute2);
    var parentRoute = childRoute.clone();
    while(!this.hasRenderedDomForRoute(parentRoute)){
        if(parentRoute.isEmpty())
            throw new Error('can\'t find rendered dom for parent route');
        parentRoute.removeLastPart();
    }
    return parentRoute;
};

MbaTemplateNode.prototype.insertChildDomElement = function(childDomElement, childDomId, childRoute){
    checkType(childDomElement, 'domElement');
    checkType(childDomId, 'number');
    checkType(childRoute, MbaRoute2);
    var parentRoute = this.computeParentRoute(childRoute);
    var insertBeforeIndex = this.computeChildInsertionIndex(childDomId, parentRoute);
    var parentDomElement = this.getDomElementForRoute(parentRoute);
    var nextChildDomElement = parentDomElement.childNodes[insertBeforeIndex];
    parentDomElement.insertBefore(childDomElement, nextChildDomElement);
};

MbaTemplateNode.prototype.computeChildInsertionIndex = function(childDomId, parentRoute){
    checkType(childDomId, 'number');
    checkType(parentRoute, MbaRoute2);;
    var insertionIndex = 0;
    for(var i=0 ; i<this._childNodes.length ; i++){
        var childTemplateNode = this._childNodes[i];
        insertionIndex += childTemplateNode.getDomSizeForParentRoute(parentRoute);
        if(childTemplateNode.getId() == childDomId)
            return insertionIndex;
    }
    throw new Error('childDomId not found in parent\'s children.');
};

MbaTemplateNode.prototype.increaseDomSizeForParentRoute = function(parentRoute){
    checkType(parentRoute, MbaRoute2);
    this.initIfNeededDomSizeForParentRoute(parentRoute);
    this._domSizeForParentRoute[parentRoute]++;
};

MbaTemplateNode.prototype.getDomSizeForParentRoute = function(parentRoute){
    checkType(parentRoute, MbaRoute2);
    this.initIfNeededDomSizeForParentRoute(parentRoute);
    return this._domSizeForParentRoute[parentRoute];
};

MbaTemplateNode.prototype.initIfNeededDomSizeForParentRoute = function(parentRoute){
    checkType(parentRoute, MbaRoute2);
    if(this._domSizeForParentRoute[parentRoute] == null)
        this._domSizeForParentRoute[parentRoute] = 0;
};

MbaTemplateNode.prototype.getDomElementForRoute = function(modelRoute){
    checkType(modelRoute, MbaRoute2);
    return this._renderedDomMap[modelRoute.getAccessorId()][modelRoute.getIndexesId()];
};

MbaTemplateNode.prototype.getId = function(){
    return this._domElement._mbaId;
};
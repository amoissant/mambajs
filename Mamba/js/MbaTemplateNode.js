function MbaTemplateNode(){
    this._domElement;
    this._parent;
    this._renderedDomMap;
    this._routes;
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
    this._routes = {};
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
    var newDomElement = this._domElement.cloneNode(false);
    this.addIntoRenderedDomMap(newDomElement, modelRoute); 
    this.insertDomElementIntoParent(newDomElement, this.getTemplateDomId(), modelRoute);
}; 

MbaTemplateNode.prototype.hasRenderedDomForRoute = function(modelRoute){
    checkType(modelRoute, MbaRoute2);
    return this._renderedDomMap[modelRoute] != null;
};

MbaTemplateNode.prototype.addIntoRenderedDomMap = function(domElement, modelRoute){
    checkType(domElement, 'domElement');
    checkType(modelRoute, MbaRoute2);
    this._renderedDomMap[modelRoute] = domElement;
    this._routes[modelRoute] = modelRoute.clone();//TODO couteux, optimiser l'implémentation de la classe route
    //si on veut juste pouvoir enlever la fin pour computeParentRoute alors une chaine de caractère devrait suffire :)
    //-> "model[0].sub[1]" à vérifier au bench
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
        if(childTemplateNode.getTemplateDomId() == childDomId)
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
    var domElement = this._renderedDomMap[modelRoute];
    if(domElement == null)
        throw new Error('dom Element is null.')
    return domElement;
};

MbaTemplateNode.prototype.deleteDomForRoute = function(modelRoute){
    checkType(modelRoute, MbaRoute2);
    this.askChildrenDeleteDomForRoute(modelRoute);
    this.deleteDomElementForRoute(modelRoute);
};

MbaTemplateNode.prototype.askChildrenDeleteDomForRoute = function(modelRoute){
    checkType(modelRoute, MbaRoute2);
    for(var i=0 ; i<this._childNodes.length ; i++){
        var currentNode = this._childNodes[i];
        if((currentNode instanceof MbaTemplateNodeMultipliable))
            currentNode.deleteDomForParentRoute(modelRoute);
        else
            currentNode.deleteDomForRoute(modelRoute);
    }
};

MbaTemplateNode.prototype.deleteDomForParentRoute = function(parentRoute){
    checkType(parentRoute, MbaRoute2);
    for(var childRouteId in this._renderedDomMap){
        if(parentRoute.isParentOfRouteId(childRouteId))
            this.deleteDomForRoute(this._routes[childRouteId]);
    }
}; 

MbaTemplateNode.prototype.deleteDomElementForRoute = function(modelRoute){
    checkType(modelRoute, MbaRoute2);
    var domElement = this.getDomElementForRoute(modelRoute);
    this.removeDomElementIntoParent(domElement, modelRoute);
    this.removeFromRenderedDomMap(modelRoute);
}; 

MbaTemplateNode.prototype.removeFromRenderedDomMap = function(modelRoute){
    delete this._renderedDomMap[modelRoute];
    delete this._routes[modelRoute];
};

MbaTemplateNode.prototype.removeDomElementIntoParent = function(domElement, modelRoute){
    checkType(domElement, 'domElement');
    checkType(modelRoute, MbaRoute2);
    var parentRoute = this._parent.computeParentRoute(modelRoute);//TODO optimiser car c'est appelé plusieurs fois
    this._parent.removeChildDomElement(domElement, modelRoute);
    this.decreaseDomSizeForParentRoute(parentRoute);
};

MbaTemplateNode.prototype.removeChildDomElement = function(childDomElement, childRoute){
    checkType(childDomElement, 'domElement');
    checkType(childRoute, MbaRoute2);
    var parentRoute = this.computeParentRoute(childRoute);
    var parentDomElement = this.getDomElementForRoute(parentRoute);
    parentDomElement.removeChild(childDomElement);
};

MbaTemplateNode.prototype.decreaseDomSizeForParentRoute = function(parentRoute){
    checkType(parentRoute, MbaRoute2);
    this._domSizeForParentRoute[parentRoute]--;
};

MbaTemplateNode.prototype.getTemplateDomId = function(){
    return this._domElement._mbaId;
};
function MbaNodeDirective(baseDom, templateDirective){

    this._templateDirective;
    this._indexedModelSize;
    this._parentRoute;
    this._modelArray;
    this._modelRoute;
    this._indexedRoutes;
	
    //TODO : gérer le cas où le MbaNodeDirective correspond à plusieurs éléments non contigus
	MbaNodeDirective.prototype.init = function(baseDom, templateDirective){
        checkType(baseDom, MbaDom);
		checkType(templateDirective, MbaTemplateDirective);
		MbaNode.prototype.init.call(this, null, baseDom);
        this._templateDirective = templateDirective;
        this._indexedModelSize = {};
        this._indexedRoutes = {};
    };
    
    MbaNodeDirective.prototype.getAccessorChain = function(){
        return this._templateDirective.getAccessorChain();  
    };
    
    MbaNodeDirective.prototype.computeModelRoutesAndIndex = function(model, route){
        checkType(route, MbaRoute);
        this._parentRoute = route;
        this._modelArray = this.getModelValue(model, this._parentRoute);
        this._modelArray = toArray(this._modelArray);
        this._modelRoute = this.getLastRoute(); 
        if(this._indexedRoutes[route.getIndexes()] == null)
            this._indexedRoutes[route.getIndexes()] = [];
    };
    
    MbaNodeDirective.prototype.hasModelSizeForRoute = function(route){
        checkType(route, MbaRoute);
        return this._indexedModelSize[route.getIndexes()] != null;
    };
    
    MbaNodeDirective.prototype.getModelSizeForRoute = function(route){
        checkType(route, MbaRoute);
        return this._indexedModelSize[route.getIndexes()];
    };
    
    MbaNodeDirective.prototype.updateIndexedModelSize = function(){
        this._indexedModelSize[this._modelRoute.getIndexes()] = this._modelArray.length;
    };
    
    MbaNodeDirective.prototype.getModelValue = function(model, route){
        checkType(route, MbaRoute);
        var modelValue = this._templateDirective.getModelValue(model, route);
        return modelValue;
    };
    
    MbaNodeDirective.prototype.getLastRoute = function(){
        return this._templateDirective.getLastRoute();
    };
    
    MbaNodeDirective.prototype.getIndexedRoutes = function(){
      return this._indexedRoutes;  
    };
    
    MbaNodeDirective.prototype.getDomSizeForRoute = function(route){
        checkType(route, MbaRoute);
        var domSize = 0;
        var indexedRoutes = this.getIndexedRoutes();
        var currRoutes = indexedRoutes[route.getIndexes()];
        for(var index in currRoutes)
            domSize += this.getRenderedDomForIndex(index).getLength();
        
        return domSize;
    };
        
    /**************************************************************/
    /****** méthodes relatives à l'arborescences de MbaNodes ******/
    /**************************************************************/
    
	MbaNodeDirective.prototype.isAnEmptySetOfNodes = function(nodes){
        checkType(nodes, 'array', MbaNode);
        return nodes.length == 0;
    };
    MbaNodeDirective.prototype.allNodesHaveSameParent = function(nodes){
        checkType(nodes, 'array', MbaNode);
        var parent = nodes[0].getParent();
        for(var i=1 ; i<nodes.length ; i++){
            if(nodes[i].getParent() != parent)
                return false;
        }
        return true;
    };
    MbaNodeDirective.prototype.nodesAreContiguous = function(nodes, nodesPosition){
        checkType(nodes, 'array', MbaNode);
        checkType(nodesPosition, 'array', 'number');
        
        nodesPosition.sort(function(a,b){return a-b});
        var firstChildIndex = nodesPosition[0];
        var contiguousChildIndex = firstChildIndex;
        for(var i=0 ; i<nodesPosition.length ; i++){
            if(nodesPosition[i] != contiguousChildIndex)
                return false;
            contiguousChildIndex++;
        }
        return true;
    };
    MbaNodeDirective.prototype.checkCanInterpose = function(nodes){
        checkType(nodes, 'array', MbaNode);
        if(this.isAnEmptySetOfNodes(nodes))
            throw new MbaError(0, 'Nodes must not be empty');
        if(!this.allNodesHaveSameParent(nodes))
            throw new MbaError(1, 'All nodes must have same parent');
        var nodesPosition = this.getNodesPositionInParent(nodes);
        if(!this.nodesAreContiguous(nodes, nodesPosition))
            throw new MbaError(2, 'Nodes must be contiguous in parent');
        return nodesPosition;
    };
    MbaNodeDirective.prototype.getNodesPositionInParent = function(nodes){
        checkType(nodes, 'array', MbaNode);
        var nodesPosition = [];
        for(var i=0 ; i<nodes.length ; i++){
            var currNode = nodes[i];
            nodesPosition.push(currNode.getPositionInParent());
        }
        return nodesPosition;
    };
    MbaNodeDirective.prototype.interposeUnderParentOfNodesInTree = function(nodes){
        checkType(nodes, 'array', MbaNode);
        var nodesPosition = this.checkCanInterpose(nodes);
        var parent = nodes[0].getParent();
        
        this.setChildren(nodes);
        for(var i=0 ; i<nodes.length ; i++){
            nodes[i].setParent(this);
        }
        this.setParent(parent);
        parent.replaceChildrenIncludedInIndexes(nodesPosition[0], nodesPosition[nodesPosition.length-1], this);
    };
    
        
    /************************************************************************/
    /****** méthodes relatives à l'ajout/suppression d'éléments de dom ******/
    /************************************************************************/

   MbaNodeDirective.prototype.createInitialDom = function(route){
        checkType(route, MbaRoute);
       var parentIndex = this._parentRoute.getIndexes() 
       if(this._indexedRoutes[parentIndex] == null)
            this._indexedRoutes[parentIndex] = {};
    
        var initialDom = MbaNode.prototype.createInitialDom.call(this, route);
        var index = route.getIndexes();
        this._indexedRoutes[parentIndex][index] = initialDom;
        return initialDom;
    };
    
    MbaNodeDirective.prototype.deleteRenderedDomForRoute = function(route){
        checkType(route, MbaRoute);
        var parentRoute = this.getParent().getClosestRoute(route);//TODO faire un test qui vérifie les indexedRoutes de nodeDirective
        var parentIndex = parentRoute.getIndexes();
        var index = route.getIndexes();
        delete this._indexedRoutes[parentIndex][index];
        return MbaNode.prototype.deleteRenderedDomForRoute.call(this, route);
    };
    
    
    MbaNodeDirective.prototype.getInitialDom = function(){
        return new MbaDom();
    };
            
    MbaNodeDirective.prototype.appendDom = function(child, childDom, route){
        checkType(child, MbaNode);
        checkType(childDom, MbaDom);
        checkType(route, MbaRoute);
        var currentRoute = this.getClosestRoute(route);
        this.getRenderedDomForRoute(currentRoute).add(childDom);
        this._parent.appendDom(this, childDom, route);
    };
    
    MbaNodeDirective.prototype.removeDom = function(dom, route){
        checkType(dom, MbaDom);
		checkType(route, MbaRoute);
        this.getRenderedDomForRoute(route).remove(dom);
		this._parent.removeDom(dom, route.newParentRoute());
	};
    
    MbaNodeDirective.prototype.deleteDom = function(route){
        checkType(route, MbaRoute);
        this.deleteChildrenDomFromModelIndex(route, 0);
        var childRoute = route.newChildRoute();
        for(var i=0 ; i<this.getModelSizeForRoute(route) ; i++){
            childRoute.setLastIndex(i);
            this.deleteRenderedDomForRoute(childRoute);   
        }
    };    
    
    MbaNodeDirective.prototype.deleteChildrenDomFromModelIndex = function(route, index){
        checkType(route, MbaRoute);  
        checkType(index, 'number');  
        var children = this.getChildren();
        var childRoute = route.newChildRoute();
        var modelSize = this.getModelSizeForRoute(route);
        for(var i=index ; i<modelSize ; i++){
            childRoute.setLastIndex(i);
            for(var j=0 ; j<children.length ; j++){
                children[j].deleteDom(childRoute);
            }
            this.deleteRenderedDomForRoute(childRoute);   
        }   
    };
    
    MbaNodeDirective.prototype.updateDom = function(model, childRoute){
        checkType(childRoute, MbaRoute);
        for(var i=0 ; i<this._modelArray.length ; i++){
            childRoute.setLastIndex(i);
            this.updateDomForOneModelElement(model, childRoute);
            this.referenceModelIntoRenderedDom(childRoute, i);
        } 
    };
    
    MbaNodeDirective.prototype.updateDomForOneModelElement = function(model, childRoute){
        checkType(childRoute, MbaRoute);
        if(this.hasNoRenderedDomForRoute(childRoute)){
            this.createInitialDom(childRoute);
        }
        this.callRenderOnChildren(model, childRoute);
    };    
    
    MbaNodeDirective.prototype.render = function(model, route) {
        checkType(route, MbaRoute);
        this.computeModelRoutesAndIndex(model, route);
        
        var childRoute = this._modelRoute.newChildRoute();
        this.updateDom(model, childRoute);
        if(this.hasModelSizeForRoute(this._modelRoute)){
            this.deleteChildrenDomFromModelIndex(this._modelRoute, this._modelArray.length);
        }
        this.updateIndexedModelSize();
	};
    
    MbaNodeDirective.prototype.updateChildrenForModelAndRoute = function(model, route){
        checkType(route, MbaRoute);
        var rootNode = this.getRootNode();
        rootNode.trySetParentDom();
        var updateRoute = this.getClosestRoute(route);
        this.callRenderOnChildren(model, updateRoute);
        this.getRootNode().whenDomUpdated();
    };
    
    MbaNodeDirective.prototype.updateForModelAndRoute = function(model, route){
        checkType(route, MbaRoute);
        var modelRoute = this._templateDirective.shortenRoute(route);
        this.render(model, modelRoute);
        this.getRootNode().whenDomUpdated();
    };
    
    MbaNodeDirective.prototype.referenceModelIntoRenderedDom = function(modelRoute, modelIndex){
        checkType(modelRoute, MbaRoute);
        checkType(modelIndex, 'number');
        var renderedDom = this.getRenderedDomForRoute(modelRoute);
        var model = this._modelArray[modelIndex];
        renderedDom.referenceModel(model);
    };
    
	if(arguments.length > 0)
		this.init(baseDom, templateDirective);
}
MbaNodeDirective.prototype = new MbaNode();
MbaNodeDirective.prototype.constructor = MbaNodeDirective;
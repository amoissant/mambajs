function DebugNodeVisitor(printIndexedRenderedDom){
    
    this._deep = -1;
    this._printIndexedRenderedDom = printIndexedRenderedDom==null?false:printIndexedRenderedDom;
    
    DebugNodeVisitor.prototype.getDeep = function(){
        return this._deep;  
    };
    
    DebugNodeVisitor.prototype.increaseDeep = function(){
        this._deep++;
    };
    
    DebugNodeVisitor.prototype.decreaseDeep = function(){
        this._deep--;
    };
    
    DebugNodeVisitor.prototype.beforeVisitNode = function(node){
        checkType(node, MbaNode);
        this.increaseDeep();
        this.print(node);
    };
    
    DebugNodeVisitor.prototype.afterVisitNode = function(node){
        checkType(node, MbaNode);
		this.decreaseDeep();
    };
    
    DebugNodeVisitor.prototype.print = function(node){
        checkType(node, MbaNode);
        var nodeTypeName = this.getNodeTypeName(node);
        this.printNode(node, nodeTypeName);

        if(nodeTypeName == MbaNodeDirective.prototype.constructor.name)
            this.printIndexedRoutes(node, nodeTypeName);
        
        if(this._printIndexedRenderedDom){
                this.printIndexedRenderedDom(node, nodeTypeName);
        }
	};
    
    DebugNodeVisitor.prototype.getNodeTypeName = function(node){
        checkType(node, MbaNode);
        return Object.getPrototypeOf(node).constructor.name;
    };    
    
    DebugNodeVisitor.prototype.printIndexedRoutes = function(node, nodeTypeName){
        checkType(node, MbaNode);
        checkType(nodeTypeName, 'string');
        var indexedRenderedDomIndentation = this.getIndentation()+this.getNSpaces(nodeTypeName.length);
        var indexedRoutes = node.getIndexedRoutes();
        for(var index in indexedRoutes){
            console.log(indexedRenderedDomIndentation, index, ':', Object.keys(indexedRoutes[index]));
        }
    };
    
    DebugNodeVisitor.prototype.printNode = function(node, nodeTypeName){
        checkType(node, MbaNode);
        checkType(nodeTypeName, 'string');
        console.log(this.getIndentation(),
                    nodeTypeName,
                    ' - ',
                    node.getBaseDom().getElements());
    };
        
    DebugNodeVisitor.prototype.printIndexedRenderedDom = function(node, nodeTypeName){
        checkType(node, MbaNode);
        checkType(nodeTypeName, 'string');
        var indexedRenderedDom = node.getIndexedRenderedDom();
        var indexedRenderedDomIndentation = this.getIndentation()+this.getNSpaces(nodeTypeName.length);
        for(var index in indexedRenderedDom){
            console.log(indexedRenderedDomIndentation+'   - ', index, indexedRenderedDom[index].getElements());
        }  
    };
    
    DebugNodeVisitor.prototype.getNSpaces = function(n){
        checkType(n, 'number');
        var spaces = '';
        for(var i=0 ; i<n ; i++)
            spaces += ' ';
        return spaces;
    };
    
	DebugNodeVisitor.prototype.getIndentation = function(){
		var indentation = '';
		for(var i=0 ; i<this.getDeep() ; i++){
			indentation += '    ';
		}
		return indentation;
	};
}
DebugNodeVisitor.prototype = new MbaNodeVisitor();
DebugNodeVisitor.prototype.constructor = DebugNodeVisitor;
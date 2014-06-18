function DebugVisitor(){
	
	this.mbaTree = null;
	this._deep = -1;
	
    DebugVisitor.prototype.beforeVisitNode = function(node){
        checkType(node, MbaNode2);
        this._deep += 1;
        this.print(node);
    };
    DebugVisitor.prototype.afterVisitNode = function(node){
		checkType(node, MbaNode2);
		this._deep -= 1;
	};
	DebugVisitor.prototype.print = function(node){
        console.log(this.getIndentation(),
                    Object.getPrototypeOf(node).constructor.name,
                    ' - ',
                    node.getBaseDom().getDom(),
                    ' - ',
                    node.getRenderedDom().getDom());
	};
	DebugVisitor.prototype.getIndentation = function(){
		var indentation = '';
		for(var i=0 ; i<this._deep ; i++){
			indentation += '    ';
		}
		return indentation;
	};
};
DebugVisitor.prototype = new MbaVisitor();
DebugVisitor.prototype.constructor = DebugVisitor;

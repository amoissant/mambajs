function TestNodeVisitor(test){
    
    this._test;
    this._stack;
    this._success;
    
    TestNodeVisitor.prototype.init = function(test){
        this._test = test;
        this._stack= [];
        this._success = true;
    };   
    
    TestNodeVisitor.prototype.beforeVisitNode = function(node){
        checkType(node, MbaNode);
        var currTest;
        if(node instanceof MbaRootNode)
            currTest = this._test;
        else
            currTest = this.getCurrentTest().children[node.getPositionInParent()];
                    
        this._stack.push(currTest);
        this.checkNode(node);
    };
    
    TestNodeVisitor.prototype.afterVisitNode = function(node){
        checkType(node, MbaNode);
        this._stack.pop();
    };
    
    TestNodeVisitor.prototype.getCurrentTest = function(){
        return this._stack[this._stack.length-1];
    };    
    
    TestNodeVisitor.prototype.checkNode = function(node){
        checkType(node, MbaNode);
        var currTest = this.getCurrentTest();
        if(!(node instanceof currTest.type)){
            console.log(node, ' is not an instance of ', currTest.type);
            this._success = false;
        }
        var nbChildren = 0;
        if(currTest.children)
            nbChildren = currTest.children.length;
        var nodeNbChildren = node.getChildren().length;
        if(nodeNbChildren != nbChildren){
            console.log('Expected '+nbChildren+' children for', node, ', received '+nodeNbChildren);
            this._success = false;
        }
        if(!currTest.dom.equals(node.getBaseDom())){
            console.log('Base dom are different, expected ', currTest.dom, ', received ', node.getBaseDom());
            this._success = false;
        }            
    };
    
    TestNodeVisitor.prototype.testSucceed = function(){
     return this._success;   
    };
    
    if(arguments.length != 0)
        this.init(test);
}
TestNodeVisitor.prototype = new MbaNodeVisitor();
TestNodeVisitor.prototype.constructor = TestNodeVisitor();
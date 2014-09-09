function MbaRefreshMethodGenerator(mbaTemplate, superModel){
    
    this._mbaTemplate;
    
    if(arguments.length > 0)
        this.init(mbaTemplate, superModel);
}
MbaRefreshMethodGenerator.prototype = new MbaModelExplorer();
MbaRefreshMethodGenerator.prototype.constructor = MbaRefreshMethodGenerator;

MbaRefreshMethodGenerator.prototype.init = function(mbaTemplate, superModel){
    checkType(mbaTemplate, MbaTemplate);
    this._mbaTemplate = mbaTemplate;
    var accessorTree = this.constructAccessorTree();
    MbaModelExplorer.prototype.init.call(this, accessorTree, superModel);
};

MbaRefreshMethodGenerator.prototype.constructAccessorTree = function(){
    var visitor = new GetNodesAndAccessorsVisitor(); 
    this._mbaTemplate.getRootNode().accept(visitor); 
    visitor.constructAccessorNodes();
    console.log(visitor.getRootAccessorNode());
    return visitor.getRootAccessorNode();
};

MbaRefreshMethodGenerator.prototype.beforeVisitModel = function(model){
    var mbaTemplate = this._mbaTemplate;
    var route = this.getCurrentRoute();
    var nodes = this.getCurrentMbaNodes();
    //TODO : si dans les nodes il y a le rootNode alors ne garder que celui-ci sinon plusieurs rafraichissements
    model.refresh = 
        function(){
            mbaTemplate.refreshNodesForRoute(nodes, route);
        };
};

MbaRefreshMethodGenerator.prototype.generateMethods = function(){
    this.walkThroughAccessorTree();
};

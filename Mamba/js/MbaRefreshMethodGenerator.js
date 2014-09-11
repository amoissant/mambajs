function MbaRefreshMethodGenerator(mbaTemplate){
    
    this._mbaTemplate;
    
    if(arguments.length > 0)
        this.init(mbaTemplate);
}
MbaRefreshMethodGenerator.prototype = new MbaModelExplorer();
MbaRefreshMethodGenerator.prototype.constructor = MbaRefreshMethodGenerator;

MbaRefreshMethodGenerator.prototype.init = function(mbaTemplate){
    checkType(mbaTemplate, MbaTemplate);
    this._mbaTemplate = mbaTemplate;
    MbaModelExplorer.prototype.init.call(this, this._mbaTemplate);
};

MbaRefreshMethodGenerator.prototype.beforeVisitModel = function(model){
    var mbaTemplate = this._mbaTemplate;
    var route = this.getCurrentRoute();
    var nodes = this.getCurrentMbaNodes();
    //TODO : si dans les nodes il y a le rootNode alors ne garder que celui-ci sinon plusieurs rafraichissements
    // de manière générale ne garder que le noeud parent
    model.refresh = 
        function(){
            var modelFinder = new MbaModelFinder(mbaTemplate, model);
            mbaTemplate.checkModelBelongsSuperModel(modelFinder);
            mbaTemplate.refreshNodesForRoute(nodes, route);
        };
    return true;
};

MbaRefreshMethodGenerator.prototype.generateMethods = function(){
    this.walkThroughAccessorTree();
};

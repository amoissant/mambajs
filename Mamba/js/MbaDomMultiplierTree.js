function MbaDomMultiplierTree(){    
}

MbaDomMultiplierTree.prototype = new MbaDomMultiplierBaseNode();
MbaDomMultiplierTree.prototype.constructor = MbaDomMultiplierTree;

MbaDomMultiplierTree.prototype.initAllRelativeAccessors = function(){
    for(var i=0 ; i<this._childNodes.length ; i++){
        this._childNodes[i].initRelativeAccessor(1);
    }
};

MbaDomMultiplierTree.prototype.linkToTemplate = function(template){
    checkType(template, MbaTemplate2);
    for(var i=0 ; i<this._childNodes.length ; i++){
        this._childNodes[i].linkToTemplate(template);
    }
};

MbaDomMultiplierTree.prototype.renderForModel = function(model){
    this.renderForOneModel(model, []);
};

MbaDomMultiplierTree.prototype.renderForOneModel = function(model, route){
    checkType(route, 'array', 'string');
    for(var i=0 ; i<this._childNodes.length ; i++){
        this._childNodes[i].renderForModelWithRoute(model, route);
    }
};
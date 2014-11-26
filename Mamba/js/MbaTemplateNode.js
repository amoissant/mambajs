function MbaTemplateNode(){
    this._domElement;
    this._parent;
}
MbaTemplateNode.prototype = new MbaTemplateBaseNode();
MbaTemplateNode.prototype.constructor = MbaTemplateNode;

MbaTemplateNode.prototype.init = function(parent, domElement){
    checkType(parent, MbaTemplateBaseNode);
    checkType(domElement, 'dom');
    MbaTemplateBaseNode.prototype.init.call(this);
    this._parent = parent;
    this._domElement = domElement;
    return this;
};

MbaTemplateNode.prototype.getId = function(){
    return this._domElement._mbaId;
};
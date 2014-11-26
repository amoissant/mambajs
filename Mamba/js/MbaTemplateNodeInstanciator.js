function MbaTemplateNodeInstanciator(){
    this._multipliableDomElmentsIds;
}

MbaTemplateNodeInstanciator.prototype.init = function(multipliableDomElmentsIds){
    checkType(multipliableDomElmentsIds, 'array', 'number');
    this._multipliableDomElmentsIds = multipliableDomElmentsIds;
    return this;
};

MbaTemplateNodeInstanciator.prototype.instanciateTemplateNode = function(domElmentId){
    checkType(domElmentId, 'number');
    if(this.isMultipliableElement(domElmentId))
        return new MbaTemplateNodeMultipliable();
    else
        return new MbaTemplateNode();
};

MbaTemplateNodeInstanciator.prototype.isMultipliableElement = function(domElementId){
    checkType(domElementId, 'number');
    return this._multipliableDomElmentsIds.indexOf(domElementId) != -1;
};
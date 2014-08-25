function MbaTextTransf(){

    this.init();
}
MbaTextTransf.prototype = new MbaTransf();
MbaTextTransf.prototype.constructor = MbaTextTransf;

MbaTextTransf.prototype.createEventConnector = function(domElement, event, eventHandler){
    return new EventConnectorTextNode(domElement, event, eventHandler);
};

MbaTextTransf.prototype.updateDomWithModel = function(domElement, newValue, oldValue){
    checkType(domElement, 'dom');
    checkArgNb(arguments, 3);
    domElement.textContent = newValue;
};

MbaTextTransf.prototype.readValueFromDom = function(domElement, oldValue){
    checkType(domElement, 'dom');
    checkArgNb(arguments, 2);
    return domElement.textContent;
};

MbaTextTransf.prototype.referenceModelIntoDom = function(dom){
    checkType(dom, MbaDom);
    dom.referenceModelIntoParent(this.getLastModel());
};
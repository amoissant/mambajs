function MbaDomSingle(domElement){
    this._domElement;
    
    if(arguments.length > 0)
        this.init(domElement);
}
MbaDomSingle.prototype = new MbaDom();
MbaDomSingle.prototype.constructor = MbaDomSingle;

MbaDomSingle.prototype.init = function(domElement){
    checkType(domElement, 'domElement');
    if(!isDomElement(domElement)){//TODO assert
        var errorMessage = 'domElement must be a dom element.';
        console.log('ERROR : '+errorMessage, domElement);
        //throw new Error(errorMessage);
    }
        
    this._domElement = domElement;
};

MbaDomSingle.prototype.getElement = function(){
    return this._domElement;
};

MbaDomSingle.prototype.getElements = function(){
    return [this._domElement];
};

MbaDomSingle.prototype.hasParent = function(){
    return this._domElement.parentElement != null;
};

MbaDomSingle.prototype.hasParent = function(){
    return this._domElement.parentElement != null;
};

MbaDomSingle.prototype.getParent = function(){
    return this._domElement.parentElement;
};

MbaDomSingle.prototype.getMbaNode = function(){
    return this._domElement.mbaNode;
};

MbaDomSingle.prototype.getLength = function(){//TODO peut etre que l'on peut éviter d'appeler cette méthode pour les MbaDOmSingle
    return 1;
};

MbaDomSingle.prototype.positionInParent = function(){
    if(this.hasParent()){
        var position = -1;
        var siblings = this.getParent().childNodes;
        for(var i=0 ; i<siblings.length ; i++){
            if(siblings[i] == this._domElement){
                position = i;
                break;
            }
        }    
        return position;
    }
    else
        throw new Error('MbaDomSingle.getPositionInParent is only applicable if a parent element exists.');
};

MbaDomSingle.prototype.removeFromParent = function(){
    this.getParent().removeChild(this._domElement);
};

MbaDomSingle.prototype.insertAtIndex = function(dom, index){
    checkType(dom, MbaDom);
    if(dom instanceof MbaDomSingle){
        this.insertOneElementAtIndex(dom.getElement(), index);
    }
    else{
        var elements = dom.getElements();
        for(var i=0 ; i<elements.length ; i++){
            this.insertOneElementAtIndex(elements[i], index);
            index++;
        }
    }
        
};

MbaDomSingle.prototype.insertOneElementAtIndex = function(element, index){
    checkType(element, 'domElement');
    checkType(index, 'number');
    if(this._domElement.childNodes.length <= index)
        this._domElement.appendChild(element);
    else
        this._domElement.insertBefore(element, this._domElement.childNodes[index]);
};

MbaDomSingle.prototype.append = function(dom){
    checkType(dom, MbaDom);
    if(dom instanceof MbaDomSingle){
        this._domElement.appendChild(dom.getElement());
    }
    else{
        var elements = dom.getElements();
        for(var i=0 ; i<elements.length ; i++){
            this._domElement.appendChild(elements[i]);
        }
    }
};

MbaDomSingle.prototype.toString = function(){
    return this._domElement.outerHTML;
};

MbaDomSingle.prototype.cloneWithoutChildren = function(){
    var clonedElement = this._domElement.cloneNode(false);
    return new MbaDomSingle(clonedElement);
};

MbaDomSingle.prototype.referenceModel = function(model){
    this._domElement._mbaModel = model;//TODO mbaNode et _mbaModel ? à uniformiser
};

MbaDomSingle.prototype.referenceModelIntoParent = function(model){
    var parent = this._domElement.parentElement;
    parent._mbaModel = model;
};

//TODO factoriser code avec append et insertAtIndex ci-dessus
/*
MbaDomSingle.prototype.insertChildAtIndex2 = function(dom, index){
    checkType(dom, MbaDom);
    checkType(index, 'number');

    this.insertAtIndex(dom, --index);
};
*/



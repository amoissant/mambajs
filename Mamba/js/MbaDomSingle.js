function MbaDomSingle(domElement){
    this._domElement;
    
    if(arguments.length > 0)
        this.init(domElement);
}
MbaDomSingle.prototype = new MbaDom2();
MbaDomSingle.prototype.constructor = MbaDomSingle;

MbaDomSingle.prototype.init = function(domElement){
    checkType(domElement, 'domElement');
    this._domElement= domElement;
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
    checkType(dom, MbaDom2);
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
    checkType(dom, MbaDom2);
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


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
    var position = -1;
    if(this.hasParent()){
        var siblings = this.getParent().childNodes;
        for(var i=0 ; i<siblings.length ; i++){
            if(siblings[i] == this._domElement){
                position = i;
                break;
            }
        }    
    }
    return position;
};

MbaDomSingle.prototype.removeFromParent = function(){
    this.getParent().removeChild(this._domElement);
};

MbaDomSingle.prototype.insertAtIndex = function(dom, index){
    checkType(dom, MbaDom2);
    if(dom instanceof MbaDomSingle){
        if(this._domElement.childNodes.length <= index)
            this._domElement.appendChild(dom.getElement());
        else
            this._domElement.insertBefore(elements[i], dom.getElement());
    }
    else{
        var elements = dom.getElements();
        for(var i=0 ; i<elements.length ; i++){
            if(this._domElement.childNodes.length <= index)
                this._domElement.appendChild(elements[i]);
            else
                this._domElement.insertBefore(elements[i], this._domElement.childNodes[index]);
            index++;
        }
    }
        
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

//TODO remplacer utils.domToString par cette fonction
MbaDomSingle.prototype.toString = function(){
    return this._domElement.outerHTML;
};


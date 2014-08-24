function MbaDom(dom){
    
    if(arguments.length > 0)
        this.init(dom);
}

MbaDom.prototype.init = function(dom){
    checkIsDomSet(dom);
    this._dom = dom;
    //TODO transformer en assert
    if(!this.childrenHaveSameParent()){
        var errorMessage = 'All the dom elements must have the same parent.';
        console.log('ERROR : '+errorMessage);
        //throw new Error(errorMessage);
    }
    if(this.isEmpty()){
        var errorMessage = 'The provided dom element array must not be empty.';
        console.log('ERROR : '+errorMessage);
        //throw new Error(errorMessage);
    }
    
    //todo check enfant on des positions consécutives dans le parent !
    //todo il faudrait peut être faire cette vérification qui doit être couteuse seulement avant le premier render pour valider le template et les directives ?
}

MbaDom.prototype.getElements = function(){//ok
    return this._dom;
};

//TODO une fois cette fonction mise remplacer les getElement(0) par des getElement() mais d'un MbaDomSingle
MbaDom.prototype.getElement = function(index){//ok
    return this._dom[index];
};

MbaDom.prototype.getParent = function(){//ok
    if(this.isEmpty())
        return null;
    else
        return this._dom[0].parentElement;
};

MbaDom.prototype.isEmpty = function(){//ok
    return this._dom.length == 0;
};


MbaDom.prototype.getLength = function(){//ok
    return this._dom.length;
};

MbaDom.prototype.getMbaNodes = function(){//ok
    if(this.isEmpty())
        throw new MbaError(0, "getMbaNodes is not applicable if dom is empty.")//TODO assert
    var mbaNodes = [];
    for(var i=0 ; i<this._dom.length ; i++){
        mbaNodes.push(this._dom[i].mbaNode);
    }
    return mbaNodes;
};

MbaDom.prototype.toString = function(){//ok
    var stringRepresentations = [];
    for(var i=0 ; i<this._dom.length ; i++){
        stringRepresentations.push(this._dom[i].outerHTML);
    }
    return stringRepresentations.join('');
};


MbaDom.prototype.getId = function(){//ok
    var ids= [];
    for(var i=0 ; i<this._dom.length ; i++){
        ids.push(this._dom[i]._mbaId);
    }

    ids.sort(function(a, b){return a-b;});
    var formattedId = '';
    for(var i=0 ; i<ids.length ; i++){
        formattedId += ids[i]+'-';
    }

    return formattedId.substr(0, formattedId.length-1);
};

MbaDom.prototype.hasMbaId = function(){//ok
    return this._dom.length > 0 && this._dom[0] != null && this._dom[0]._mbaId != null;
};

MbaDom.prototype.addMbaId = function(){//ok
    this.addMbaIdWithStartValue(this._dom, 0);
};

MbaDom.prototype.addMbaIdWithStartValue = function(arrayDom, id){//ok
    for(var i=0 ; i<arrayDom.length ; i++){
        var currElement = arrayDom[i];
        currElement._mbaId = id++;
        id = this.addMbaIdWithStartValue(currElement.childNodes, id);			
    }
    return id;
};

MbaDom.prototype.select = function(selector){//ok
    var parent = this.getParent();
    var hadNotAParent = parent == null;
    if(hadNotAParent)
        parent = this.addParentForSelect();
    var foundElements = parent.querySelectorAll(selector); 
    if(hadNotAParent)
        this.removeParentForSelect(parent);         
    return foundElements;
};

MbaDom.prototype.selectOneMax = function(selector){//ok
    var foundElements = this.select(selector);//TODO écrire méthode directe sans passer par un tableau si on gagne en perf
    if(foundElements.length > 1)
        throw new Error('Maximum one one element expected.');
    return foundElements.length == 1 ? foundElements[0] : null;
};

MbaDom.prototype.addParentForSelect = function(){//ok
    var parent = document.createElement('div');
    for(var i=0 ; i<this._dom.length ; i++){
        parent.appendChild(this._dom[i]);
    }
    return parent;
};

MbaDom.prototype.removeParentForSelect = function(parent){//ok
    checkType(parent, 'domElement');
    for(var i=0 ; i<this._dom.length ; i++){
        parent.removeChild(this._dom[i]);
    }            
};

MbaDom.prototype.find = function(selector){//ok
    checkType(selector, 'string');
    var foundDom = this.select(selector);
    if(foundDom.length == 0)
        return new MbaDomEmpty();
    else
        return new MbaDom(foundDom);
};

MbaDom.prototype.findOneMax = function(selector){//ok
    checkType(selector, 'string');
    var foundDom = this.select(selector);
    if(foundDom.length != 1)
        throw new Error('Didn\'t found one and only one element.');
    return new MbaDomSingle(foundDom[0]);
};

MbaDom.prototype.containsElement = function(element){//ok
    for(var i=0 ; i<this._dom.length ; i++){
        var currElement = this._dom[i];
        if(currElement == element)
            return true;
    }
    return false;
};

MbaDom.prototype.equals = function(other){
    checkType(other, MbaDom);
    if(this.getLength() != other.getLength())
        return false;

    for(var i=0 ; i <other.getLength() ; i++){
        if(!this.containsElement(other.getElement(i)))
            return false;
    }
    return true;
};

/********************************************fonctions de mofication du dom*******************************************/

MbaDom.prototype.add = function (dom){//ok
    checkType(dom, MbaDom);
    var elementsToAdd = dom.getElements();
    for(var i=0 ; i<elementsToAdd.length ; i++){
        this._dom.push(elementsToAdd[i]);
    }
};

MbaDom.prototype.remove = function(dom){//ok
    checkType(dom, MbaDom);

    var elements = dom.getElements();
    this._dom.splice(this._dom.indexOf(dom), 1);
};


MbaDom.prototype.appendChild = function(dom){
    checkType(dom, MbaDom);

    if(this.getLength() != 1){
        throw new Error('the \'append\' method is only allowed on MbaDom representing one dom element.');
    }
    else{
        for(var i=0 ; i<dom.getLength() ; i++){
            var currElement = dom.getElement(i);
            this.getElement(0).appendChild(currElement);
        }
    }
};

MbaDom.prototype.removeChild = function(dom){
    checkType(dom, MbaDom);

    if(this.getLength() != 1){
        throw new Error('the \'remove\' method is only allowed on MbaDom representing one dom element.');
    }
    else{
        for(var i=0 ; i<dom.getLength() ; i++){
            var currElement = dom.getElement(i);
            try{
                this.getElement(0).removeChild(currElement);
            }catch(e){
                console.log('toto');
            }
        }
    }
};


//TODO mettre au propre avec une classe dédié aux éléments de dom unique
MbaDom.prototype.referenceModelIntoParent = function(model){
    var parent = this.getElement(0).parentElement;
    parent._mbaModel = model;
};

MbaDom.prototype.referenceModel = function(model){
    var dom = this.getElements();
    //TODO optimiser pour las avec un seul element et raison de plus pour avoir une classe représentant un seul elément de dom
    for(var i=0 ; i<dom.length ; i++){
        dom[i]._mbaModel = model;   
    }
};





/***************************************************************************************************************/





MbaDom.prototype.childrenHaveSameParent = function(){
    if(!this.isEmpty()){
        var firstParent = this._dom[0].parentElement;
        for(var i=1 ; i<this._dom.length ; i++){
            if(this._dom[i].parentElement != firstParent)
                return false;
        }    
    }
    return true;
};

MbaDom.prototype.positionInParent = function(){
    var minPosition = this.getParent().childNodes.length;
    for(var i=0 ; i<this._dom.length ; i++){
        var currPosition = this.positionInParentOfNthElement(i);
        if(currPosition < minPosition)
            minPosition = currPosition;
    }
    return minPosition;
};

//TODO factoriser code
MbaDom.prototype.positionInParentOfNthElement = function(nth){
    var position = -1;
    var siblings = this.getParent().childNodes;
    for(var i=0 ; i<siblings.length ; i++){
        if(siblings[i] == this._dom[nth]){
            position = i;
            break;
        }
    }    
    return position;
};

MbaDom.prototype.removeFromParent = function(){
    var parent = this.getParent();
    for(var i=0 ; i<this._dom.length ; i++){
        parent.removeChild(this._dom[i]);
    }
};

MbaDom.prototype.hasChildren = function(){
    for(var i=0 ; i<this._dom.length; i++){
        if(this._dom[i].childNodes.length > 0)
            return true;
    }
    return false;
};

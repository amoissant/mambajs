function MbaDom(dom){
    
    if(arguments.length > 0)
        this.init(dom);
}

MbaDom.prototype.init = function(dom){
    checkIsDomSet(dom);
    this._dom = dom;
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
};

MbaDom.prototype.getDom = function(index){
    if(index != null){
        checkType(index, 'number');
        return this._dom[index];
    }
    else
        return this._dom;
};

MbaDom.prototype.getChildren = function(){
    var childrenElements = [];
    for(var i=0 ; i< this._dom.length ; i++){
        var currElement = this._dom[i];
        for(var j=0 ; j<currElement.childNodes.length ; j++){
            childrenElements.push(currElement.childNodes[j]);
        }
    }
    return new MbaDom(childrenElements);
}

MbaDom.prototype.getMbaNode = function(){
    if(this.isEmpty() || this._dom.length > 1) 
        throw new MbaError(0, "getMbaNode is only applicable for MbaDom representing one and only one dom element.");
    return this._dom[0].mbaNode;
};

MbaDom.prototype.getMbaNodes = function(){
    if(this.isEmpty())
        throw new MbaError(0, "getMbaNodes is not applicable if dom is empty.")
    var mbaNodes = [];
    for(var i=0 ; i<this._dom.length ; i++){
        mbaNodes.push(this._dom[i].mbaNode);
    }
    return mbaNodes;
};

MbaDom.prototype.toString = function(){
    var stringRepresentations = [];
    for(var i=0 ; i<this._dom.length ; i++){
        stringRepresentations.push(this._dom[i].outerHTML);
    }
    return stringRepresentations.join('');
};

MbaDom.prototype.cloneWithoutChildren = function(){
    var clonedDom = []; 
    for(var i=0 ; i<this._dom.length; i++){
        var currElement = this._dom[i];
        clonedDom.push(currElement.cloneNode(false));
    }
    return new MbaDom(clonedDom);
}    

MbaDom.prototype.select = function(selector){
    return findInTemplate(this._dom, selector);
};

MbaDom.prototype.selectUnique = function(selector){
    var foundElements = findInTemplate(this._dom, selector);//TODO écrire méthode directe sans passer par un tableau
    if(foundElements.length != 1)
        throw new Error('One and only one element expected.');
    return foundElements[0];
};

MbaDom.prototype.selectOneMax = function(selector){
    var foundElements = findInTemplate(this._dom, selector);//TODO écrire méthode directe sans passer par un tableau
    if(foundElements.length > 1)
        throw new Error('Maximum one one element expected.');
    return foundElements.length == 1 ? foundElements[0] : null;
};


MbaDom.prototype.find = function(selector){
    checkType(selector, 'string');
    var foundDom = findInTemplate(this._dom, selector);
    if(foundDom.length == 0)
        return new MbaDomEmpty();
    else
        return new MbaDom(foundDom);
};

MbaDom.prototype.add = function (dom){
    checkType(dom, MbaDom);

    this._dom = this._dom.concat(dom.getDom());
};

MbaDom.prototype.isEmpty = function(){
    return this._dom.length == 0;
};

//TODO à supprimer si non utilisé
MbaDom.prototype.getId = function(){
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

MbaDom.prototype.hasMbaId = function(){
    return this._dom.length > 0 && this._dom[0] != null && this._dom[0]._mbaId != null;
};

MbaDom.prototype.addMbaId = function(){
    this.addMbaIdWithStartValue(this._dom, 0);
};

MbaDom.prototype.addMbaIdWithStartValue = function(arrayDom, id){
    for(var i=0 ; i<arrayDom.length ; i++){
        var currElement = arrayDom[i];
        currElement._mbaId = id++;
        id = this.addMbaIdWithStartValue(currElement.childNodes, id);			
    }
    return id;
}		

MbaDom.prototype.remove = function(dom){
    checkType(dom, MbaDom);

    var elements = dom.getDom();
    this._dom.splice(this._dom.indexOf(dom), 1);
}

MbaDom.prototype.getLength = function(){
    return this._dom.length;
}

MbaDom.prototype.containsElement = function(element){
    for(var i=0 ; i<this._dom.length ; i++){
        var currElement = this._dom[i];
        if(currElement == element)
            return true;
    }
    return false;
}

MbaDom.prototype.appendChild = function(dom){
    checkType(dom, MbaDom);

    if(this.getLength() != 1){
        throw new Error('the \'append\' method is only allowed on MbaDom representing one dom element.');
    }
    else{
        for(var i=0 ; i<dom.getLength() ; i++){
            var currElement = dom.getDom(i);
            this.getDom(0).appendChild(currElement);
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
            var currElement = dom.getDom(i);
            try{
                this.getDom(0).removeChild(currElement);
            }catch(e){
                console.log('toto');
            }
        }
    }
};

MbaDom.prototype.insertChildAtIndex2 = function(dom, index){
    checkType(dom, MbaDom);
    checkType(index, 'number');

    index--;//because we want to insert before element at 'index'

    if(this.getLength() == 1){
        var domElement = this.getDom(0);
        if(index > domElement.childNodes.length)
            throw new Error('Can\'t insert an element after the last one.');

        var childAfter = domElement.childNodes[index];
        for (var i = dom.getLength() - 1; i >= 0; i--) {
            var currChildElement = dom.getDom(i);
            if (domElement.hasChildNodes()) {
                domElement.insertBefore(currChildElement, childAfter);
            } else {
                domElement.appendChild(currChildElement);
            }
            childAfter = currChildElement;
        }
    }
    else
        throw new Error('the \'insertChildAtIndex\' method is only allowed on MbaDom representing one dom element.');
};

MbaDom.prototype.equals = function(other){
    checkType(other, MbaDom);
    if(this.getLength() != other.getLength())
        return false;

    for(var i=0 ; i <other.getLength() ; i++){
        if(!this.containsElement(other.getDom(i)))
            return false;
    }
    return true;
}

//TODO mettre au propre avec une classe dédié aux éléments de dom unique
MbaDom.prototype.referenceModelIntoParent = function(model){
    var parent = this.getDom(0).parentElement;
    parent._mbaModel = model;
};

MbaDom.prototype.referenceModel = function(model){
    var dom = this.getDom();
    //TODO optimiser pour las avec un seul element et raison de plus pour avoir une classe représentant un seul elément de dom
    for(var i=0 ; i<dom.length ; i++){
        dom[i]._mbaModel = model;   
    }
};





/***************************************************************************************************************/





MbaDom.prototype.getElements = function(){
    return this._dom;
};

MbaDom.prototype.getParent = function(){
    if(this.isEmpty())
        return null;
    else
        return this._dom[0].parentElement;
};

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

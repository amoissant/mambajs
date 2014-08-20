function MbaDom(dom){
    
    if(arguments.length > 0)
        this.init(dom);
}

MbaDom.prototype.init = function (dom){
    //checkIsDomSet(dom);//TODO à remettre
    this.dom = dom;
};

MbaDom.prototype.getDom = function(index){
    if(index != null){
        checkType(index, 'number');
        return this.dom[index];
    }
    else
        return this.dom;
};

MbaDom.prototype.getChildren = function(){
    var childrenElements = [];
    for(var i=0 ; i< this.dom.length ; i++){
        var currElement = this.dom[i];
        for(var j=0 ; j<currElement.childNodes.length ; j++){
            childrenElements.push(currElement.childNodes[j]);
        }
    }
    return new MbaDom(childrenElements);
}

MbaDom.prototype.getMbaNode = function(){
    if(this.isEmpty() || this.dom.length > 1) 
        throw new MbaError(0, "getMbaNode is only applicable for MbaDom representing one and only one dom element.");
    return this.dom[0].mbaNode;
};

MbaDom.prototype.getMbaNodes = function(){
    if(this.isEmpty())
        throw new MbaError(0, "getMbaNodes is not applicable if dom is empty.")
    var mbaNodes = [];
    for(var i=0 ; i<this.dom.length ; i++){
        mbaNodes.push(this.dom[i].mbaNode);
    }
    return mbaNodes;
};

MbaDom.prototype.toString = function(){
    var stringRepresentations = [];
    for(var i=0 ; i<this.dom.length ; i++){
        stringRepresentations.push(this.dom[i].outerHTML);
    }
    return stringRepresentations.join('');
};

MbaDom.prototype.cloneWithoutChildren = function(){
    var clonedDom = []; 
    for(var i=0 ; i<this.dom.length; i++){
        var currElement = this.dom[i];
        clonedDom.push(currElement.cloneNode(false));
    }
    return new MbaDom(clonedDom);
}    

MbaDom.prototype.find = function(selector){
    checkType(selector, 'string');
    return new MbaDom(findInTemplate(this.dom, selector));
};

MbaDom.prototype.add = function (dom){
    checkType(dom, MbaDom);

    this.dom = this.dom.concat(dom.getDom());
};

MbaDom.prototype.isEmpty = function(){
    return this.dom.length == 0;
};

MbaDom.prototype.getId = function(){
    var ids= [];
    for(var i=0 ; i<this.dom.length ; i++){
        ids.push(this.dom[i]._mbaId);
    }

    ids.sort(function(a, b){return a-b;});
    var formattedId = '';
    for(var i=0 ; i<ids.length ; i++){
        formattedId += ids[i]+'-';
    }

    return formattedId.substr(0, formattedId.length-1);
};

MbaDom.prototype.hasMbaId = function(){
    return this.dom.length > 0 && this.dom[0] != null && this.dom[0]._mbaId != null;
};

MbaDom.prototype.addMbaId = function(){
    this.addMbaIdWithStartValue(this.dom, 0);
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
    this.dom.splice(this.dom.indexOf(dom), 1);
}

MbaDom.prototype.getLength = function(){
    return this.dom.length;
}

MbaDom.prototype.containsElement = function(element){
    for(var i=0 ; i<this.dom.length ; i++){
        var currElement = this.dom[i];
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


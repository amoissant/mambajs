function MbaDom(dom){
	if(dom == null)
		dom = [];
	if(!(typeof dom == 'string' || isDom(dom) || isEmptyArray(dom) || (dom instanceof NodeList)))
		console.log('ERREUR : "dom" doit être une chaîne représentant un dom, '
		            +'un élément de dom ou un tableau d\'éléments de dom.');
	
	if(!isEmptyArray(dom))
		this.dom = $(dom).get();
	else
		this.dom = [];
	
	this.getDom = function(index){
		if(index != null){
			checkType(index, 'number');
			return this.dom[index];
		}
		else
			return this.dom;
	};
    
    this.getChildren = function(){
        var childrenElements = [];
        for(var i=0 ; i< this.dom.length ; i++){
            var currElement = this.dom[i];
            for(var j=0 ; j<currElement.childNodes.length ; j++){
                childrenElements.push(currElement.childNodes[j]);
            }
        }
        return new MbaDom(childrenElements);
    }
    
    this.getMbaNode = function(){
        if(this.isEmpty() || this.dom.length > 1) 
            throw new MbaError(0, "getMbaNode is only applicable for MbaDom representing one and only one dom element.");
        return this.dom[0].mbaNode;
    };
	
    this.getMbaNodes = function(){
        if(this.isEmpty())
            throw new MbaError(0, "getMbaNodes is not applicable if dom is empty.")
        var mbaNodes = [];
        for(var i=0 ; i<this.dom.length ; i++){
            mbaNodes.push(this.dom[i].mbaNode);
        }
        return mbaNodes;
    };
    
	this.toString = function(){
		return domToString(this.dom);
	};
	
	this.clone = function(){
		return new MbaDom(this.toString());
	};
	
	this.clone2 = function(){
		var clonedDom = []; 
		for(var i=0 ; i<this.dom.length; i++){
			var currElement = this.dom[i];
			clonedDom.push(currElement.cloneNode(true));
		}
		return new MbaDom(clonedDom);
	};
    
    this.cloneWithoutChildren = function(){
        var clonedDom = []; 
		for(var i=0 ; i<this.dom.length; i++){
			var currElement = this.dom[i];
			clonedDom.push(currElement.cloneNode(false));
		}
		return new MbaDom(clonedDom);
    }
		
	this.find = function(selector){
		checkType(selector, 'string');
		
		return new MbaDom(findInTemplate(this.dom, selector));
	};
    
    this.find2 = function(selector){
		checkType(selector, 'string');
		return new MbaDom(findInTemplate2(this.dom, selector));
	};

	this.replace = function(element, replacement){
		checkType(element, MbaDom);
		checkType(replacement, MbaDom);
		
		var res = replaceInTemplate(this.dom, element.getDom(), replacement.getDom());
		
		this.dom = res;
	};

	this.belongAnotherDom = function(){
		if(this.dom.length > 0 && this.dom[0].parentElement != null)
			return true;
		return false;
	};
	
	this.add = function (dom){
		checkType(dom, MbaDom);
		
		this.dom = this.dom.concat(dom.getDom());
	};
	
	this.concat = function (dom){
		checkType(dom, MbaDom);
		
		if(this.belongAnotherDom())
			$(dom.getDom()).insertAfter(this.dom[this.dom.length-1]);
		
		this.add(dom);
	};
	
	this.keepNthFirst = function (nth){
		checkType(nth, 'number');
		
		var domToRemove = _.last(this.dom, this.dom.length-nth);
		this.dom = _.difference(this.dom, domToRemove);
		
		if(this.belongAnotherDom()){
			this._removeFromDom(domToRemove);
		}
	};
	
	this.isEmpty = function(){
		return this.dom.length == 0;
	};
	
	this.getId = function(){
		var ids= [];
		for(var i=0 ; i<this.dom.length ; i++){
			ids.push(this.dom[i]._mbaId);
		}
		
		ids = _.sortBy(ids, function(num){return num;});
		var formattedId = '';
		for(var i=0 ; i<ids.length ; i++){
			formattedId += ids[i]+'-';
		}
		
		return formattedId.substr(0, formattedId.length-1);
	};

	this.hasMbaId = function(){
		return this.dom.length > 0 && this.dom[0] != null && this.dom[0]._mbaId != null;
	};
	
	this.addMbaId = function(){
		this.addMbaIdWithStartValue(this.dom, 0);
	};
	
	this.addMbaIdWithStartValue = function(arrayDom, id){
		for(var i=0 ; i<arrayDom.length ; i++){
			var currElement = arrayDom[i];
			currElement._mbaId = id++;
			id = this.addMbaIdWithStartValue(currElement.childNodes, id);			
		}
		return id;
	}
	
	this.containsParentAndChild = function(){
		var dom = this.getDom();
		
		if(dom.length > 1){
			for(var i=0 ; i<dom.length ; i++){
				var currDom = dom[i];
				currDom.deep = getDeep(currDom);
			}
			
			var sortedByDeepDom = _.sortBy(dom, function(dom){
				return -dom.deep;
			});
			
			for(var i=0 ; i<sortedByDeepDom.length ;i++){
				var currDom = sortedByDeepDom[i];
				var possibleParents = _.rest(sortedByDeepDom, i+1);
				for(var j=0 ; j<possibleParents.length ; j++){
					var currPossibleParent = possibleParents[j];
					if($(currPossibleParent).is($(currDom).parents()))
						return true;
				}
			}
		}
			return false;
	};


	//TODO : factoriser code entre removeChildren et removeParents
	this.removeChildren = function(){
		var children = [];
		
		for(var i=0 ; i<this.dom.length ; i++){
			var first = this.dom[i];
			for(var j=0 ; j<this.dom.length ; j++){
				var second = this.dom[j];
				if(firstIsChildOfSecond(first, second))
					children.push(first);
			}
		}
		var parentsWithoutChildren = _.difference(this.dom, children);
		return new MbaDom(parentsWithoutChildren);
	};
	
	//TODO : comment faire si un element est child et parent ? (template avec deux niveaux de récursion définie ?)
	//écrire un controle pour cela ?
	this.removeParents = function(){
		var parents = [];
		
		for(var i=0 ; i<this.dom.length ; i++){
			var first = this.dom[i];
			for(var j=0 ; j<this.dom.length ; j++){
				var second = this.dom[j];
				if(firstIsChildOfSecond(first, second))
					parents.push(second);
			}
		}
		var childrenWithoutParents = _.difference(this.dom, parents);
		return new MbaDom(childrenWithoutParents);
	};
	
	this._removeFromDom = function(domToRemove){
		checkType(domToRemove, 'array', 'object');
		
		var parent = domToRemove[0].parentElement;
		for(var i=0 ; i<domToRemove.length ; i++){
			var currDomToRemove = domToRemove[i];
			parent.removeChild(currDomToRemove);	
		}
	};
	
	this.removeFromDom = function(){
		this._removeFromDom(this.dom);
	}
	
	this.insertAtIndex = function(dom, index){
		checkType(dom, MbaDom);
		checkType(index, 'number');
		
		if(this.belongAnotherDom()){
			var parentElement = this.dom[0].parentElement;
			
			if(index == 0)
				$(parentElement).prepend(dom.getDom());
			else
				$(parentElement).children(':nth-child('+index+')').after(dom.getDom());				
		}

		var domToInsert = dom.getDom();
		var domToInsertLength = domToInsert.length;
		var newDom = [];
		for ( var i = 0; i < index; i++) {
			newDom[i] = this.dom[i];
		}

		for ( var i = index; i < domToInsertLength; i++) {
			newDom[i] = domToInsert[i];
		}

		for ( var i = index + domToInsertLength; i < this.dom.length
				+ domToInsertLength; i++) {
			newDom[i] = this.dom[i - domToInsertLength];
		}

		this.dom = newDom;
	};
	
	this.insertAtIndex2 = function(dom, index){
		checkType(dom, MbaDom);
		checkType(index, 'number');

		//TODO : ceci enlève un bug ou deux...
		for(var i=0 ; i<dom.getLength() ; i++){
			var currElement = dom.getDom(i);
			if(this.containsElement(currElement)){
				console.log('ERROR : MbaDom already contains element.');
				dom.remove(new MbaDom(currElement));
			}
		}
		
		var domToInsert = dom.getDom();
		var domToInsertLength = domToInsert.length;
		var newDom = [];
		for ( var i = 0; i < index; i++) {
			newDom[i] = this.dom[i];
		}
		
		for ( var i = 0; i < domToInsertLength; i++) {
			newDom[index+i] = domToInsert[i];
		}
		
		for ( var i = index + domToInsertLength; i < this.dom.length
				+ domToInsertLength; i++) {
			newDom[i] = this.dom[i - domToInsertLength];
		}

		this.dom = newDom;
	};
	
	this.remove = function(dom){
		checkType(dom, MbaDom);
		
		var elements = dom.getDom();
		this.dom = _.difference(this.dom, elements);
	}
	
	this.getLength = function(){
		return this.dom.length;
	}
	
	this.containsElement = function(element){
		for(var i=0 ; i<this.dom.length ; i++){
			var currElement = this.dom[i];
			if(currElement == element)
				return true;
		}
		return false;
	}
	
	this.appendChild = function(dom){
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
    
    this.removeChild = function(dom){
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
	
	this.insertChildAtIndex = function(dom, index){
		checkType(dom, MbaDom);
		checkType(index, 'number');
		
		if(this.getLength() == 1){
            var domElement = this.getDom(0);
            if(index > domElement.childNodes.length)
                console.log('ERROR : Can\'t insert an element after the last one.');//TODO à supprimer pour remplacer par la version2

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
    
    this.insertChildAtIndex2 = function(dom, index){
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
	
	//TODO renomme ren removeChildrenRangeInclude
	this.removeChildrenBetween = function(startIndex, endIndex){
		checkType(startIndex, 'number');
		checkType(endIndex, 'number');
		
		if(this.getLength() == 1){
			var childrenToRemove = [];
			for(var i=startIndex ; i<=endIndex ; i++){
				childrenToRemove.push(this.getDom(0).childNodes[i]);
			}
			
			for(var i=0 ; i<childrenToRemove.length ; i++){
				this.getDom(0).removeChild(childrenToRemove[i]);
			}
			
			return new MbaDom(childrenToRemove);
		}
		else
			throw new Error('the \'removeChildrenBetween\' method is only allowed on MbaDom representing one dom element.');
	};
	
	this.removeRangeInclude = function(startIndex, endIndex){
		checkType(startIndex, 'number');
		checkType(endIndex, 'number');
		
		if(startIndex < 0 || endIndex >= this.dom.length)
			throw new MbaError(2, 'index out of limits');
		
		var begin = _.first(this.dom, startIndex);
		var end = _.last(this.dom, this.dom.length-1-endIndex);
		
		var newDom = begin.concat(end);
		var removedElements = _.difference(this.dom, newDom);
		this.dom = newDom;
		return new MbaDom(removedElements);
	};
    
    this.equals = function(other){
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
    this.referenceModelIntoParent = function(model){
        var parent = this.getDom(0).parentElement;
        parent._mbaModel = model;
    };
    
    this.referenceModel = function(model){
        var dom = this.getDom();
        //TODO optimiser pour las avec un seul element et raison de plus pour avoir une classe représentant un seul elément de dom
        for(var i=0 ; i<dom.length ; i++){
            dom[i]._mbaModel = model;   
        }
    };
};


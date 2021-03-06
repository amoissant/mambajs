
var MBA_CST = {};
MBA_CST.ROOT = 'r00t';
MBA_CST.REF_FUNCTIONS = {};
MBA_CST.REFRESH = 'refresh';

var MBA_DI = {};
MBA_DI.get = function(type){
    var impl = this[type];
    if(impl == null)
        throw new Error('Dependency injection error : '+type.prototype.constructor.name+' is not bound.');
    return new this[type]();
};
MBA_DI.bind = function(type){
    var that = this;
    return {to: function(impl){
                    that[type] = impl;
                }
           };
};

/* Fonctions de transformation du dom */

//TODO enlever jquery d'ici

var DOM_TRANSF = {};

DOM_TRANSF.text = function(dom, newValue, oldValue){
	if(!isATextNode(dom))
		console.log('WARNING : surement un problème dans la directive.');//TODO faire une meilleur gestion des erreurs et aide au débug
	dom.textContent = newValue;
};
DOM_TRANSF.attr = function(dom, newValue, oldValue, attr){
	if (newValue == null)
		return;
	
	if (attr == 'class') {
		if(oldValue!=null)
			$(dom).removeClass(oldValue);
		$(dom).addClass(newValue);
	}
	else {
		dom.setAttribute(attr, newValue);
	}
};
DOM_TRANSF.addAttr = function(dom, newValue, oldValue, attr){toggleAttr(dom, newValue, oldValue, attr, true);};
DOM_TRANSF.remAttr = function(dom, newValue, oldValue, attr){toggleAttr(dom, newValue, oldValue, attr, false);};

function toggleAttr (dom, newValue, oldValue, attribute, operation){
	if(newValue == null)
		return;

	var condition = newValue == operation;
	if(condition){
		$(dom).attr(attribute, attribute);
	}
	else{
		$(dom).removeAttr(attribute);
	}
}

/* Fonctions utilitaires et d\'assert */

function isDomElement(element){
	return element instanceof HTMLElement || element instanceof Text;
}

function domToString(dom){
	if(isDomSet(dom)){
		var res = [];
		for(var i=0 ; i<dom.length ; i++){
			var currDom = dom[i];
			res.push(currDom.outerHTML);
		}
		return res.join('');
	}else if(isDomElement(dom)){
		return dom.outerHTML;
	}else{
		console.log('ERROR : dom or array of dom expected', dom);
	}
}

function toArray(obj){
	if(obj == null)
		return [];
	else if(!$.isArray(obj))
		return [obj];
	else
		return obj;
}


//TODO : contrainte pour un binding : un sous-binding ne peut utiliser des selecteurs que s'ils appartienent au __root__ du parent.

function checkType(obj, type, arrayElementType){
	if(type == 'array'){
		if(arrayElementType == null){
			console.log("ERROR : precise type of array's elements.");
			return;
		}
		if(!(obj instanceof Array)){
			console.log('ERROR : an array is expected.');
			return;
		}
		if(obj.length > 0){
			if(arrayElementType == "dom" || arrayElementType == 'domElement'){
				if(!isDomElement(obj[0]))
					console.log('ERROR : an array of '+arrayElementType+' is expected.');
				return;	
			}
			else if(typeof(arrayElementType) == "string" && !oneElementIsOfType(obj, arrayElementType)){
				console.log('ERROR : an array of '+arrayElementType+' is expected.');
				return;	
			}
			else if(typeof(arrayElementType) == "function" && !(obj[0] instanceof arrayElementType)){
				console.log('ERROR : an array of '+arrayElementType.name+' is expected.');
				return;
			}
		}
	}
	else if(type == "dom" || type == 'domElement'){
		if($.isArray(obj) || !isDomElement(obj))
			console.log('ERROR : instance of type "'+type+'" expected.');
		return;
	}
	else if(typeof(type) == "string" && ($.isArray(obj) || typeof(obj) != type)){
		console.log('ERROR : instance of type "'+type+'" expected.');
		return;
	}
	else if(typeof(type) == "function" && (!(obj instanceof type))){
		console.log('ERROR : instance of type "'+type.name+'" expected.');
		return;
	}
}

function isDomSet(dom){
    return (dom.length > 0) && (((dom instanceof Array) && isDomElement(dom[0])) || (dom instanceof NodeList));
}

function isDomSetOrEmpty(dom){
    return (dom instanceof Array) || (dom instanceof NodeList);
}


function checkIsDomSet(dom){
    if(!isDomSet(dom))
        console.log('ERROR : Is not a set of dom elements with at least one element : ', dom);
}

function checkIsDomSetOrEmpty(dom){
    if(!isDomSetOrEmpty(dom))
        console.log('ERROR : Is not a set of dom element : ', dom);
}


function oneElementIsOfType(array, type){
    for(var i=0 ; i<array.length ; i++){
        if(array[i] != null && typeof(array[i]) == type)
            return true;
    }
    return false;
}

function checkTypeOrNull(obj, type, arrayElementType){
    if(obj == null)
        return;
    else
        checkType(obj, type, arrayElementType);
}

function checkArgNb(args, nb){
    if(args.length != nb)
        throw new Error('bad number of argument');
}

function isATextNode(node){
	return node.nodeName == "#text";
}

function pushAllOld(context, anotherArray){
    for(var i=0 ; i<anotherArray.length ; i++){
        context.push(anotherArray[i]);
    }
};

function stringToDom(string){
    var root = document.createElement('div');
    root.innerHTML = string;
    return root.childNodes;
}

var arrayFunctions = {
    array : null,
    pushAll : function(elements){
        for(var i=0 ; i<elements.length ; i++)
            this.array.push(elements[i]);
    },
    empty : function(){
        var length = this.array.length;
        for(var i=0 ; i<length ; i++)
            this.array.pop();
    } 
};

var mapFunctions = {
    map : null,
    values: function(){
        var values = [];
        for(var key in this.map){
            values.push(this.map[key]);
        }
        return values;   
    },
    keys: function(){
        var keys = [];
        for(var key in this.map){
            keys.push(key);
        }
        return keys;   
    }   
};


var Uti = {
    array : function(array){
        arrayFunctions.array = array;
        return arrayFunctions;
    },
    map : function(map){
        mapFunctions.map = map;
        return mapFunctions;
    }
};



var MBA_CST = {};
MBA_CST.ROOT = 'r00t';
MBA_CST.POPULATE = 'populate';
MBA_CST.VISITED ="V151730";
MBA_CST.DIRECTIVE ="01R3C71V3";
MBA_CST.MAMBA ="mamba";
MBA_CST.REF_FUNCTIONS = {};

var $mamba = function(model, template, directivePrec){
	return new Mamba(model, template, directivePrec).render();
};



/* Fonctions de transformation du dom */

var DOM_TRANSF = {};

DOM_TRANSF.text = function(dom, newValue, oldValue){
	/*if(newValue == null)
		return;*/
	
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

function selectHack (dom){
	var template = new MbaDom(dom);
	var select = template.find('select');
	if(!select.isEmpty()){
		var dom = select.getElements()
		for(var i=0 ; i<dom.length ; i++){
			var currSelect = dom[i];
			if(currSelect.attributes["value"] != null){
				currSelect.value = currSelect.attributes["value"].value;
				DOM_TRANSF.remAttr(currSelect, true, null, 'value');
			}
		}
	}
}

/* Autres fonctions utilisées dans Mamba */

function isModelArray(obj){
	if(!$.isArray(obj))
		return false;
	
	for(var i=0 ; i<obj.length ; i++){
		if(!(obj[i] instanceof MbaModel))
			return false;
	}
	return true;
}

function isDomElement(element){
	return element instanceof HTMLElement || element instanceof Text;
}

function isArrayDomElement(array){
	if($.isArray(array)){
		for(var i=0 ; i<array.length ; i++){
			if(!isDomElement(array[i])){
				return false;
			}	
		}
		return true;
	}
	return false;
}

//TODO suppr fonction isArrauDomElement et la remplacer par celle-ci
function isDomElementArray(object){
    return object instanceof Array  
           && object.length > 0
           && isDomElement(object[0]);
}

function isDom(obj){
	obj = toArray(obj);
	return isArrayDomElement(obj);
}

function isArrayString(array){
	if(array.length == 0){
		return false;
	}
	else{
		for(var i=0 ; i<array.length ; i++){
			if(typeof array[i] != 'string'){
				return false;
			}	
		}
	}
	return true;
}

function isEmptyArray(obj){
	return $.isArray(obj) && obj.length == 0;
}


function getDirectiveProperties(directive){
	var filteredProperties = [];
	var properties = Object.keys(directive);
	for(var i=0 ; i<properties.length ; i++){
		var currProp = properties[i];
		if(currProp != MBA_CST.VISITED && currProp != MBA_CST.DIRECTIVE)
			filteredProperties.push(currProp); 
	}
	
	return filteredProperties;
}


function isDirective(obj){
	return isBinding(obj);
}

function isBinding(obj){
	return isValidBinding(obj);
}

function isDirectiveArray(array){
	for(var i=0 ; i<array.length ; i++){
		if(!isDirective(array[i]))
			return false;
	}
	return true;
}

function bindingMatchModel(binding, model){
	if(model == null || binding == null){
		return false;
	}

	var properties = getDirectiveProperties(binding);
	for(var i=0 ; i<properties.length ; i++){
		var prop = properties[i];	
		var bindingVal = binding[prop];

		if(model[prop] == null){
			return false;
		}
				
		if(isBinding(bindingVal)){
			if(!bindingMatchModel(bindingVal, model[prop]))
				return false;
		}		
	}	

	return true;
}


function isJQuery(obj){
	return obj != null && obj.jquery != null;
}

function domToString_old(dom){
	var res = '';
	
	if($.isArray(dom)){
		for(var i in dom){
			res += domToString(dom[i]);
		}
	}
	else{
		if(isDomElement(dom))
			res = dom.outerHTML;
		else if (isJQuery(dom))
			res = domToString(dom.get());
			
	}
	return res;
}

function domToString(dom){
	if(isArrayDomElement(dom)){
		var res = [];
		for(var i=0 ; i<dom.length ; i++){
			var currDom = dom[i];
			res.push(currDom.outerHTML);
		}
		return res.join('');
	}else if(isDomElement(dom)){
		return dom.outerHTML;
	}else{
		console.log('ERROR : dom or array of dom expected');
		console.log(dom);
	}
}


function cloneDom(dom){
	var clone = $(domToString(dom)).get();
	
	if(clone.length == 1)
		return clone[0];
	else if (clone.length > 1)
		return clone;
	else
		return null;
}


//TODO : tester match
/*
 * Le 'is' de jquery correspond à une disjonction, ici on
 * calcule la conjonction.
 */
function match(obj, other){
	var match = true;
	obj = toArray(obj);
	for(var i=0 ; i<obj.length ; i++){
		match &= $(obj[i]).is(other);
	}
	return match;
}

function findInTemplate(template, selector){
	//TODO pas très safe mais optimisé, refacto c'est moche  
    if(template.length > 0 && !isDomSet(template))
        throw new Error('template must be an array or a NodeList');
    
    if(template.length >= 1){
        if(template[0].parentNode)
            return template[0].parentNode.querySelectorAll(selector);
        else{
            var parent = document.createElement('div');
            for(var i=0 ; i<template.length ; i++){
                if(template[i].parentNode)
                    throw new Error('implement this case when not all template\'s elements have a parent');
                else
                    parent.appendChild(template[i]);
            }
            var foundElements = parent.querySelectorAll(selector);
            for(var i=0 ; i<template.length ; i++){
                parent.removeChild(template[i]);
            }            
            return foundElements;
        }
    }
    else
        return [];
}

function findInTemplate_(template, selector){//TOOD à suppr
	if(!isDomElement(template) && !isDomSet(template))
		throw new Error("template must be a dom element or an set of dom elements.");

	var tmpParent = $('<div></div>').get()[0];
	template = toArray(template);
	var parents = [];
	for(var i=0 ; i<template.length ; i++){
		var currElement = template[i];
		parents.push(currElement.parentNode);
	}
	$(tmpParent).append(template);
	var foundElements = $(tmpParent).find(selector).get();
	for(var i=0 ; i<template.length ; i++){
		var currElement = template[i];
		var currParent = parents[i];
		if(currParent != null)
			currParent.appendChild(currElement);
		else
			tmpParent.removeChild(currElement);
	}
	return foundElements;
}



function toArray(obj){
	if(obj == null)
		return [];
	else if(!$.isArray(obj))
		return [obj];
	else
		return obj;
}


function firstIsChildOfSecond(first, second){
	if(first == second)
		return false;
	
	var parent = first.parentNode;
	while(parent != null){
		if(parent == second)
			return true;
		else
			parent = parent.parentNode;
	}
	
	return false;
}

function getDeep(element){
	if($.isArray(element))
		element = element[0];
	
	var deep = 0;
	while(element.parentElement != null){
		element = element.parentElement;
		deep++;
	}
	return deep;
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

function getDomChildren_(element){
	checkType(element, 'dom');
	
	var children = element.childNodes;
	var childrenArray = [];
	for(var i=0 ; i<children.length ; i++){
		childrenArray.push(children[i]);
	}
	return childrenArray;
}


function isATextNode(node){
	return node.nodeName == "#text";
}

function getDomElementWithPath_(renderedDom, path){
	checkType(renderedDom, MbaDom);

	var domPath = path;
	if(arguments.length > 2){
		domPath = [];
		for(var i=1; i<arguments.length ; i++){
			domPath.push(arguments[i]);
		}
	}		
	domPath = toArray(domPath);
	
	if(domPath.length == 1){
		return renderedDom.getElement(domPath[0]);
	}
	else {
		var subDomElement = getDomChildren(renderedDom.getElement(domPath[0]));
		var subRenderedDom = new MbaDom(subDomElement);
		domPath.shift();
		return getDomElementWithPath(subRenderedDom, domPath);
	}
}

function routeFromString(routeString){
    checkType(routeString, 'string');
    return eval('['+routeString+']');
}


function pushAll(context, anotherArray){
    checkType(anotherArray, Array);
    for(var i=0 ; i<anotherArray.length ; i++){
        context.push(anotherArray[i]);
    }
};

function stringToDom(string){
    var root = document.createElement('div');
    root.innerHTML = string;
    return root.childNodes;
}


function Mamba(model, template, directive, anchor){

    this._model;
    this._template;
    this._directive;
    this._anchor;
    this._domTemplate;
    
    this.init(model, template, directive, anchor);
}

Mamba.prototype.init = function(model, template, directive, anchor){
    this._model = model;
    if(typeof(template) == 'string'){
        this._template = template;
        this.initAnchor(anchor);
    }
    else{
        if(isDomElement(template))
            this._domTemplate = new MbaDomSingle(template);
        else if(isDomSet(template))
            this._domTemplate = new MbaDom(template);
        else
            throw new Error('Unknow type for template, possible types are :\n'
                            +'- a string representing your template.'
                            +'- a dom element obtained by document.querySelector().'
                            +'- a array of dom element obtained by $("selector").get().'
                            +'- a NodeList object obtained by document.querySelectorAll().');
        this._anchor = new MbaDomSingle(this._domTemplate.getParent());
        this._template = this._domTemplate.toString();
    }   
    this._directive = directive;
};

Mamba.prototype.initAnchor = function(anchor){
    if(typeof(anchor) == 'string')
        anchor = document.querySelector(anchor);
    if(anchor)
        this._anchor = new MbaDomSingle(anchor);
};

Mamba.prototype.nodeListToDomArray = function(nodeList){
    checkType(nodeList, NodeList);
    var domArray = [];
    for(var i=0 ; i<nodeList.length ; i++){
        domArray.push(nodeList[i]);
    }
    return domArray;
};

Mamba.prototype.render = function(){
    var mbaTemplate = new MbaTemplate(this._template, this._directive);
    mbaTemplate.render(this._model);
    var renderedDom = mbaTemplate.getRenderedDom();
    var renderedDom2 = new MbaDom(renderedDom.getElements());//TODO ménage après refacto MbaDom 
    this.insertRenderedDomIntoAnchor(renderedDom2);
    return renderedDom.getElements();
};

Mamba.prototype.insertRenderedDomIntoAnchor = function(renderedDom){
    checkType(renderedDom, MbaDom);
    if(this._anchor){
        if(this._domTemplate){
            var insertIndex = this._domTemplate.positionInParent();
            this._domTemplate.removeFromParent();
            this._anchor.insertAtIndex(renderedDom, insertIndex);
        }
        else{
            this._anchor.append(renderedDom);
        }
    }
};
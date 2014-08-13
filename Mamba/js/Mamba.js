function Mamba(model, template, directive, anchor){//todo si template dom et  anchor on ignore anchor

    this._model;//objet
    this._template;//texte
    this._directive;//objet
    this._anchor;//dom element dans lequel insérer le dom rendu (optionnel) en faisant append
    this._domTemplate;
    
    this.init(model, template, directive, anchor);
}

Mamba.prototype.init = function(model, template, directive, anchor){
    this._model = model;
    if(isDomElement(template)){//todo tester domArray
        this._domTemplate = new MbaDomSingle(template);
        anchor = this._domTemplate.getParent();
        template = this._domTemplate.toString();
    }
    this._template = template;
    this._directive = directive;
    this.initAnchor(anchor);
};

Mamba.prototype.initAnchor = function(anchor){
    if(typeof(anchor) == 'string')
        anchor = document.querySelector(anchor);
    if(anchor)
        this._anchor = new MbaDomSingle(anchor);
};

Mamba.prototype.render = function(){
    var mbaTemplate = new MbaTemplate(this._template, this._directive);
    mbaTemplate.render(this._model);
    var renderedDom = mbaTemplate.getRenderedDom();
    var renderedDom2 = new MbaDom2(renderedDom.getDom());//TODO ménage après refacto MbaDom 
    this.insertRenderedDomIntoAnchor(renderedDom2);
    return renderedDom.getDom();
};

Mamba.prototype.insertRenderedDomIntoAnchor = function(renderedDom){
    checkType(renderedDom, MbaDom2);
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
function Mamba(model, template, directive, anchor){

    this._model;
    this._template;
    this._directive;
    this._anchor;
    this._domTemplate;
    this._mbaTemplate;
    this._renderedDom;
    this._options;
    
    this._init(model, template, directive, anchor);
}

/********** Mamba API methods **********/

Mamba.prototype.setOptions = function(options){
    checkType(options, 'object');
    for(var option in options){
        if(this._options.hasOwnProperty(option))
            this._options[option] = options[option];
        else
            throw new Error('Received an invalid option \''+option+'\'.');
    }
};

Mamba.prototype.render = function(model){
    if(model != null)
        this._model = model;
    if(this._mbaTemplate == null)
        this._mbaTemplate = new MbaTemplate(this._template, this._directive);
    this._mbaTemplate.render(this._model);
    if(this._options['genRefresh'])
        this._mbaTemplate.generateRefreshMethod();
    var renderedDom = this._mbaTemplate.getRenderedDom();
    this._insertRenderedDomIntoAnchor(renderedDom);
    return this._renderedDom.getElements();
};

Mamba.prototype.refresh = function(subModel){
    if(subModel != null)
        this._mbaTemplate.updateDomForModel(subModel);
    else
        this._mbaTemplate.updateDomForSuperModel();
    return this._mbaTemplate.getRenderedDom().getElements();//TODO tester ceci
};

Mamba.prototype.debugNodes = function(){
    this._mbaTemplate.getRootNode().debug(true);
};

Mamba.prototype.debugDirective = function(){
    this._mbaTemplate.getRootDirective().debug();
};

/********** internal methods **********/

Mamba.prototype._init = function(model, template, directive, anchor){
    this._model = model;
    if(typeof(template) == 'string'){
        this._template = template;
        this._initAnchor(anchor);
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
                            +'- a array of dom element obtained for example by $("selector").get().'
                            +'- a NodeList object obtained by document.querySelectorAll().');
        this._anchor = new MbaDomSingle(this._domTemplate.getParent());
        this._template = this._domTemplate.toString();
    }   
    this._directive = directive;
    this._initDefaultOptions();
    this._renderedDom = null;
};

Mamba.prototype._initAnchor = function(anchor){
    if(typeof(anchor) == 'string')
        anchor = document.querySelector(anchor);
    if(anchor != null)
        this._anchor = new MbaDomSingle(anchor);
};

Mamba.prototype._initDefaultOptions = function(){
    this._options = {};
    this._options.genRefresh = false;
};

Mamba.prototype._insertRenderedDomIntoAnchor = function(renderedDom){
    checkType(renderedDom, MbaDom);
    if(this._anchor != null){
        if(this._renderedDom != null)
            this._renderedDom.removeFromParent();
        if(this._domTemplate != null){
            var insertIndex = this._domTemplate.positionInParent();
            this._domTemplate.removeFromParent();
            this._anchor.insertAtIndex(renderedDom, insertIndex);
        }
        else{
            this._anchor.append(renderedDom);
        }
    }
    this._renderedDom = renderedDom;
};

Mamba.prototype._addRefreshMethodOntoModel = function(){
    //TODO parcour récursif suivant les directives du model et ajout de  la fonction refresh.
};

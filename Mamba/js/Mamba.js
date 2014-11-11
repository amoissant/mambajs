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
    if(this._debugIsActive())
        console.log('Running Mamba in debug mode (default), use .setOptions({debug : false}) to turn off.');
    this._configureTraces();
    this._setModel(model);
    this._render();
    this._postRender();
    this._insertRenderedDomIntoAnchor();
    return this._renderedDom.getElements();
};

Mamba.prototype.refresh = function(subModel){
    return this._mbaTemplate.refresh(subModel);
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
    this._options.debug = true;
};

Mamba.prototype._insertRenderedDomIntoAnchor = function(renderedDom){
    checkType(renderedDom, MbaDom);
    var renderedDom = this._mbaTemplate.getRenderedDom();
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

Mamba.prototype._debugIsActive = function(){
    return this._options['debug'];
};

Mamba.prototype._configureTraces = function(){
    MBA_DI.bind(DirectiveParser).to(this._debugIsActive() ? DirectiveParserDebug : DirectiveParser);
    MBA_DI.bind(MbaTemplate).to(this._debugIsActive() ? MbaTemplateDebug : MbaTemplate);
};

Mamba.prototype._setModel = function(model){
    if(model != null)
        this._model = model;
};

Mamba.prototype._initMbaTemplate = function(){
    if(this._mbaTemplate == null)
        this._mbaTemplate = MBA_DI.get(MbaTemplate);
    this._mbaTemplate.init(this._template, this._directive);
};

Mamba.prototype._render = function(){
  this._initMbaTemplate();  
  this._mbaTemplate.render(this._model);
};

Mamba.prototype._postRender = function(){
    if(this._options['genRefresh'])
        this._mbaTemplate.generateRefreshMethod();
};
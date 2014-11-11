function MbaTemplateDebug(template, directivesPrecursor){
    
    if(arguments.length != 0)
        MbaTemplate.prototype.init.call(this, template, directivesPrecursor);
}

MbaTemplateDebug.prototype = new MbaTemplate();
MbaTemplateDebug.prototype.constructor = MbaTemplateDebug;

MbaTemplateDebug.prototype.render = function(model){
    console.log('Render dom for model : ', model);
    return MbaTemplate.prototype.render.call(this, model);
};

MbaTemplateDebug.prototype.refresh = function(subModel){
    var model = subModel == null ? this._superModel : subModel;
    console.log('Refresh dom for model : ', model);    
    return MbaTemplate.prototype.refresh.call(this, subModel);
};

MbaTemplateDebug.prototype.getRenderedDom = function(){
    var renderedDom = MbaTemplate.prototype.getRenderedDom.call(this);
    if(renderedDom.isEmpty())
        console.log('The rendered dom is empty, are you missing something ?');   
    else
        console.log('Rendered dom is : ', renderedDom.getElements());
    return renderedDom;
};
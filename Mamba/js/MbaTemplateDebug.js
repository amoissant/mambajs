function MbaTemplateDebug(template, directivesPrecursor){
    
    if(arguments.length != 0)
        MbaTemplate.prototype.init.call(this, template, directivesPrecursor);
}

MbaTemplateDebug.prototype = new MbaTemplate();
MbaTemplateDebug.prototype.constructor = MbaTemplateDebug;

MbaTemplateDebug.prototype.render = function(model){
    console.log('Render dom for model : ', model);
    MbaTemplate.prototype.render.call(this, model);
};

MbaTemplateDebug.prototype.refresh = function(subModel){
    var model = subModel == null ? this._superModel : subModel;
    console.log('Refresh dom for model : ', model);    
    MbaTemplate.prototype.refresh.call(this, subModel);
};

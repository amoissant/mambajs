function MbaTemplateTree(){
 
}

MbaTemplateTree.prototype.init = function(template){
    checkType(template, MbaDom);
    return this;
};

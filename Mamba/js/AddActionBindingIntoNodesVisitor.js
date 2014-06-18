function AddActionBindingIntoNodesVisitor(template){
    
    this._template;
    this._directives;
    
    if(arguments.length > 0)
        this.init(template);
}
AddActionBindingIntoNodesVisitor.prototype = new MbaDirectiveVisitor();
AddActionBindingIntoNodesVisitor.prototype.constructor = AddActionBindingIntoNodesVisitor;

AddActionBindingIntoNodesVisitor.prototype.init = function(template){
    checkType(template, MbaDom);
    this._template = template;
    this._directives = [];
}; 

AddActionBindingIntoNodesVisitor.prototype.beforeVisitDirective = function(directive){
    checkType(directive, MbaDirective2);
    this._directives.push(directive);
};

AddActionBindingIntoNodesVisitor.prototype.afterVisitDirective = function(directive){
    checkType(directive, MbaDirective2);
    this._directives.pop();
};

AddActionBindingIntoNodesVisitor.prototype.getParentSelectors = function(){
    var parentSelectors = [];
    for(var i=0 ; i<this._directives.length ; i++){
        var currDirective = this._directives[i];
        if(currDirective.hasRoot()){
            var currSelector = currDirective.getRootSelector();
            parentSelectors.push(currSelector);
        }
    }
    return parentSelectors;
};


AddActionBindingIntoNodesVisitor.prototype.findDomForActionBinding = function(actionBinding){
    checkType(actionBinding, MbaActionBinding);
    var selectors = this.getParentSelectors();
    var actionSelector = actionBinding.getSelector();
    if(selectors.length==0 || selectors[selectors.length-1]!=actionSelector)
        selectors.push(actionSelector);
    var combinedSelector = selectors.join(' ');
    var dom = this._template.find2(combinedSelector);
    if(dom.isEmpty())
        throw new MbaError(22, 'Can\"t find dom element with selector \''+combinedSelector+'\' for action \''+actionBinding.getAction()
                           +'\' in template. It must exist in template and be a descendant of nearest parent r00t.');
    return dom;
}

AddActionBindingIntoNodesVisitor.prototype.visitActionBinding = function(actionBinding){
    checkType(actionBinding, MbaActionBinding);
    var dom = this.findDomForActionBinding(actionBinding);
    var node = dom.getDom(0).mbaNode;
    node.addActionBinding(actionBinding);
}; 
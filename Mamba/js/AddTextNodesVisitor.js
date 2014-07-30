function AddTextNodesVisitor(template){
    
    this._template;
    this._subTemplates;
    
    AddTextNodesVisitor.prototype.init = function(template){
        checkType(template, MbaDom);
        this._template = template;
        this._subTemplates = [template];
    };
    
    AddTextNodesVisitor.prototype.beforeVisitDirective = function(directive){
        checkType(directive, MbaDirective);
        if(directive.hasRoot()){
            var subTemplate = this.getRelativeTemplate().find2(directive.getRootSelector());
            this._subTemplates.push(subTemplate);
        }
        else
            this._subTemplates.push(this.getRelativeTemplate());
    };
    
    AddTextNodesVisitor.prototype.afterVisitDirective = function(directive){
        checkType(directive, MbaDirective);
        this._subTemplates.pop();
    };
    
    AddTextNodesVisitor.prototype.beforeVisitBinding = function(binding){
        checkType(binding, MbaBinding);
        if(binding.getAnchorProvider() instanceof TextNodeAnchorProvider){
            var selector = binding.getSelector();
            var anchor = this.getRelativeTemplate().find2(selector);
            if(anchor.isEmpty())
                throw new MbaError(0, 'Unable to find \''+binding.getSelector()
                                   +'\' into template : '+this.getRelativeTemplate().toString());
            if(this.anchorHasNoChildren(anchor)){
                this.addTextNodeToAnchor(anchor);
            }
        }        
    };
    
    AddTextNodesVisitor.prototype.anchorHasNoChildren = function(anchor){
        checkType(anchor, MbaDom);
        if(this.anchorIsValid(anchor))
            return anchor.getDom(0).childNodes.length == 0;
        else
            throw new MbaError(0, 'Anchor is not valid in our case');
    };
    
    AddTextNodesVisitor.prototype.anchorIsValid = function(anchor){
        checkType(anchor, MbaDom);
        if(anchor.isEmpty())
            return false;
        else if(anchor.getDom().length != 1)
            return false;
        else if(anchor.getDom(0).childNodes.length > 1)
            return false;
        return true;
    };
    
    AddTextNodesVisitor.prototype.addTextNodeToAnchor = function(anchor){
        checkType(anchor, MbaDom);
        var textNodeElement = document.createTextNode('');
        anchor.getDom(0).appendChild(textNodeElement);
    };
    
    AddTextNodesVisitor.prototype.getRelativeTemplate = function(){
      return this._subTemplates[this._subTemplates.length-1];  
    };
    
    if(arguments.length != 0){
        this.init(template);
    }
}
AddTextNodesVisitor.prototype = new MbaDirectiveVisitor();
AddTextNodesVisitor.prototype.constructor = AddTextNodesVisitor;
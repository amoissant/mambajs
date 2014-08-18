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
            var subTemplate = this.getRelativeTemplate().find(directive.getRootSelector());
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
            var anchor_ = this.getRelativeTemplate().find(selector);
            var anchor = new MbaDom2(anchor_.getDom());//TODO ménage après refacto MbaDom
            if(anchor.isEmpty())
                throw new Error('Unable to find \''+binding.getSelector()
                                +'\' into template : '+this.getRelativeTemplate().toString());
            if(!anchor.hasChildren()){
                this.addTextNodeToAnchor(anchor);
            }
            //commenté car on ne sais pas si on a déjà traité ces éléments de dom
            //else throw new Error('You can\'t bind text into a dom element already having children : '+anchor.toString());
            //TODO : ajouter ce contrôle pendant la phase de validation avant render 
        }        
    };
    
    AddTextNodesVisitor.prototype.addTextNodeToAnchor = function(anchor){
        checkType(anchor, MbaDom2);
        var elements = anchor.getElements();
        for(var i=0 ; i<elements.length ; i++){
            elements[i].appendChild(document.createTextNode(''));
        }
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
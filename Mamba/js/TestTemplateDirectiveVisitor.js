function TestTemplateDirectiveVisitor(test){
    
    this._tests;
    this._success;
    this._stack;
    
    TestTemplateDirectiveVisitor.prototype.init = function(test){
        checkType(test, 'object');
        this._tests = toArray(test);
        this._success = true;
        this._stack=[this._tests];
    };
    
    TestTemplateDirectiveVisitor.prototype.beforeVisitSubTemplateDirectives = function(subTemplateDirectives, directiveIndex){
        checkType(subTemplateDirectives, 'array', MbaTemplateDirective);
        checkType(directiveIndex, 'number');
        this._stack.push(this.getCurrentTest()[directiveIndex].subDirectives);
        if(this.getCurrentTest().length != subTemplateDirectives.length){
            console.log('subDirectives numbers are not equals, received ',
                        subTemplateDirectives.length,
                        ' expected ',
                        this.getCurrentTest().length);
            this._success = false;
        }
    };
    
    TestTemplateDirectiveVisitor.prototype.afterVisitSubTemplateDirectives = function(subTemplateDirectives, directiveIndex){
        checkType(subTemplateDirectives, 'array', MbaTemplateDirective);
        checkType(directiveIndex, 'number');
        this._stack.pop();
    };
    
    TestTemplateDirectiveVisitor.prototype.beforeVisitTemplateDirective = function(templateDirective, directiveIndex){
        checkType(templateDirective, MbaTemplateDirective);
        checkType(directiveIndex, 'number');
        if(!this.getCurrentTest()[directiveIndex].rootAnchor.equals(templateDirective.getRootAnchor())){
            console.log('directive anchors are not equals, received ',
                        templateDirective.getRootAnchor(),
                        ' expected ',
                        this.getCurrentTest()[directiveIndex].rootAnchor);
            this._success = false;
        }
    };
    
    TestTemplateDirectiveVisitor.prototype.visitTemplateBinding = function(templateBinding, directiveIndex, bindingIndex){
        checkType(templateBinding, MbaTemplateBinding);
        checkType(directiveIndex, 'number');
        checkType(bindingIndex, 'number');
        var currTest = this.getCurrentTest()[directiveIndex].bindings[bindingIndex];
        if(!currTest.anchor.equals(templateBinding.getAnchor())){
            console.log('binding anchors are not equals, received ', templateBinding.getAnchor());
            console.log('expected ', currTest.anchor);
            this._success = false;
        }
        if(currTest.nbTransf && templateBinding.getTransformations().length != currTest.nbTransf){
            console.log('transformation numbesr are not equals, received ',
                        templateBinding.getTransformations().length,
                        ' but expected ',
                        currTest.nbTransf);
            this._success = false;
        }
    };
    
    TestTemplateDirectiveVisitor.prototype.getCurrentTest = function(){
        return this._stack[this._stack.length-1];
    };
    
    TestTemplateDirectiveVisitor.prototype.testSucceed = function(){
        return this._success;
    };
    
    if(arguments.length != 0){
        this.init(test);
    }
}
TestTemplateDirectiveVisitor.prototype = new MbaTemplateDirectiveVisitor;
TestTemplateDirectiveVisitor.prototype.constructor = TestTemplateDirectiveVisitor;
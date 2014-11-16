function MbaTemplateDirectiveChecker(){
    this._templateDirective;
    this._test;
    this._templateBindings;
    this._testBindings;
    this._templateSubDirectives;
    this._testSubDirectives;
    this._theyMatch;
}

MbaTemplateDirectiveChecker.prototype.checkTemplateDirectiveMatchesTest = function(templateDirective, test){
    checkType(templateDirective, MbaTemplateDirective);
    checkType(test, 'object');
    try{
        this.tryCheckTemplateDirectiveMatchesTest();
    }catch(e){
        console.log(e.message);
    }
    return this._theyMatch;
};

MbaTemplateDirectiveChecker.prototype.tryCheckTemplateDirectiveMatchesTest = function(templateDirective, test){
    checkType(templateDirective, MbaTemplateDirective);
    checkType(test, 'object');
    this._templateDirective = templateDirective;
    this._test = test;
    this._theyMatch = true;
    this.checkRootAnchorsMatch();
    this.checkBindingsMatch();
    this.checkSubDirectivesMatch();
};

MbaTemplateDirectiveChecker.prototype.checkRootAnchorsMatch = function(){
    var testRootAnchor = test.rootAnchor;
    var templateDirectiveRootAnchor = this._templateDirective.getRootAnchor();
    if(!testRootAnchor.equals(templateDirectiveRootAnchor)){
        console.log('directive anchors are not equals, received ',
                        templateDirectiveRootAnchor,
                        ', expected ',
                        testRootAnchor);
        this.abortCheck();
    }
};

MbaTemplateDirectiveChecker.prototype.checkBindingsMatch = function(){
    this._templateBindings = this._templateDirective.getTemplateBindings();
    this._testBindings = this._test.bindings;
    
    this.checkBindingsSizeMatch();
    this.checkAllTemplateBindingsMatchTests();
};

MbaTemplateDirectiveChecker.prototype.checkAllTemplateBindingsMatchTests = function(){
    for(var i=0 ; i<this._testBindings.length ; i++){
        var currTemplateBinding = this._templateBindings[i];
        var currTestBinding = this._testBindings[i];
        this.checkTemplateBindingMatchesTest(currTemplateBinding, currTestBinding);
    }    
};

MbaTemplateDirectiveChecker.prototype.checkBindingsSizeMatch = function(){
    var templateBindingSize = this._templateBindings.length;
    var testBindingSize = this._testBindings.length;
    if(templateBindingSize != testBindingSize){
        console.log('bindings sizes don\'t match, received ',
                    templateBindingSize,
                    ', expected ',
                    testBindingSize);
        this.abortCheck();
    }        
};

MbaTemplateDirectiveChecker.prototype.checkTemplateBindingMatchesTest = function(templateBinding, testBinding){
    checkType(templateBinding, MbaTemplateBinding);
    checkType(testBinding, 'object');
    this.checkTemplateBindingAnchorMatchesTest(templateBinding, testBinding);
    this.checkTemplateBindingTransfMatchesTest(templateBinding, testBinding);
};

MbaTemplateDirectiveChecker.prototype.checkTemplateBindingAnchorMatchesTest = function(templateBinding, testBinding){
    checkType(templateBinding, MbaTemplateBinding);
    checkType(testBinding, 'object');
    var templateBindingAnchor = templateBinding.getAnchor();
    var testBindingAnchor = testBinding.anchor;
    if(!testBindingAnchor.equals(templateBindingAnchor)){
        console.log('binding anchors are not equals, received ',
                    templateBindingAnchor,
                    ', expected ',
                    testBindingAnchor);
        this.abortCheck();
    }        
};

MbaTemplateDirectiveChecker.prototype.checkTemplateBindingTransfMatchesTest = function(templateBinding, testBinding){
    checkType(templateBinding, MbaTemplateBinding);
    checkType(testBinding, 'object');
    var templateBindingTransfSize = templateBinding.getTransformations().length;
    var testBindingTransfSize = testBinding.nbTransf;
    if(templateBindingTransfSize == testBindingTransfSize){
        console.log('transformation numbers are not equals, received ',
                    templateBindingTransfSize,
                    ', expected ',
                    testBindingTransfSize);
        this.abortCheck();
    }        
};

MbaTemplateDirectiveChecker.prototype.checkSubDirectivesMatch = function(){
    this._templateSubDirectives = this._templateDirective.getSubDirectives();
    this._testSubDirectives = this._test.subDirectives;
    
    this.checkSubDirectivesSizeMatchTest();
    this.checkAllTemplateSubDirectivesMatchTest();
};

MbaTemplateDirectiveChecker.prototype.checkSubDirectivesSizeMatchTest = function(){
    var templateSubDirectivesSize = this._templateSubDirectives.length;
    var testSubDirectiveSize = this._testSubDirectives.length;
    if(templateSubDirectivesSize != testSubDirectiveSize){
        console.log('subDirectives numbers are not equals, received ',
                        templateSubDirectivesSize,
                        ', expected ',
                        testSubDirectiveSize);
        this.abortCheck();
    }
};

MbaTemplateDirectiveChecker.prototype.checkAllTemplateSubDirectivesMatchTest = function(){
    for(var i=0 ; i<this._templateSubDirectives.length ; i++){
        var currTemplateSubDirective = this._templateSubDirectives[i];
        var currTestSubDirective = this._testSubDirectives[i];
        var templateDirectiveChecker = new MbaTemplateDirectiveChecker();
        templateDirectiveChecker.tryCheckTemplateDirectiveMatchesTest(currTemplateSubDirective, currTestSubDirective);
    }
};

MbaTemplateDirectiveChecker.prototype.abortCheck = function(){
    this._theyMatch = false;
    throw new Error('They don\'t match.');
};

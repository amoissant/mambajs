var testMbaV3 = function() {
    
    MBA_DI.bind(DirectiveValueParser).to(DirectiveValueParser);
    MBA_DI.bind(MbaBindingParser).to(MbaBindingParser);
    
    Ca('teste l\'ajout des identifiants dans les éléments de dom', function(){
        var dom = new MbaDomFromString('<div id="root"><span id="child1"></span><span id="child2"><a></a></span></div>'); 
        var domIdentifier = new MbaDomIdentifier(dom.getElements());
        domIdentifier.addIdsLevelOrder();
        
        var root = dom.selectOneMax('#root'); 
        var child1 = dom.selectOneMax('#child1');
        var child2 = dom.selectOneMax('#child2');
        var a = dom.selectOneMax('a');
        
        OnAttend(root._mbaId).DEtreEgalA(1);
        OnAttend(child1._mbaId).DEtreEgalA(2);
        OnAttend(child2._mbaId).DEtreEgalA(3);
        OnAttend(a._mbaId).DEtreEgalA(4);
    });
    
    Ca('teste l\'ajout des identifiants enfant maximum dans les éléments de dom', function(){
        var dom = new MbaDomFromString('<div id="root"><span id="child1"></span><span id="child2"><a></a></span></div>'); 
        var domIdentifier = new MbaDomIdentifier(dom.getElements());
        domIdentifier.addIdsLevelOrder();
        
        var root = dom.selectOneMax('#root'); 
        var child1 = dom.selectOneMax('#child1');
        var child2 = dom.selectOneMax('#child2');
        var a = dom.selectOneMax('a');
        
        OnAttend(root._mbaMaxChildId).DEtreEgalA(4);
        OnAttend(child1._mbaMaxChildId).DEtreEgalA(2);
        OnAttend(child2._mbaMaxChildId).DEtreEgalA(4);
        OnAttend(a._mbaMaxChildId).DEtreEgalA(4);
    });
    
   Ca('teste que la liste des dom multipliers est vide si aucun r00t', function(){
        var directive = {name : 'div'};
        
        var manager = new MbaManager();
        manager.parseDirective(directive);
        var domMultipliers = manager.getDomMultipliers();

        OnAttend(domMultipliers.length).DEtreEgalA(0);
    });
    
    Ca('teste que l\'on récupère la liste des dom multipliers', function(){
        var directive = 
            {r00t : 'div', 
             sub: {r00t : 'span'}, 
             other: {r00t : 'a', 
                     name : 'textarea',
                     subSub: {r00t : 'input'}},
             anotherOne: {r00t : 'video'}};
        
        var manager = new MbaManager();
        manager.parseDirective(directive);
        var domMultipliers = manager.getDomMultipliers();

        OnAttend(domMultipliers.length).DEtreEgalA(5);
        OnAttend(domMultipliers[0].getSelector()).DEtreEgalA('div');
        OnAttend(domMultipliers[0].getModelAccessor().toStringWithModel()).DEtreEgalA('model');
        
        OnAttend(domMultipliers[1].getSelector()).DEtreEgalA('span');
        OnAttend(domMultipliers[1].getModelAccessor().toStringWithModel()).DEtreEgalA('model.sub');
        
        OnAttend(domMultipliers[2].getSelector()).DEtreEgalA('a');
        OnAttend(domMultipliers[2].getModelAccessor().toStringWithModel()).DEtreEgalA('model.other');
        
        OnAttend(domMultipliers[3].getSelector()).DEtreEgalA('input');
        OnAttend(domMultipliers[3].getModelAccessor().toStringWithModel()).DEtreEgalA('model.other.subSub');
        
        OnAttend(domMultipliers[4].getSelector()).DEtreEgalA('video');
        OnAttend(domMultipliers[4].getModelAccessor().toStringWithModel()).DEtreEgalA('model.anotherOne');        
    });
    
    Ca('teste que l\'on récupère la liste des dom multipliers avec sous directive tableau', function(){
        var directive = 
            {r00t : 'div', 
             other: [{r00t : 'a', subSub: {r00t : 'input'}},
                     {r00t : 'video'}]};
        
        var manager = new MbaManager();
        manager.parseDirective(directive);
        var domMultipliers = manager.getDomMultipliers();

        OnAttend(domMultipliers.length).DEtreEgalA(4);
        OnAttend(domMultipliers[0].getSelector()).DEtreEgalA('div');
        OnAttend(domMultipliers[0].getModelAccessor().toStringWithModel()).DEtreEgalA('model');
        
        OnAttend(domMultipliers[1].getSelector()).DEtreEgalA('a');
        OnAttend(domMultipliers[1].getModelAccessor().toStringWithModel()).DEtreEgalA('model.other');
        
        OnAttend(domMultipliers[2].getSelector()).DEtreEgalA('input');
        OnAttend(domMultipliers[2].getModelAccessor().toStringWithModel()).DEtreEgalA('model.other.subSub');
        
        OnAttend(domMultipliers[3].getSelector()).DEtreEgalA('video');
        OnAttend(domMultipliers[3].getModelAccessor().toStringWithModel()).DEtreEgalA('model.other');        
    });
    
    Ca('teste que l\'on récupère la liste des bindings de propriété', function(){
        var directive = 
            {name : 'div', 
             coordinates: {r00t : 'a',
                           tel : '.tel', 
                           fax : '.fax'}};
        
        var manager = new MbaManager();
        manager.parseDirective(directive);
        var propertyBindings = manager.getPropertyBindings();

        OnAttend(propertyBindings.length).DEtreEgalA(3);
        OnAttend(propertyBindings[0].getSelector()).DEtreEgalA('div');
        OnAttend(propertyBindings[0].getPropertyAccessor().toStringWithModel()).DEtreEgalA('model.name');
        
        OnAttend(propertyBindings[1].getSelector()).DEtreEgalA('.tel');
        OnAttend(propertyBindings[1].getPropertyAccessor().toStringWithModel()).DEtreEgalA('model.coordinates.tel');
        
        OnAttend(propertyBindings[2].getSelector()).DEtreEgalA('.fax');
        OnAttend(propertyBindings[2].getPropertyAccessor().toStringWithModel()).DEtreEgalA('model.coordinates.fax');
    });
    
    Ca('teste que l\'on récupère la liste des bindings d\'action', function(){
        var directive = 
            {'name' : 'div', 
             '/toto' : '.toto',
             'coordinates': {'r00t' : 'a',
                           'tel' : '.tel', 
                           '/delete' : 'button, .del'}};
        
        var manager = new MbaManager();
        manager.parseDirective(directive);
        var actionBindings = manager.getActionBindings();

        OnAttend(actionBindings.length).DEtreEgalA(3);
        OnAttend(actionBindings[0].getSelector()).DEtreEgalA('.toto');
        OnAttend(actionBindings[0].getActionAccessor().toStringWithModel()).DEtreEgalA('model.toto');
        
        OnAttend(actionBindings[1].getSelector()).DEtreEgalA('button');
        OnAttend(actionBindings[1].getActionAccessor().toStringWithModel()).DEtreEgalA('model.coordinates.delete');
        
        OnAttend(actionBindings[2].getSelector()).DEtreEgalA('.del');
        OnAttend(actionBindings[2].getActionAccessor().toStringWithModel()).DEtreEgalA('model.coordinates.delete');
    });
    
};
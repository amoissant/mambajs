var testMbaV3 = function() {
    
    MBA_DI.bind(DirectiveValueParser).to(DirectiveValueParser);
    MBA_DI.bind(MbaTextBindingParser).to(MbaTextBindingParser);
    
    Ca('teste l\'ajout des identifiants dans les éléments de dom', function(){
        var dom = new MbaDomFromString('<div id="root"><span id="child1"></span><span id="child2"><a></a></span></div>'); 
        var domIdentifier = new MbaDomIdentifier().init(dom.getElements());
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
        var domIdentifier = new MbaDomIdentifier().init(dom.getElements());
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
    
    function modelAccessorString(domMultiplier){
        return domMultiplier.getModelAccessor().toStringWithModel();
    }
    
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
        OnAttend(modelAccessorString(domMultipliers[0])).DEtreEgalA('model');
        
        OnAttend(domMultipliers[1].getSelector()).DEtreEgalA('span');
        OnAttend(modelAccessorString(domMultipliers[1])).DEtreEgalA('model.sub');
        
        OnAttend(domMultipliers[2].getSelector()).DEtreEgalA('a');
        OnAttend(modelAccessorString(domMultipliers[2])).DEtreEgalA('model.other');
        
        OnAttend(domMultipliers[3].getSelector()).DEtreEgalA('input');
        OnAttend(modelAccessorString(domMultipliers[3])).DEtreEgalA('model.other.subSub');
        
        OnAttend(domMultipliers[4].getSelector()).DEtreEgalA('video');
        OnAttend(modelAccessorString(domMultipliers[4])).DEtreEgalA('model.anotherOne');        
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
        OnAttend(modelAccessorString(domMultipliers[0])).DEtreEgalA('model');
        
        OnAttend(domMultipliers[1].getSelector()).DEtreEgalA('a');
        OnAttend(modelAccessorString(domMultipliers[1])).DEtreEgalA('model.other');
        
        OnAttend(domMultipliers[2].getSelector()).DEtreEgalA('input');
        OnAttend(modelAccessorString(domMultipliers[2])).DEtreEgalA('model.other.subSub');
        
        OnAttend(domMultipliers[3].getSelector()).DEtreEgalA('video');
        OnAttend(modelAccessorString(domMultipliers[3])).DEtreEgalA('model.other');        
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
    
    Ca('test le tri des dom multiplier', function(){
        var domMultipliers = [
            new MbaDomMultiplier().init(['persons2'], ''),
            new MbaDomMultiplier().init(['persons2', 'vehicles2'], ''),
            new MbaDomMultiplier().init(['persons'], ''),
            new MbaDomMultiplier().init(['persons', 'vehicles'], '')
        ];
        var manager = new MbaManager();
        manager._domMultipliers = domMultipliers;
        manager.sortDomMultipliers();
        
        var sortedDomMultipliers = manager.getDomMultipliers();
        OnAttend(modelAccessorString(sortedDomMultipliers[0])).DEtreEgalA('model.persons');
        OnAttend(modelAccessorString(sortedDomMultipliers[1])).DEtreEgalA('model.persons2');
        OnAttend(modelAccessorString(sortedDomMultipliers[2])).DEtreEgalA('model.persons.vehicles');
        OnAttend(modelAccessorString(sortedDomMultipliers[3])).DEtreEgalA('model.persons2.vehicles2');
    });
    
    function domMultiplierNodeForRoute(domMultiplierTree, route){
        var routeCopy = route.slice();
        var nodeForRoute = domMultiplierTree;
        while(routeCopy.length > 0){
            nodeForRoute = nodeForRoute.getChildNodes()[routeCopy.shift()];
        }
        if(nodeForRoute == null)
            throw new Error('dom multiplier not found for route ['+route.join(',')+']');
        return nodeForRoute;
    };
    
    function modelAccessorStringForRoute(domMultiplierTree, route){
        var nodeForRoute = domMultiplierNodeForRoute(domMultiplierTree, route);
        return modelAccessorString(nodeForRoute.getDomMultiplier());
    };
        
    Ca('test la création de l\'abre des dom multiplier', function(){
        var domMultipliers = [
            new MbaDomMultiplier().init(['persons2'], ''),
            new MbaDomMultiplier().init(['persons2', 'adresses'], ''),
            new MbaDomMultiplier().init(['persons2', 'vehicles2'], ''),
            new MbaDomMultiplier().init(['persons'], ''),
            new MbaDomMultiplier().init(['persons', 'vehicles'], '')
        ];
        var manager = new MbaManager();
        manager._domMultipliers = domMultipliers;
        manager.createDomMultiplierTree();
        
        var domMultiplierTree = manager.getDomMultiplierTree();
        OnAttend(modelAccessorStringForRoute(domMultiplierTree, [0])).DEtreEgalA('model.persons');
        OnAttend(modelAccessorStringForRoute(domMultiplierTree, [0, 0])).DEtreEgalA('model.persons.vehicles');
        OnAttend(modelAccessorStringForRoute(domMultiplierTree, [1])).DEtreEgalA('model.persons2');
        OnAttend(modelAccessorStringForRoute(domMultiplierTree, [1, 0])).DEtreEgalA('model.persons2.adresses');
        OnAttend(modelAccessorStringForRoute(domMultiplierTree, [1, 1])).DEtreEgalA('model.persons2.vehicles2');
    });
  
    function relativeAccessorStringForRoute(domMultiplierTree, route){
        var nodeForRoute = domMultiplierNodeForRoute(domMultiplierTree, route);
        return nodeForRoute.getRelativeAccessor().toString();
    };
    
    Ca('test l\'initialisation des relativeAccessor dans l\'arbre des dom multiplier', function(){
        var domMultipliers = [
            new MbaDomMultiplier().init(['persons2'], ''),
            new MbaDomMultiplier().init(['persons2', 'adresses'], ''),
            new MbaDomMultiplier().init(['persons2', 'vehicles2'], ''),
            new MbaDomMultiplier().init(['persons'], ''),
            new MbaDomMultiplier().init(['persons', 'vehicles'], '')
        ];
        var manager = new MbaManager();
        manager._domMultipliers = domMultipliers;
        manager.createDomMultiplierTree();
        
        var domMultiplierTree = manager.getDomMultiplierTree();
        OnAttend(relativeAccessorStringForRoute(domMultiplierTree, [0])).DEtreEgalA('[persons]');
        OnAttend(relativeAccessorStringForRoute(domMultiplierTree, [0, 0])).DEtreEgalA('[vehicles]');
        OnAttend(relativeAccessorStringForRoute(domMultiplierTree, [1])).DEtreEgalA('[persons2]');
        OnAttend(relativeAccessorStringForRoute(domMultiplierTree, [1, 0])).DEtreEgalA('[adresses]');
        OnAttend(relativeAccessorStringForRoute(domMultiplierTree, [1, 1])).DEtreEgalA('[vehicles2]');
    });
    
    function domElementToCloneForRoute(domMultiplierTree, route){
        var nodeForRoute = domMultiplierNodeForRoute(domMultiplierTree, route);
        var domElements = new MbaDom(nodeForRoute.getDomElementsToClone());
        return domElements.toString();
    };
    
   Ca('teste l\'ajout des élément de dom à cloner dans les domMultiplierNode', function(){
        var template = new MbaDomFromString('<a class="person"></a><div class="person"><span class="vehicle"></span></div>');
        var domMultipliers = [
            new MbaDomMultiplier().init(['persons'], '.person'),
            new MbaDomMultiplier().init(['persons', 'vehicles'], '.vehicle')
        ];
        var manager = new MbaManager();
        manager._domMultipliers = domMultipliers;
        manager.createDomMultiplierTree();
        manager.setTemplate(template);
        manager.linkDomMultiplierTreeToTemplate();
        
        var domMultiplierTree = manager.getDomMultiplierTree();
        OnAttend(domElementToCloneForRoute(domMultiplierTree, [0]))
            .DEtreEgalA('<a class="person"></a><div class="person"></div>');
        OnAttend(domElementToCloneForRoute(domMultiplierTree, [0, 0]))
            .DEtreEgalA('<span class="vehicle"></span>');
    });
    
    function domElementsIdToCloneForRoute(domMultiplierTree, route){
        var nodeForRoute = domMultiplierNodeForRoute(domMultiplierTree, route);
        var domIdsMap = nodeForRoute._domElementsToCloneMap;
        var domIds = [];
        for(var domId in domIdsMap){
            domIds.push(domId);
        }
        return domIds.join(',');
    };
    
    Ca('teste la liste des id des éléments de dom à cloner dans les domMultiplierNode', function(){
        var template = new MbaDomFromString('<a class="person"></a><div class="person"><span class="vehicle"></span></div>');
        var domMultipliers = [
            new MbaDomMultiplier().init(['persons'], '.person'),
            new MbaDomMultiplier().init(['persons', 'vehicles'], '.vehicle')
        ];
        var manager = new MbaManager();
        manager._domMultipliers = domMultipliers;
        manager.createDomMultiplierTree();
        manager.setTemplate(template);
        manager.linkDomMultiplierTreeToTemplate();
        
        var domMultiplierTree = manager.getDomMultiplierTree();
        OnAttend(domElementsIdToCloneForRoute(domMultiplierTree, [0]))
            .DEtreEgalA('1,2');
        OnAttend(domElementsIdToCloneForRoute(domMultiplierTree, [0, 0]))
            .DEtreEgalA('3');
    });
    
    function domElementForRoute(templateTree, route){
        var routeCopy = route.slice();
        var templateNodeForRoute = templateTree;
        while(routeCopy.length > 0){
            templateNodeForRoute = templateNodeForRoute._childNodes[routeCopy.shift()];
        }
        if(templateNodeForRoute == null)
            throw new Error('template node not found for route ['+route.join(',')+']');
        return templateNodeForRoute._domElement.outerHTML;
    }
    
    Ca('teste la construction du MbaTemplateTree', function(){
        var templateDom = new MbaDomFromString('<a class="person"></a><div class="person"><span class="vehicle"></span></div>');
        var mbaTemplate = new MbaTemplate2().init(templateDom, ['.person']);
        var templateTree = mbaTemplate._templateTree;
        OnAttend(templateTree._childNodes.length).DEtreEgalA(2);
        OnAttend(domElementForRoute(templateTree, [0])).DEtreEgalA('<a class="person"></a>');
        OnAttend(domElementForRoute(templateTree, [1])).DEtreEgalA('<div class="person"><span class="vehicle"></span></div>');
        OnAttend(domElementForRoute(templateTree, [1, 0])).DEtreEgalA('<span class="vehicle"></span>');   
        
        OnAttend(templateTree._childNodes[0] instanceof MbaTemplateNode).DEtreVrai();
        OnAttend(templateTree._childNodes[1] instanceof MbaTemplateNodeMultipliable).DEtreVrai();
    });
    
    Ca('teste la construction de la MbaTemplateNodeMap', function(){
        var templateDom = new MbaDomFromString('<a class="person"></a><div class="person"><span class="vehicle"></span></div>');
        var mbaTemplate = new MbaTemplate2().init(templateDom, []);
        var nodeMap = mbaTemplate._templateNodeMap;
        
        OnAttend(Object.keys(nodeMap).length).DEtreEgalA(3);
        OnAttend(domToString(nodeMap[1]._domElement)).DEtreEgalA('<a class="person"></a>');
        OnAttend(domToString(nodeMap[2]._domElement)).DEtreEgalA('<div class="person"><span class="vehicle"></span></div>');
        OnAttend(domToString(nodeMap[3]._domElement)).DEtreEgalA('<span class="vehicle"></span>');
    });
    
    //TODO : id des accessorchain sans model et le calculer une fois pour toute
    
       /*new MbaDomMultiplier().init(['persons', 'garage']),
            new MbaDomMultiplier().init(['persons2', 'garage2', 'vehicles2']),
            new MbaDomMultiplier().init(['persons']),
            new MbaDomMultiplier().init(['persons', 'garage', 'vehicles']),
            new MbaDomMultiplier().init(['persons2', 'garage2']),
            new MbaDomMultiplier().init(['persons2'])*/
}
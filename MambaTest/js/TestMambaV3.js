var testMbaV3 = function() {
    
    MBA_DI.bind(DirectiveValueParser).to(DirectiveValueParser);
    MBA_DI.bind(MbaTextBindingParser).to(MbaTextBindingParser);

   //return; 
    
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
    
    function accessorString(object){
        switch(object.constructor){
            case MbaDomMultiplier:
                return object.getModelAccessor().toString();
            case MbaPropertyBinding:
                return object.getPropertyAccessorString();
            case MbaDomMultiplierNode:
                return object.getDomMultiplier().getModelAccessor().toString();
            case MbaPropertyBindingNode:
                return object.getPropertyBinding().getPropertyAccessorString();
            default:
                throw new Error('not implemented for '+object.constructor.name);
        }
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
        OnAttend(accessorString(domMultipliers[0])).DEtreEgalA('model');
        
        OnAttend(domMultipliers[1].getSelector()).DEtreEgalA('span');
        OnAttend(accessorString(domMultipliers[1])).DEtreEgalA('model.sub');
        
        OnAttend(domMultipliers[2].getSelector()).DEtreEgalA('a');
        OnAttend(accessorString(domMultipliers[2])).DEtreEgalA('model.other');
        
        OnAttend(domMultipliers[3].getSelector()).DEtreEgalA('input');
        OnAttend(accessorString(domMultipliers[3])).DEtreEgalA('model.other.subSub');
        
        OnAttend(domMultipliers[4].getSelector()).DEtreEgalA('video');
        OnAttend(accessorString(domMultipliers[4])).DEtreEgalA('model.anotherOne');        
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
        OnAttend(accessorString(domMultipliers[0])).DEtreEgalA('model');
        
        OnAttend(domMultipliers[1].getSelector()).DEtreEgalA('a');
        OnAttend(accessorString(domMultipliers[1])).DEtreEgalA('model.other');
        
        OnAttend(domMultipliers[2].getSelector()).DEtreEgalA('input');
        OnAttend(accessorString(domMultipliers[2])).DEtreEgalA('model.other.subSub');
        
        OnAttend(domMultipliers[3].getSelector()).DEtreEgalA('video');
        OnAttend(accessorString(domMultipliers[3])).DEtreEgalA('model.other');        
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
        OnAttend(propertyBindings[0].getPropertyAccessorString()).DEtreEgalA('model.name');
        
        OnAttend(propertyBindings[1].getSelector()).DEtreEgalA('.tel');
        OnAttend(propertyBindings[1].getPropertyAccessorString()).DEtreEgalA('model.coordinates.tel');
        
        OnAttend(propertyBindings[2].getSelector()).DEtreEgalA('.fax');
        OnAttend(propertyBindings[2].getPropertyAccessorString()).DEtreEgalA('model.coordinates.fax');
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
        OnAttend(actionBindings[0].getActionAccessor().toString()).DEtreEgalA('model.toto');
        
        OnAttend(actionBindings[1].getSelector()).DEtreEgalA('button');
        OnAttend(actionBindings[1].getActionAccessor().toString()).DEtreEgalA('model.coordinates.delete');
        
        OnAttend(actionBindings[2].getSelector()).DEtreEgalA('.del');
        OnAttend(actionBindings[2].getActionAccessor().toString()).DEtreEgalA('model.coordinates.delete');
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
        manager.createDomMultiplierTree();
        
        var sortedDomMultipliers = manager.getDomMultipliers();
        OnAttend(accessorString(sortedDomMultipliers[0])).DEtreEgalA('model.persons');
        OnAttend(accessorString(sortedDomMultipliers[1])).DEtreEgalA('model.persons2');
        OnAttend(accessorString(sortedDomMultipliers[2])).DEtreEgalA('model.persons.vehicles');
        OnAttend(accessorString(sortedDomMultipliers[3])).DEtreEgalA('model.persons2.vehicles2');
    });
    
    function nodeForRoute(tree, route){
        var routeCopy = route.slice();
        var nodeForRoute = tree;
        while(routeCopy.length > 0){
            nodeForRoute = nodeForRoute.getChildNodes()[routeCopy.shift()];
        }
        if(nodeForRoute == null)
            throw new Error('node not found for route ['+route.join(',')+']');
        return nodeForRoute;
    };
    
    function accessorStringForRoute(tree, route){
        var node = nodeForRoute(tree, route);
        return accessorString(node);
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
        OnAttend(accessorStringForRoute(domMultiplierTree, [0])).DEtreEgalA('model.persons');
        OnAttend(accessorStringForRoute(domMultiplierTree, [0, 0])).DEtreEgalA('model.persons.vehicles');
        OnAttend(accessorStringForRoute(domMultiplierTree, [1])).DEtreEgalA('model.persons2');
        OnAttend(accessorStringForRoute(domMultiplierTree, [1, 0])).DEtreEgalA('model.persons2.adresses');
        OnAttend(accessorStringForRoute(domMultiplierTree, [1, 1])).DEtreEgalA('model.persons2.vehicles2');
    });
  
    function relativeAccessorStringForRoute(tree, route){
        var node = nodeForRoute(tree, route);
        return node.getRelativeAccessor().toString();
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
        OnAttend(relativeAccessorStringForRoute(domMultiplierTree, [0])).DEtreEgalA('model.persons');
        OnAttend(relativeAccessorStringForRoute(domMultiplierTree, [0, 0])).DEtreEgalA('vehicles');
        OnAttend(relativeAccessorStringForRoute(domMultiplierTree, [1])).DEtreEgalA('model.persons2');
        OnAttend(relativeAccessorStringForRoute(domMultiplierTree, [1, 0])).DEtreEgalA('adresses');
        OnAttend(relativeAccessorStringForRoute(domMultiplierTree, [1, 1])).DEtreEgalA('vehicles2');
    });
    
    function domElementsToCloneForRoute(tree, route, domElementsFieldName){
        var node = nodeForRoute(tree, route);
        var domElementsArray = Uti.map(node.getDomElementsToCloneMap()).values();
        var domElements = new MbaDom(domElementsArray);
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
        OnAttend(domElementsToCloneForRoute(domMultiplierTree, [0]))
            .DEtreEgalA('<a class="person"></a><div class="person"></div>');
        OnAttend(domElementsToCloneForRoute(domMultiplierTree, [0, 0]))
            .DEtreEgalA('<span class="vehicle"></span>');
    });
    
    function domElementsIdForRoute(domMultiplierTree, route){
        var node = nodeForRoute(domMultiplierTree, route);
        var domIdsMap = node._domElementsToCloneMap;
        var domIds = Uti.map(domIdsMap).keys();
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
        OnAttend(domElementsIdForRoute(domMultiplierTree, [0]))
            .DEtreEgalA('1,2');
        OnAttend(domElementsIdForRoute(domMultiplierTree, [0, 0]))
            .DEtreEgalA('3');
    });
    
    function templateNodeForRoute(templateTree, route){
        var routeCopy = route.slice();
        var nodeForRoute = templateTree;
        while(routeCopy.length > 0){
            nodeForRoute = nodeForRoute.getChildNodes()[routeCopy.shift()];
        }
        if(nodeForRoute == null)
            throw new Error('Template node not found for route ['+route.join(',')+']');
        return nodeForRoute;
    }
    
    function domElementForRoute(templateTree, route){
        var node = nodeForRoute(templateTree, route);
        return node._domElement.outerHTML;
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
        
        OnAttend(Uti.map(nodeMap).keys().length).DEtreEgalA(3);
        OnAttend(domToString(nodeMap[1]._domElement)).DEtreEgalA('<a class="person"></a>');
        OnAttend(domToString(nodeMap[2]._domElement)).DEtreEgalA('<div class="person"><span class="vehicle"></span></div>');
        OnAttend(domToString(nodeMap[3]._domElement)).DEtreEgalA('<span class="vehicle"></span>');
    });
    
    Ca('teste le rendu sans multiplication d\'éléments', function(){
        var template = new MbaDomFromString('<a class="person"></a><div class="person"><span class="vehicle"></span></div>');
        var directive = {};
        var model = null;
        
        var manager = new MbaManager().init(template, directive);
        manager.render(model);
        var renderedDom = manager.getRenderedDom();
    
        OnAttend(renderedDom.toString()).DEtreEgalA('<a class="person"></a><div class="person"><span class="vehicle"></span></div>');
    });
    
    Ca('teste le rendu avec multiplication d\'éléments et modèle tableau', function(){
        var template = new MbaDomFromString('<div>list of persons</div><div class="list"><a class="person"></a></div><span>end</span>');
        var directive = {'r00t' : '.person'};
        var model = [{}, {}];
        
        var manager = new MbaManager().init(template, directive);
        manager.render(model);
        var renderedDom = manager.getRenderedDom();
    
        OnAttend(renderedDom.toString()).DEtreEgalA('<div>list of persons</div><div class="list"><a class="person"></a><a class="person"></a></div><span>end</span>');
    });
    
    Ca('teste que le rendu multiplie les éléments et les place au bon endroit', function(){
        var template = new MbaDomFromString('<div class="list"><span id="begin"></span><a class="person"></a><span id="end"></span></div>');
        var directive = {'r00t' : '.person'};
        var model = [{}, {}];
        
        var manager = new MbaManager().init(template, directive);
        manager.render(model);
        var renderedDom = manager.getRenderedDom();
    
        OnAttend(renderedDom.toString()).DEtreEgalA('<div class="list"><span id="begin"></span><a class="person"></a><a class="person"></a><span id="end"></span></div>');
    });
    
    Ca('teste que le rendu multiplie les éléments récursivement', function(){
        var template = new MbaDomFromString('<div class="list"><span id="begin"></span><div class="person">begin<a class="address"></a>end</div><span id="end"></span></div>');
        var directive = {'r00t' : '.person',
                         'sub' : {'r00t' : '.address'}};
        var model = [{"sub" : [{}]}, {"sub" : [{}, {}]}];
        
        var manager = new MbaManager().init(template, directive);
        manager.render(model);
        var renderedDom = manager.getRenderedDom();
    
        OnAttend(renderedDom.toString()).DEtreEgalA('<div class="list"><span id="begin"></span><div class="person">begin<a class="address"></a>end</div><div class="person">begin<a class="address"></a><a class="address"></a>end</div><span id="end"></span></div>');
    });  
    
     Ca('teste que le rendu multiplie les éléments avec modèle parent', function(){
        var template = new MbaDomFromString('<div class="list"><span id="begin"></span><a class="person"></a><span id="end"></span></div>');
        var directive = {'children': {'r00t' : '.person'}};
        var model = {'children' : [{}, {}]};
        
        var manager = new MbaManager().init(template, directive);
        manager.render(model);
        var renderedDom = manager.getRenderedDom();
    
        OnAttend(renderedDom.toString()).DEtreEgalA('<div class="list"><span id="begin"></span><a class="person"></a><a class="person"></a><span id="end"></span></div>');
    });
    
    Ca('teste la multiplication récursive avec deux listes au même niveau', function(){
        var template = new MbaDomFromString('<div class="root">list1<div class="list1"></div>end_list1<span></span>list2<div class="list2">begin<a class="subList"></a>end</div></div>');
        var directive = {'list1' : {'r00t' : '.list1'},
                         'list2' : {'r00t' : '.list2',
                                    'sublist' : {'r00t' : '.subList'}}};
        var model = {'list1' : [{}, {}],
                     'list2' : [{'sublist' : [{}, {}]}, 
                                {'sublist' : [{}]}]};
    
        var manager = new MbaManager().init(template, directive);
        manager.render(model);
        var renderedDom = manager.getRenderedDom();
    
        OnAttend(renderedDom.toString()).DEtreEgalA('<div class="root">list1<div class="list1"></div><div class="list1"></div>end_list1<span></span>list2<div class="list2">begin<a class="subList"></a><a class="subList"></a>end</div><div class="list2">begin<a class="subList"></a>end</div></div>');
    });  
    
    Ca('teste l\'ajout d\'éléments multipliés', function(){
        var template = new MbaDomFromString('<div class="list"><div class="person"></div></div>');
        var directive = {'r00t' : '.person'};
        var model = [{}, {}];
        var manager = new MbaManager().init(template, directive);
        manager.render(model);
        var renderedDom = manager.getRenderedDom();
        
        OnAttend(renderedDom.toString()).DEtreEgalA('<div class="list"><div class="person"></div><div class="person"></div></div>');
        
        model.push({});
        manager.render(model);
        
        OnAttend(renderedDom.toString()).DEtreEgalA('<div class="list"><div class="person"></div><div class="person"></div><div class="person"></div></div>');
    }); 
    
    Ca('teste l\'ajout d\'éléments multipliés récursivement', function(){
        var template = new MbaDomFromString('<div class="list"><span id="begin"></span><div class="person">begin<a class="address"></a>end</div><span id="end"></span></div>');
        var directive = {'r00t' : '.person',
                         'sub' : {'r00t' : '.address'}};
        var model = [{"sub" : []}, {"sub" : [{}]}];
        var manager = new MbaManager().init(template, directive);
        manager.render(model);
        var renderedDom = manager.getRenderedDom();
        
        OnAttend(renderedDom.toString()).DEtreEgalA('<div class="list"><span id="begin"></span><div class="person">beginend</div><div class="person">begin<a class="address"></a>end</div><span id="end"></span></div>');
        
        model[0].sub.push({});
        model[1].sub.push({});
        manager.render(model);
        
        OnAttend(renderedDom.toString()).DEtreEgalA('<div class="list"><span id="begin"></span><div class="person">begin<a class="address"></a>end</div><div class="person">begin<a class="address"></a><a class="address"></a>end</div><span id="end"></span></div>');
    });
    
    Ca('teste la suppression d\'éléments multipliés récursivement', function(){
        var template = new MbaDomFromString('<div class="list"><span id="begin"></span><div class="person">begin<a class="address"></a>end</div><span id="end"></span></div>');
        var directive = {'r00t' : '.person',
                         'sub' : {'r00t' : '.address'}};
        var model = [{"sub" : [{}]}, {"sub" : [{}, {}]}];
        var manager = new MbaManager().init(template, directive);
        manager.render(model);
        var renderedDom = manager.getRenderedDom();
        
        OnAttend(renderedDom.toString()).DEtreEgalA('<div class="list"><span id="begin"></span><div class="person">begin<a class="address"></a>end</div><div class="person">begin<a class="address"></a><a class="address"></a>end</div><span id="end"></span></div>');
        
        model[0].sub.pop();
        model[1].sub.pop();
        manager.render(model);
        
        OnAttend(renderedDom.toString()).DEtreEgalA('<div class="list"><span id="begin"></span><div class="person">beginend</div><div class="person">begin<a class="address"></a>end</div><span id="end"></span></div>');
    });
    
     Ca('teste la suppression d\'éléments multipliés modèle tableau puis l\'ajout', function(){
        var template = new MbaDomFromString('<div class="list"><span id="begin"></span><div class="person">begin<a class="address"></a>end</div><span id="end"></span></div>');
        var directive = {'r00t' : '.person',
                         'sub' : {'r00t' : '.address'}};
        var model = [{"sub" : [{}]}, {"sub" : [{}, {}]}];
        var manager = new MbaManager().init(template, directive);
        manager.render(model);
        var renderedDom = manager.getRenderedDom();
     
        model.pop();
        manager.render(model);
        model.push({"sub" : [{}]});

        manager.render(model);
        
        OnAttend(renderedDom.toString()).DEtreEgalA('<div class="list"><span id="begin"></span><div class="person">begin<a class="address"></a>end</div><div class="person">begin<a class="address"></a>end</div><span id="end"></span></div>');
    });  
 
    Ca('teste la suppression d\'éléments multipliés modèle tableau', function(){
        var template = new MbaDomFromString('<div class="list"><span id="begin"></span><div class="person">begin<a class="address"></a>end</div><span id="end"></span></div>');
        var directive = {'r00t' : '.person',
                         'sub' : {'r00t' : '.address'}};
        var model = [{sub : [{}]}, {sub : [{}, {}]}];
        var manager = new MbaManager().init(template, directive);
        manager.render(model);
        var renderedDom = manager.getRenderedDom();
        
        OnAttend(renderedDom.toString()).DEtreEgalA('<div class="list"><span id="begin"></span><div class="person">begin<a class="address"></a>end</div><div class="person">begin<a class="address"></a><a class="address"></a>end</div><span id="end"></span></div>');
     
        model.pop();
        manager.render(model);
        
        OnAttend(renderedDom.toString()).DEtreEgalA('<div class="list"><span id="begin"></span><div class="person">begin<a class="address"></a>end</div><span id="end"></span></div>');
    });
    
    function createMbaPropertyBinding(memberChain){
        checkType(memberChain, 'array', 'string');
        return new MbaPropertyBinding().init('', memberChain, new MbaTransf(), []);
    }
    
    Ca('test le tri des property binding', function(){
        var propertyBindings = [
            createMbaPropertyBinding(['persons2', 'name']),
            createMbaPropertyBinding(['persons2', 'vehicles2', 'brand']),
            createMbaPropertyBinding(['persons', 'name']),
            createMbaPropertyBinding(['persons', 'vehicles', 'category'])
        ];
        var manager = new MbaManager();
        manager._propertyBindings = propertyBindings;
        manager.createPropertyBindingTree();
        
        var sortedPropertyBindings = manager.getPropertyBindings();
        OnAttend(accessorString(sortedPropertyBindings[0])).DEtreEgalA('model.persons.name');
        OnAttend(accessorString(sortedPropertyBindings[1])).DEtreEgalA('model.persons2.name');
        OnAttend(accessorString(sortedPropertyBindings[2])).DEtreEgalA('model.persons.vehicles.category');
        OnAttend(accessorString(sortedPropertyBindings[3])).DEtreEgalA('model.persons2.vehicles2.brand');
    });
    
    Ca('test la création de l\'abre des property binding', function(){
        var propertyBindings = [
            createMbaPropertyBinding(['persons2', 'name']),
            createMbaPropertyBinding(['persons2', 'adresses', 'town']),
            createMbaPropertyBinding(['persons2', 'vehicles2', 'brand']),
            createMbaPropertyBinding(['persons', 'name']),
            createMbaPropertyBinding(['persons', 'vehicles', 'category'])
        ];
        var manager = new MbaManager();
        manager._propertyBindings = propertyBindings;
        manager.createPropertyBindingTree();
        
        var propertyBindingTree = manager.getPropertyBindingTree();
        OnAttend(accessorStringForRoute(propertyBindingTree, [0])).DEtreEgalA('model.persons.name');
        OnAttend(accessorStringForRoute(propertyBindingTree, [0, 0])).DEtreEgalA('model.persons.vehicles.category');
        OnAttend(accessorStringForRoute(propertyBindingTree, [1])).DEtreEgalA('model.persons2.name');
        OnAttend(accessorStringForRoute(propertyBindingTree, [1, 0])).DEtreEgalA('model.persons2.adresses.town');
        OnAttend(accessorStringForRoute(propertyBindingTree, [1, 1])).DEtreEgalA('model.persons2.vehicles2.brand');
    });
    
     Ca('test l\'initialisation des relativeAccessor dans l\'arbre des property binding', function(){
         var propertyBindings = [
            createMbaPropertyBinding(['persons2', 'name']),
            createMbaPropertyBinding(['persons2', 'adresses', 'town']),
            createMbaPropertyBinding(['persons2', 'vehicles2', 'brand']),
            createMbaPropertyBinding(['persons', 'name']),
            createMbaPropertyBinding(['persons', 'vehicles', 'category'])
        ];
        var manager = new MbaManager();
        manager._propertyBindings = propertyBindings;
        manager.createPropertyBindingTree();
        
        var propertyBindingTree = manager.getPropertyBindingTree();
        OnAttend(relativeAccessorStringForRoute(propertyBindingTree, [0])).DEtreEgalA('model.persons');
        OnAttend(relativeAccessorStringForRoute(propertyBindingTree, [0, 0])).DEtreEgalA('vehicles');
        OnAttend(relativeAccessorStringForRoute(propertyBindingTree, [1])).DEtreEgalA('model.persons2');
        OnAttend(relativeAccessorStringForRoute(propertyBindingTree, [1, 0])).DEtreEgalA('adresses');
        OnAttend(relativeAccessorStringForRoute(propertyBindingTree, [1, 1])).DEtreEgalA('vehicles2');
    });
    
    function targetDomElementIdsForRoute(tree, route){
        var node = nodeForRoute(tree, route);
        return node.getTargetDomElementIds().join(',');
    };
    
    function createMbaPropertyBindingWithSelector(selector, memberChain){
        checkType(memberChain, 'array', 'string');
        return new MbaPropertyBinding().init(selector, memberChain, new MbaTransf(), []);
    }
    
     Ca('teste l\'ajout des élément de dom cible dans les propertyBindingNode', function(){
         var template = new MbaDomFromString('<a class="person"></a><div class="person"><span class="vehicle"></span></div>');
         var propertyBindings = [
             createMbaPropertyBindingWithSelector('.person', ['persons']),
             createMbaPropertyBindingWithSelector('.vehicle', ['persons', 'vehicles'])
         ];
         var manager = new MbaManager();
         manager._domMultipliers = [];
         manager._propertyBindings = propertyBindings;
         manager.setTemplate(template);
         manager.createPropertyBindingTree();   
         manager.linkPropertyBindingTreeToTemplate();
        
         var propertyBindingTree = manager.getPropertyBindingTree();
         OnAttend(targetDomElementIdsForRoute(propertyBindingTree, [0]))
             .DEtreEgalA('1,2');
         OnAttend(targetDomElementIdsForRoute(propertyBindingTree, [0, 0]))
             .DEtreEgalA('3');
    });
    
    Ca('teste le rendu avec une directive minimale sans root', function(){
        var template = new MbaDomFromString('<div id="root"><div id="toto">toto</div></div><div id="stuff"></div>');
        var directive = {'name': '#toto'};
        var model = {name: 'tutu'};
        
        var manager = new MbaManager().init(template, directive);
        manager.render(model);
        var renderedDom = manager.getRenderedDom();
        
        OnAttend(renderedDom.toString()).DEtreEgalA('<div id="root"><div id="toto">tutu</div></div><div id="stuff"></div>');
    });
    
    //TODO : qu'est ce que cela donne quand on a plusieurs transformations dans une directive "name" : "#toto, #toto@attr" ?
    //comment est l'arbre des propertyBinding ?
}
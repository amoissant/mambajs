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
            case MbaBindingCollectionNode:
                var firstBinding = object.getBindings()[0];
                return object.getModelAccessor()+'.'+firstBinding.getPropertyAccessor();
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
        OnAttend(actionBindings[0].getActionAccessorString()).DEtreEgalA('model.toto');
        
        OnAttend(actionBindings[1].getSelector()).DEtreEgalA('button');
        OnAttend(actionBindings[1].getActionAccessorString()).DEtreEgalA('model.coordinates.delete');
        
        OnAttend(actionBindings[2].getSelector()).DEtreEgalA('.del');
        OnAttend(actionBindings[2].getActionAccessorString()).DEtreEgalA('model.coordinates.delete');
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
    
     Ca('teste la multiplication du dom, directive minimale avec root, modèle tableau', function(){
        var template = new MbaDomFromString('<div id="root"><div class="toto">toto</div></div><div id="stuff"></div>');
        var directive = {'r00t': '.toto'};
        var model = [{}];
        
        var manager = new MbaManager().init(template, directive);
        manager.render(model);
        var renderedDom = manager.getRenderedDom();
    
        OnAttend(renderedDom.toString()).DEtreEgalA('<div id="root"><div class="toto">toto</div></div><div id="stuff"></div>');
    });
    
    Ca('teste la multiplication du dom, directive minimale avec root, modèle tableau vide', function(){
        var template = new MbaDomFromString('<div id="root"><div class="toto">toto</div></div><div id="stuff"></div>');
        var directive = {'r00t': '.toto'};
        var model = [];
        
        var manager = new MbaManager().init(template, directive);
        manager.render(model);
        var renderedDom = manager.getRenderedDom();
    
        OnAttend(renderedDom.toString()).DEtreEgalA('<div id="root"></div><div id="stuff"></div>');
    });
    
    Ca('teste la multiplication du dom, directive minimale avec root, modèle objet', function(){
        var template = new MbaDomFromString('<div id="root"><div class="toto">toto</div></div><div id="stuff"></div>');
        var directive = {'r00t': '.toto'};
        var model = {};
        
        var manager = new MbaManager().init(template, directive);
        manager.render(model);
        var renderedDom = manager.getRenderedDom();
    
        OnAttend(renderedDom.toString()).DEtreEgalA('<div id="root"><div class="toto">toto</div></div><div id="stuff"></div>');
    });
    
    Ca('teste la multiplication du dom, directive minimale avec root, modèle null', function(){
        var template = new MbaDomFromString('<div id="root"><div class="toto">toto</div></div><div id="stuff"></div>');
        var directive = {'r00t': '.toto'};
        var model = null;
        
        var manager = new MbaManager().init(template, directive);
        manager.render(model);
        var renderedDom = manager.getRenderedDom();
    
        OnAttend(renderedDom.toString()).DEtreEgalA('<div id="root"></div><div id="stuff"></div>');
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
    
    Ca('teste l\'ajout d\'éléments multipliés : d\'un modèle null à un objet', function(){
        var template = new MbaDomFromString('<div class="list"><div class="person"></div></div>');
        var directive = {'r00t' : '.person'};
        var model = null;
        var manager = new MbaManager().init(template, directive);
        manager.render(model);
        var renderedDom = manager.getRenderedDom();
        
        OnAttend(renderedDom.toString()).DEtreEgalA('<div class="list"></div>');
        
        manager.render({});
        
        OnAttend(renderedDom.toString()).DEtreEgalA('<div class="list"><div class="person"></div></div>');
    }); 
    
    Ca('teste l\'ajout d\'éléments multipliés avec modèle tableau', function(){
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
    
    Ca('teste l\'ajout d\'éléments multipliés récursivement avec modèle tableau', function(){
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
    
    Ca('teste la suppression d\'éléments multipliés : d\'un modèle objet à null', function(){
        var template = new MbaDomFromString('<div class="list"><div class="person"></div></div>');
        var directive = {'r00t' : '.person'};
        var model = {};
        var manager = new MbaManager().init(template, directive);
        manager.render(model);
        var renderedDom = manager.getRenderedDom();
        
        OnAttend(renderedDom.toString()).DEtreEgalA('<div class="list"><div class="person"></div></div>');
        
        manager.render(null);
        
        OnAttend(renderedDom.toString()).DEtreEgalA('<div class="list"></div>');
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
        manager.createBindingTree();
        
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
        manager.createBindingTree();
        
        var propertyBindingTree = manager.getBindingTree();
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
        manager.createBindingTree();
        
        var propertyBindingTree = manager.getBindingTree();
        OnAttend(relativeAccessorStringForRoute(propertyBindingTree, [0])).DEtreEgalA('model.persons');
        OnAttend(relativeAccessorStringForRoute(propertyBindingTree, [0, 0])).DEtreEgalA('vehicles');
        OnAttend(relativeAccessorStringForRoute(propertyBindingTree, [1])).DEtreEgalA('model.persons2');
        OnAttend(relativeAccessorStringForRoute(propertyBindingTree, [1, 0])).DEtreEgalA('adresses');
        OnAttend(relativeAccessorStringForRoute(propertyBindingTree, [1, 1])).DEtreEgalA('vehicles2');
    });
    
    function targetDomElementIdsForRoute(tree, route, bindingIndex){
        var node = nodeForRoute(tree, route);
        var binding = node.getBindings()[bindingIndex];
        return binding.getTargetDomElementIds().join(',');
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
         manager.createBindingTree();   
         manager.linkBindingTreeToTemplate();
        
         var propertyBindingTree = manager.getBindingTree();
         OnAttend(targetDomElementIdsForRoute(propertyBindingTree, [0], 0))
             .DEtreEgalA('1,2');
         OnAttend(targetDomElementIdsForRoute(propertyBindingTree, [0, 0], 0))
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
    
    Ca('teste la multiplication du dom, directive minimale avec root, modèle objet', function(){
        var template = new MbaDomFromString('<div id="root"><div class="toto">toto</div></div><div id="stuff"></div>');
        var directive = {'r00t': '.toto'};
        var model = {};
        
        var manager = new MbaManager().init(template, directive);
        manager.render(model);
        var renderedDom = manager.getRenderedDom();
    
        OnAttend(renderedDom.toString()).DEtreEgalA('<div id="root"><div class="toto">toto</div></div><div id="stuff"></div>');
    });
 
    Ca('teste le rendu avec une directive minimale avec root, modèle objet', function(){
        var template = new MbaDomFromString('<div id="root"><div class="toto">toto</div></div><div id="stuff"></div>');
        var directive = {'r00t': '.toto', 
                         'name': '.toto'};
        var model = {name: 'tutu'};
        
        var manager = new MbaManager().init(template, directive);
        manager.render(model);
        var renderedDom = manager.getRenderedDom();
        
        OnAttend(renderedDom.toString()).DEtreEgalA('<div id="root"><div class="toto">tutu</div></div><div id="stuff"></div>');
    });
    
    Ca('teste que le rendu conserve les eléments de dom', function(){
        var template = new MbaDomFromString('<div class="person">toto</div>');
        var directive = {'r00t': '.person', 
                         'name': '.person'};
        var model = {name: 'tutu'};
        var manager = new MbaManager().init(template, directive);
        
        manager.render(model);
        var renderedDom = manager.getRenderedDom();
        var person1 = renderedDom.findOneMax('.person').getElement();        
        OnAttend(person1.innerHTML).DEtreEgalA('tutu');
        
        model.name = 'titi';
        manager.render(model);
        var renderedDom = manager.getRenderedDom();
        var person2 = renderedDom.findOneMax('.person').getElement();
        OnAttend(person2.innerHTML).DEtreEgalA('titi');
        
        OnAttend(person1).DEtreEgalA(person2);
    });
    
    Ca('teste le rendu d\'une propriété dans deux éléments de dom', function(){
        var template = new MbaDomFromString('<div></div><span></span>');
        var directive = {'name': 'div, span'};
        var model = {name: 'toto'};
        var manager = new MbaManager().init(template, directive);
        
        manager.render(model);
        OnAttend(manager.getRenderedDom().toString()).DEtreEgalA('<div>toto</div><span>toto</span>');
    });
    
    Ca('teste le rendu d\'une propriété avec modèle tableau', function(){
        var template = new MbaDomFromString('<div><span></span></div>');
        var directive = {'r00t' : 'span', 'name': 'span'};
        var model = [{name: 'toto'}, {name: 'titi'}];
        var manager = new MbaManager().init(template, directive);
        
        manager.render(model);
        OnAttend(manager.getRenderedDom().toString()).DEtreEgalA('<div><span>toto</span><span>titi</span></div>');
    });
    
    Ca('teste le rendu d\'une propriété avec modèle tableau récursivement', function(){
        var template = new MbaDomFromString('<div><span></span><a></a></div>');
        var directive = {'r00t' : 'div', 'name': 'span', 'sub' : {'r00t' : 'a', 'name' : 'a'}};
        var model = [{name: 'toto', sub : {name : 'tata'}}, 
                     {name: 'titi', sub : {name : 'tutu'}}];
        var manager = new MbaManager().init(template, directive);
        
        manager.render(model);
        OnAttend(manager.getRenderedDom().toString()).DEtreEgalA('<div><span>toto</span><a>tata</a></div><div><span>titi</span><a>tutu</a></div>');
    });
    
    Ca('teste le rendu d\'une propriété avec modèle tableau récursivement, enfant sans r00t', function(){
        var template = new MbaDomFromString('<div><span></span><a></a></div>');
        var directive = {'r00t' : 'div', 'name': 'span', 'sub' : {'name' : 'a'}};
        var model = [{name: 'toto', sub : {name : 'tata'}}, 
                     {name: 'titi', sub : {name : 'tutu'}}];
        var manager = new MbaManager().init(template, directive);
        
        manager.render(model);
        OnAttend(manager.getRenderedDom().toString()).DEtreEgalA('<div><span>toto</span><a>tata</a></div><div><span>titi</span><a>tutu</a></div>');
    });
    
    Ca('teste le rendu d\'une propriété dans deux éléments de dom avec modèle tableau', function(){
        var template = new MbaDomFromString('<div><span></span><a></a></div>');
        var directive = {'r00t' : 'div', 'name': 'span, a'};
        var model = [{name: 'toto'}, {name: 'titi'}];
        var manager = new MbaManager().init(template, directive);
        
        manager.render(model);
        OnAttend(manager.getRenderedDom().toString()).DEtreEgalA('<div><span>toto</span><a>toto</a></div><div><span>titi</span><a>titi</a></div>');
    });
    
    Ca('lève une exception si pas de r00t et modèle tableau', function(){
        var template = new MbaDomFromString('<a></a>');
        var directive = {'name': 'a'};
        var model = [{name: 'toto'}, {name: 'titi'}];
        var manager = new MbaManager().init(template, directive);
        
        try{ manager.render(model); }
        catch (e){ return OnAttend(e instanceof MbaError).DEtreVrai(); }
        
        Echec();
    });
    
    function createRoute(memberChain, indexes){
        var accessorChain = new MbaAccessorChain2().initWithRootModelAccessorFromMemberChain(memberChain);
        return new MbaRoute2().initFromAccessorAndIndexes(accessorChain, indexes)
    };
    
    Ca('rafraichit le dom pour la route du sous modèle objet', function(){
        var template = new MbaDomFromString('<div><a></a></div>');
        var directive = {'name': 'div@name', 'sub' : {'prop' : 'a'}};
        var model = {name: 'toto', sub: {prop : 'titi'}};
        var manager = new MbaManager().init(template, directive);
        
        manager.render(model);
        OnAttend(manager.getRenderedDom().toString()).DEtreEgalA('<div name="toto"><a>titi</a></div>');
        
        model.name = 'TOTO';
        model.sub.prop = 'TITI';
        var route = createRoute(['sub'], [undefined, undefined]);
        manager.refreshForRoute(route);
        OnAttend(manager.getRenderedDom().toString()).DEtreEgalA('<div name="toto"><a>TITI</a></div>');
    });
    
    Ca('ajoute et rafraichit le dom pour la route du sous modèle tableau', function(){
        var template = new MbaDomFromString('<div><a></a></div>');
        var directive = {'name': 'div@name', 'sub' : {'r00t': 'a', 'prop': 'a'}};
        var model = {name: 'toto', sub: [{prop : 'titi'}]};
        var manager = new MbaManager().init(template, directive);
        
        manager.render(model);
        OnAttend(manager.getRenderedDom().toString()).DEtreEgalA('<div name="toto"><a>titi</a></div>');
        
        model.name = 'TOTO';
        model.sub[0].prop = 'TITI';
        model.sub.push({prop : 'TUTU'});
        var route = createRoute(['sub'], [undefined, undefined]);
        manager.refreshForRoute(route);
        OnAttend(manager.getRenderedDom().toString()).DEtreEgalA('<div name="toto"><a>TITI</a><a>TUTU</a></div>');
    });
    
    Ca('supprime et rafraichit le dom pour la route du sous modèle tableau', function(){
        var template = new MbaDomFromString('<div><a></a></div>');
        var directive = {'name': 'div@name', 'sub' : {'r00t': 'a', 'prop': 'a'}};
        var model = {name: 'toto', sub: [{prop : 'titi'}, {prop: 'tutu'}]};
        var manager = new MbaManager().init(template, directive);
        
        manager.render(model);
        OnAttend(manager.getRenderedDom().toString()).DEtreEgalA('<div name="toto"><a>titi</a><a>tutu</a></div>');
        
        model.name = 'TOTO';
        model.sub[0].prop = 'TITI';
        model.sub.pop();
        var route = createRoute(['sub'], [undefined, undefined]);
        manager.refreshForRoute(route);
        OnAttend(manager.getRenderedDom().toString()).DEtreEgalA('<div name="toto"><a>TITI</a></div>');
    });
    
    Ca('rafraichit le dom seulement pour la route d\'un élément du sous modèle tableau', function(){
        var template = new MbaDomFromString('<div><a></a></div>');
        var directive = {'name': 'div@name', 'sub' : {'r00t': 'a', 'prop': 'a'}};
        var model = {name: 'toto', sub: [{prop : 'titi'}]};
        var manager = new MbaManager().init(template, directive);
        
        manager.render(model);
        OnAttend(manager.getRenderedDom().toString()).DEtreEgalA('<div name="toto"><a>titi</a></div>');
        
        model.name = 'TOTO';
        model.sub[0].prop = 'TITI';
        model.sub.push({prop : 'TUTU'});//won't be rendered
        var route = createRoute(['sub'], [undefined, 0]);
        manager.refreshForRoute(route);
        OnAttend(manager.getRenderedDom().toString()).DEtreEgalA('<div name="toto"><a>TITI</a></div>');
    });    
    
    function recursiveRefreshTemplate(){
        return new MbaDomFromString('<div><span><a></a></span></div>');
    }
    
    function recursiveRefreshDirective(){
        return {'r00t' : 'div',
                'name': 'div@name',
                'sub' : {'r00t': 'span', 
                         'prop': 'span@id',
                         'subsub': {'r00t': 'a', 
                                    'prop': 'a'}}};
    }
    
    function recursiveRefreshArrayModel(){
        return [{name: '0', 
                 sub: [{prop : '0.0',
                        subsub: [{prop: '0.0.0'}]},
                       {prop : '0.1',
                        subsub: [{prop: '0.1.0'}]}]},
                {name: '1',
                 sub: []}];
    }
    
    function recursiveRefreshRenderResult(){
        return '<div name="0"><span id="0.0"><a>0.0.0</a></span><span id="0.1"><a>0.1.0</a></span></div><div name="1"></div>';
    }
    
    function updateRecursiveRefreshArrayModel(model){
        model[0] = {name: '_0', 
                    sub: [{prop : '_0.0',
                           subsub: []},
                          {prop : '_0.1',
                           subsub: [{prop: '_0.1.0'}, 
                                    {prop: '_0.1.1'}]}]};
        model[1] = {name: '_1',
                    sub: [{prop : '_1.0',
                           subsub: []}]};
    }
    
   Ca('rafraichit le dom récursivement, modèle tableau, route 0.1', function(){
        var template = new MbaDomFromString('<div><span><a></a></span></div>');
        var directive = recursiveRefreshDirective();
        var model = recursiveRefreshArrayModel();
        
        var manager = new MbaManager().init(template, directive);        
        manager.render(model);
        OnAttend(manager.getRenderedDom().toString()).DEtreEgalA(recursiveRefreshRenderResult());
        
        updateRecursiveRefreshArrayModel(model);
       
        var route = createRoute(['sub'], [0, 1]);
        manager.refreshForRoute(route);
        OnAttend(manager.getRenderedDom().toString()).DEtreEgalA('<div name="0"><span id="0.0"><a>0.0.0</a></span><span id="_0.1"><a>_0.1.0</a><a>_0.1.1</a></span></div><div name="1"></div>');
    });
    
    Ca('rafraichit le dom récursivement, modèle tableau, route 0.undefined', function(){
        var template = recursiveRefreshTemplate();
        var directive = recursiveRefreshDirective();
        var model = recursiveRefreshArrayModel();
        
        var manager = new MbaManager().init(template, directive);        
        manager.render(model);
        OnAttend(manager.getRenderedDom().toString()).DEtreEgalA(recursiveRefreshRenderResult());
        
        updateRecursiveRefreshArrayModel(model);

        var route = createRoute(['sub'], [0, undefined]);
        manager.refreshForRoute(route);
        OnAttend(manager.getRenderedDom().toString()).DEtreEgalA('<div name="0"><span id="_0.0"></span><span id="_0.1"><a>_0.1.0</a><a>_0.1.1</a></span></div><div name="1"></div>');
    });
    
    function recursiveRefreshModel(){
        return {name: '0', 
                sub: [{prop : '0.0',
                       subsub: [{prop: '0.0.0'}]},
                      {prop : '0.1',
                       subsub: [{prop: '0.1.0'}]}]};
    }
    
    Ca('rafraichit le dom récursivement, modèle objet, route undefined.0', function(){
        var template = recursiveRefreshTemplate();
        var directive = recursiveRefreshDirective();
        var model = recursiveRefreshModel();
        
        var manager = new MbaManager().init(template, directive);        
        manager.render(model);
        OnAttend(manager.getRenderedDom().toString()).DEtreEgalA('<div name="0"><span id="0.0"><a>0.0.0</a></span><span id="0.1"><a>0.1.0</a></span></div>');
    
        model.name = '_0';
        model.sub[0].prop = '_0.0';
        model.sub[0].subsub[0].prop = '_0.0.0';
        model.sub[0].subsub.push({prop : '_0.0.1'});
        model.sub[1].prop = '_1';
        
        var route = createRoute(['sub'], [undefined, 0]);
        manager.refreshForRoute(route);
        OnAttend(manager.getRenderedDom().toString()).DEtreEgalA('<div name="0"><span id="_0.0"><a>_0.0.0</a><a>_0.0.1</a></span><span id="0.1"><a>0.1.0</a></span></div>');
    });     
    
    Ca('rafraichit le dom récursivement, modèle objet, route undefined.1.1', function(){
        var template = recursiveRefreshTemplate();
        var directive = recursiveRefreshDirective();
        var model = recursiveRefreshModel();
        model.sub[1].subsub.push({prop: '0.1.1'});
        
        var manager = new MbaManager().init(template, directive);        
        manager.render(model);
        OnAttend(manager.getRenderedDom().toString()).DEtreEgalA('<div name="0"><span id="0.0"><a>0.0.0</a></span><span id="0.1"><a>0.1.0</a><a>0.1.1</a></span></div>');
    
        model.name = '_0';
        model.sub[0].prop = '_0.0';
        model.sub[0].subsub[0].prop = '_0.0.0';
        model.sub[0].subsub.push({prop : '_0.0.1'});
        model.sub[1].prop = '_0.1';
        model.sub[1].subsub[0].prop = '_0.1.0';
        model.sub[1].subsub[1].prop = '_0.1.1';
        
        var route = createRoute(['sub', 'subsub'], [undefined, 1, 1]);
        manager.refreshForRoute(route);
        OnAttend(manager.getRenderedDom().toString()).DEtreEgalA('<div name="0"><span id="0.0"><a>0.0.0</a></span><span id="0.1"><a>0.1.0</a><a>_0.1.1</a></span></div>');
    }); 
  
    Ca('appelle une méthode sur l\'évènement donné', function(){
        var template = new MbaDomFromString('<a></a>');

        var directive = {'name': 'a', '/toUpper' : 'a->click'};
        var model = {name: 'toto', toUpper: function(){ 
            this.name = this.name.toUpperCase();
        }};
        var manager = new MbaManager().init(template, directive);
        
        manager.render(model);
        var renderedDom = manager.getRenderedDom();
        var a = renderedDom.selectOneMax('a');
        a.dispatchEvent(new Event('click'));
        
        //TODO décommenter une fois rafraichissement ok
        //OnAttend(renderedDom.toString()).DEtreEgalA('<a>TOTO</a>');
        OnAttend(model.name).DEtreEgalA('TOTO');
    });
 
    //TODO gérer quand un tableau à multiplier est null
    
    //tester quand une action ajoute/supprime un modèle dans un tableau
    //refreshForRoute doit appeler les dom multiplier + appliquer les bindings
    
   //TODO rafraichir le modèle avec la nouvelle valeur sur l'évènement input$value->blur
}

var testMbaV2 = function() {

    MBA_DI.bind(DirectiveParser).to(DirectiveParser);
    
    function renderIntoRoot(model, html, directive){
        var root = document.createElement('div');
        root.innerHTML = html;
        var mamba = new Mamba(model, root.childNodes, directive);
        mamba.setOptions({debug: false});
        mamba.render(); 
        return root;
    }
    
    function runWithSpyingConsole(somethingToRun){
        var consoleContent = [];
        var consoleLog = console.log;
        var restoreConsoleLog = function(){
            console.log = consoleLog;
        };
        var spyConsoleLog = function(){
            pushAll(consoleContent, arguments);
            consoleLog.apply(this, arguments);
        };
        console.log = spyConsoleLog;
        try{
            somethingToRun();
        }
        catch(e){}
        restoreConsoleLog();
        return consoleContent.join('');
    }; 
    
	Ca('teste que toArray() encapsule un objet dans un tableau ', function() {
		var obj = 'toto';
		var res = toArray(obj);

		OnAttend($.isArray(obj)).DEtreFaux();
		OnAttend($.isArray(res)).DEtreVrai();
		OnAttend(res.length).DEtreEgalA(1);
		OnAttend(res[0]).DEtre(obj);
	});

	Ca(	'teste que toArray() retourne le paramètre si celui-ci est un tableau ',
		function() {
			var array = [ 'toto', 'tata' ];
			var res = toArray(array);

			OnAttend($.isArray(array)).DEtreVrai();
			OnAttend($.isArray(res)).DEtreVrai();
			OnAttend(res.length).DEtreEgalA(2);
			OnAttend(res).DEtre(array);
		});

	Ca('teste domToString sur du dom', function() {
		var domString = '<div id="root"></div>';
		var dom = stringToDom(domString)[0];
		OnAttend(domToString(dom)).DEtreEgalA(domString);
	});

	Ca('teste domToString sur un tableau', function() {
		var domString = '<div id="root"></div>';
		var dom = stringToDom(domString)[0];
		var domJQuery = $(domString).get(0);
		var domArray = [ dom, domJQuery ];
		OnAttend(domToString(domArray)).DEtreEgalA(domString + domString);
	});

	Ca(	'teste l\'initialisation d\'une instance de la classe MbaDom. ',
		function() {
			var dom = new MbaDomFromString('<div id="toto"></div><span id="tata"></span>');

			OnAttend(dom.getElements().length).DEtreEgalA(2);
			OnAttend(isDomSet(dom.getElements())).DEtreVrai();
		});

	Ca('teste MbaDom.toString() ', function() {
		var domString = '<div id="toto"></div><span id="tata"></span>';
		var dom = new MbaDomFromString(domString);
		var res = dom.toString();
		
		OnAttend(res).DEtreEgalA(domString);
	});

	Ca('teste Mbadom.find() ', function() {
		var dom = new MbaDomFromString('<div id="toto"></div><span id="tata"></span>');
	
		var toto = dom.find('#toto');
		
		OnAttend(toto instanceof MbaDom).DEtreVrai();
		OnAttend(toto.getElements()[0].id).DEtreEgalA('toto');
	});

	Ca('teste MbaDom.isEmpty() ', function() {
		var dom = new MbaDomFromString('<div id="toto"></div><span id="tata"></span>');
	
		var tutu = dom.find('#tutu');
		var tata = dom.find('#tata');
		
		OnAttend(tutu.isEmpty()).DEtreVrai();
		OnAttend(tata.isEmpty()).DEtreFaux();
	});

	Ca('teste que findInTemplate() accepte les selecteurs css'
			+ ' et retourne un elément de dom', function() {
		var template = new MbaDomFromString('<div id="toto"></div><span id="tata"></span>');
		var domElement = template.selectOneMax('#toto');

		OnAttend(domElement).DeNePasEtreNull();
		OnAttend(domElement.id).DEtreEgalA('toto');
	});

	Ca(	'teste que findInTemplate() retourne le même '
				+ 'objet que celui du template si le template est un dom.',
		function() {
			var template = '<div id="toto"></div><span id="tata"></span>';
			var dom = stringToDom(template);
			dom[1].setAttribute('customattr', 'I\'m tata');
            var mbaDom = new MbaDom(dom);
			var domElement = mbaDom.selectOneMax('#tata');

			OnAttend(domElement).DeNePasEtreNull();
			OnAttend(domElement.id).DEtreEgalA('tata');
			OnAttend(domElement.getAttribute('customattr'))
					.DEtreEgalA('I\'m tata');
		});

	Ca('teste que findInTemplate() accepte les selecteurs css'
			+ ' et peut retourner plusieurs eléments de dom', function() {
		var template = '<div id="toto" class="tutu"></div>'
				+ '<span id="tata" class="tutu"></span>';
		template = new MbaDomFromString(template);
		var domElements = template.select('.tutu');
		OnAttend(domElements).DeNePasEtreNull();
		OnAttend(isDomSet(domElements)).DEtreVrai();
		OnAttend(domElements.length).DEtreEgalA(2);
	});

	Ca('teste que findInTemplate() retourne l\'élément voulu même si celui-ci '
			+ 'est à la racine', function() {
		var template = new MbaDomFromString('<div id="root"><div id="toto"></div>');
		var root = template.selectOneMax("#root");
		var toto = template.selectOneMax("#toto");

		OnAttend(root).DeNePasEtreNull();
		OnAttend(root.id).DEtreEgalA('root');
		OnAttend(toto).DeNePasEtreNull();
		OnAttend(toto.id).DEtreEgalA('toto');
	});

	Ca(	'teste que findInTemplate() peut trouver un élément dans un tableau',
		function() {
			var template = new MbaDomFromString('<div id="root"><div id="root2">');

			var root = template.selectOneMax('#root');
			OnAttend(root.id).DEtreEgalA('root');

			var root2 = template.selectOneMax('#root2');
			OnAttend(root2.id).DEtreEgalA('root2');
		});

	Ca(	'teste que findInTemplate() peut trouver plusieurs élements',
		function() {
			var template = new MbaDomFromString('<div id="root">'
					+ '<div id="toto1"></div>' + '<div id="toto2"></div>'
					+ '</div>');
			var res = template.select('#toto1, #toto2');
			OnAttend(isDomSet(res)).DEtreVrai();
			OnAttend(res.length).DEtreEgalA(2);
			OnAttend(res[0].id).DEtreEgalA('toto1');
			OnAttend(res[1].id).DEtreEgalA('toto2');
		});

	Ca('teste que findInTemplate() peut retourner une sous-partie des '
			+ 'éléments à la racine', function() {
		var template = new MbaDomFromString('<div id="toto"></div>'
				+ '<div id="tata"></div>' + '<div id="titi"></div>'
				+ '<div id="tutu"></div>');

		var res = template.select('#toto, #tata, #titi');

		OnAttend(isDomSet(res)).DEtreVrai();
		OnAttend(res.length).DEtreEgalA(3);
		OnAttend(res[0].id).DEtreEgalA('toto');
		OnAttend(res[1].id).DEtreEgalA('tata');
		OnAttend(res[2].id).DEtreEgalA('titi');
	});
        
    Ca('teste que findInTemplate ne modifie pas la position des éléments dans le dom', function(){
        var htmlString = '<div id="root"><div id="first"></div><div id="second"></div><div id="third"></div></div>';
        var html = stringToDom(htmlString);
        var second = html[0].childNodes[1];
        var found = new MbaDomSingle(second).select('#second');
        
        OnAttend(found.length).DEtreEgalA(1);
        OnAttend(found[0]).DEtreEgalA(second);
        OnAttend(new MbaDom(html).toString()).DEtreEgalA(htmlString);
    });
        
	Ca('teste que addIdToDom() ajoute un numéro unique à chaque élément de dom', function(){
		
		var template = '<div id="root"><span id="toto"></span><div id="tata"></div><div id="tutu"><span id="titi"></span></div></div>';
			
		var mbaDom = new MbaDomFromString(template);
		mbaDom.addMbaId();
		
		OnAttend(mbaDom.select('#root')[0]._mbaId).DEtreEgalA(0);
		OnAttend(mbaDom.select('#toto')[0]._mbaId).DEtreEgalA(1);
		OnAttend(mbaDom.select('#tata')[0]._mbaId).DEtreEgalA(2);
		OnAttend(mbaDom.select('#tutu')[0]._mbaId).DEtreEgalA(3);
		OnAttend(mbaDom.select('#titi')[0]._mbaId).DEtreEgalA(4);
		
	});
	
	Ca('test que MbaAnchor.getId() retourne un numéro unique pour un ou plusieurs éléments de dom', function(){
		var template = '<div id="root"><span id="toto"></span><div id="tata"></div><div id="tutu"><span id="titi"></span></div></div>';
			
		var mbaDom = new MbaDomFromString(template);
		mbaDom.addMbaId()
        
		OnAttend(mbaDom.getId()).DEtreEgalA('0');
		OnAttend(mbaDom.find('#root').getId()).DEtreEgalA('0');
		OnAttend(mbaDom.find('#tata').getId()).DEtreEgalA('2');
		OnAttend(mbaDom.find('#toto, #tutu').getId()).DEtreEgalA('1-3');
		OnAttend(mbaDom.find('#tutu, #toto').getId()).DEtreEgalA('1-3');
		OnAttend(mbaDom.find('#tutu, #toto, #tata').getId()).DEtreEgalA('1-2-3');
		OnAttend(mbaDom.find('#toto, #tata, #tutu').getId()).DEtreEgalA('1-2-3');
	});		
 	
 	Ca('teste que MbaDom.addMbaId ajoute une propriété _mbaId aux éléments de dom ainsi qu\'aux textNode', function(){
 		var mbaDom = new MbaDomFromString('<div id="root">toto<div id="tutu"></div></div><div id="root2"></div>');
 		mbaDom.addMbaId();
 		
 		var root = mbaDom.getElement(0);
 		var toto = root.childNodes.item(0);
 		var tutu = root.childNodes.item(1);
 		var root2 = mbaDom.getElement(1);
 		
 		OnAttend(root._mbaId).DEtreEgalA(0);
 		OnAttend(toto._mbaId).DEtreEgalA(1);
 		OnAttend(tutu._mbaId).DEtreEgalA(2);
 		OnAttend(root2._mbaId).DEtreEgalA(3);
 	})
 	
    function MbaTransfMock(){    
    }
    MbaTransfMock.prototype = new MbaTransf();
    MbaTransfMock.prototype.constructor = MbaTransfMock();
    
 	Ca('teste que MbaBindingText.getAnchor() retourne le seul textNode de l\'ancre', function(){
 		var template = new MbaDomFromString('<div id="toto">tutu</div>');
 		var binding = new MbaBindingText('#toto', new DefaultAnchorProvider(), new MbaTransfMock());
 		
 		var anchor = binding.getAnchor(template);
 		
 		OnAttend(anchor.getElement(0).textContent).DEtreEgalA('tutu');
 	});
 	
 	Ca('teste que MbaBindingText.getAnchor() lève une exception si l\'ancre contient un enfant non textNode', function(){
 		var template = new MbaDomFromString('<div id="toto"><div id="child"></div></div>');
 		var binding = new MbaBindingText('#toto', new DefaultAnchorProvider(), new MbaTransfMock());
 		try{
 			var anchor = binding.getAnchor(template);
 		}
 		catch(e){
 			return;
 		}
 		OnAttend(false).DEtreVrai();
 	});
 	
    Ca('teste MbaAccessorChain.merge', function(){
        var accessor1 = new MbaAccessor('tutu');
        var accessor2 = new MbaAccessor('toto');
        var accessor3 = new MbaAccessor('titi');
        var accessor4 = new MbaAccessor('tata');
        
        var chain1 = new MbaAccessorChain();
        chain1.prependAccessor(accessor1);
        chain1.prependAccessor(accessor2);
        OnAttend(chain1.match(['toto', 'tutu'])).DEtreVrai();
        
        var chain2 = new MbaAccessorChain();
        chain2.prependAccessor(accessor3);
        chain2.prependAccessor(accessor4);
        OnAttend(chain2.match(['tata', 'titi'])).DEtreVrai();
        
        chain2.prependAll(chain1);     
        OnAttend(chain2.match(['toto', 'tutu', 'tata', 'titi'])).DEtreVrai();
    });
    
    var minimalPrecursorWithRoot = {r00t: '#root', name: '#toto'};
    
    Ca('teste hasRoot() sur un precurseur avec root', function(){
        var directive = new MbaRootDirective(minimalPrecursorWithRoot, false);
        OnAttend(directive.hasRoot()).DEtreVrai();
    });
    
    function bindingsHaveOnlyOneTransformation(bindings){
        for(var i=0 ; i<bindings.length ; i++){
            if(bindings[i].getTransformations().length != 1)
                return false;
        }
        return true;
    };
    
	Ca('teste la création d\'une MbaDirective minimale avec root', 
       function(){
           var mbaDirective = new MbaRootDirective(minimalPrecursorWithRoot, false);
           OnAttend(mbaDirective.getRootSelector()).DEtreEgalA('#root');
           
           var bindings = mbaDirective.getBindings();
           OnAttend(bindings.length).DEtreEgalA(1);
           OnAttend(bindingsHaveOnlyOneTransformation(bindings)).DEtreVrai();
           OnAttend(bindings[0].getSelector()).DEtreEgalA('#toto');
	});
    
    Ca('teste les accesseurs de la MbaDirective minimale avec root', 
       function(){
           var mbaDirective = new MbaRootDirective(minimalPrecursorWithRoot, false);
           
           var directiveAccessorChain = mbaDirective.getAccessorChain();
           OnAttend(directiveAccessorChain.match([])).DEtreVrai();
           
           var bindingAccessorChain = mbaDirective.getBindings()[0].getTransformations()[0].getAccessorChain();
           OnAttend(bindingAccessorChain.match(['name'])).DEtreVrai();
	});
    
    var twoDirectivesPrecursorWithRoot = {r00t: '#root', name: '#toto', age: '#tutu'};
    
    Ca('teste la création d\'une MbaDirective avec deux directives avec root', 
       function(){
           var mbaDirective = new MbaRootDirective(twoDirectivesPrecursorWithRoot, false);
           OnAttend(mbaDirective.getRootSelector()).DEtreEgalA('#root');
           
           var bindings = mbaDirective.getBindings();
           OnAttend(bindings.length).DEtreEgalA(2);
           OnAttend(bindingsHaveOnlyOneTransformation(bindings)).DEtreVrai();
           OnAttend(bindings[0].getSelector()).DEtreEgalA('#toto');
           OnAttend(bindings[1].getSelector()).DEtreEgalA('#tutu');
	});
    
    Ca('teste les accesseurs de la MbaDirective avec deux directives avec root', 
       function(){
           var mbaDirective = new MbaRootDirective(twoDirectivesPrecursorWithRoot, false);
           
           var directiveAccessorChain = mbaDirective.getAccessorChain();
           OnAttend(directiveAccessorChain.match([])).DEtreVrai();
           
           var binding1AccessorChain = mbaDirective.getBindings()[0].getTransformations()[0].getAccessorChain();
           OnAttend(binding1AccessorChain.match(['name'])).DEtreVrai();
           
           var binding2AccessorChain = mbaDirective.getBindings()[1].getTransformations()[0].getAccessorChain();
           OnAttend(binding2AccessorChain.match(['age'])).DEtreVrai();
	});
    
    var twoSelectorsPrecursorWithRoot = {r00t: '#root', name: '#toto, #tutu'};
    
    Ca('teste la création d\'une MbaDirective avec deux selecteurs avec root', 
       function(){
           var mbaDirective = new MbaRootDirective(twoSelectorsPrecursorWithRoot, false);
           OnAttend(mbaDirective.getRootSelector()).DEtreEgalA('#root');
           
           var bindings = mbaDirective.getBindings();
           OnAttend(bindings.length).DEtreEgalA(2);
           OnAttend(bindingsHaveOnlyOneTransformation(bindings)).DEtreVrai();
           OnAttend(bindings[0].getSelector()).DEtreEgalA('#toto');
           OnAttend(bindings[1].getSelector()).DEtreEgalA('#tutu');
	});
    
    Ca('teste les accesseurs de la MbaDirective avec deux selecteurs avec root', 
       function(){
           var mbaDirective = new MbaRootDirective(twoSelectorsPrecursorWithRoot, false);
           
           var directiveAccessorChain = mbaDirective.getAccessorChain();
           OnAttend(directiveAccessorChain.match([])).DEtreVrai();
           
           var binding1AccessorChain = mbaDirective.getBindings()[0].getTransformations()[0].getAccessorChain();
           OnAttend(binding1AccessorChain.match(['name'])).DEtreVrai();
           
           var binding2AccessorChain = mbaDirective.getBindings()[1].getTransformations()[0].getAccessorChain();
           OnAttend(binding2AccessorChain.match(['name'])).DEtreVrai();
	});
    
    var twoLevelsPrecursorWithRoot = {r00t: '#root', name: '#toto', sub : {r00t: '#subRoot', age: '#tutu'}};
    
    Ca('teste la création d\'une MbaDirective sur deux niveaux avec root', 
       function(){
           var mbaDirective = new MbaRootDirective(twoLevelsPrecursorWithRoot, false);
           OnAttend(mbaDirective.getRootSelector()).DEtreEgalA('#root');
           
           var bindings = mbaDirective.getBindings();
           OnAttend(bindings.length).DEtreEgalA(1);
           OnAttend(bindingsHaveOnlyOneTransformation(bindings)).DEtreVrai();
           OnAttend(bindings[0].getSelector()).DEtreEgalA('#toto');
           
           var subDirectives = mbaDirective.getSubDirectives();
           OnAttend(subDirectives.length).DEtreEgalA(1);
           OnAttend(subDirectives[0].getRootSelector()).DEtreEgalA('#subRoot');
           
           var subBindings = subDirectives[0].getBindings();
           OnAttend(subBindings.length).DEtreEgalA(1);
           OnAttend(bindingsHaveOnlyOneTransformation(subBindings)).DEtreVrai();
           OnAttend(subBindings[0].getSelector()).DEtreEgalA('#tutu');
           
	});
    
    Ca('teste les accesseurs de la MbaDirective sur deux niveaux avec root', 
       function(){
           var mbaDirective = new MbaRootDirective(twoLevelsPrecursorWithRoot, false);
       
           var directiveAccessorChain = mbaDirective.getAccessorChain();
           OnAttend(directiveAccessorChain.match([])).DEtreVrai();
           
           var bindingAccessorChain = mbaDirective.getBindings()[0].getTransformations()[0].getAccessorChain();
           OnAttend(bindingAccessorChain.match(['name'])).DEtreVrai();
           
           var subDirective = mbaDirective.getSubDirectives()[0];
           var subDirectiveAccessorChain = subDirective.getAccessorChain();
           OnAttend(subDirectiveAccessorChain.match(['sub'])).DEtreVrai();
           
           var subBindingAccessorChain = subDirective.getBindings()[0].getTransformations()[0].getAccessorChain();
           OnAttend(subBindingAccessorChain.match(['sub', 'age'])).DEtreVrai();
    });
    
    var twoLevelsAndSubDirectivesPrecursorWithRoot = {r00t: '#root',
                                                      name: '#toto',
                                                      sub : [{r00t: '#subRoot1', age: '#tutu'},
                                                             {r00t: '#subRoot2', job: '#tata'}]};
    
    Ca('teste la création d\'une MbaDirective sur deux niveaux avec un tableau de sous-directives avec root', 
       function(){
           var mbaDirective = new MbaRootDirective(twoLevelsAndSubDirectivesPrecursorWithRoot, false);
           OnAttend(mbaDirective.getRootSelector()).DEtreEgalA('#root');
           
           var bindings = mbaDirective.getBindings();
           OnAttend(bindings.length).DEtreEgalA(1);
           OnAttend(bindingsHaveOnlyOneTransformation(bindings)).DEtreVrai();
           OnAttend(bindings[0].getSelector()).DEtreEgalA('#toto');
           
           var subDirectives = mbaDirective.getSubDirectives();
           OnAttend(subDirectives.length).DEtreEgalA(2);
           OnAttend(subDirectives[0].getRootSelector()).DEtreEgalA('#subRoot1');
           OnAttend(subDirectives[1].getRootSelector()).DEtreEgalA('#subRoot2');
           
           var subBindings1 = subDirectives[0].getBindings();
           OnAttend(subBindings1.length).DEtreEgalA(1);
           OnAttend(bindingsHaveOnlyOneTransformation(subBindings1)).DEtreVrai();
           OnAttend(subBindings1[0].getSelector()).DEtreEgalA('#tutu');
           
           var subBindings2 = subDirectives[1].getBindings();
           OnAttend(subBindings2.length).DEtreEgalA(1);
           OnAttend(bindingsHaveOnlyOneTransformation(subBindings2)).DEtreVrai();
           OnAttend(subBindings2[0].getSelector()).DEtreEgalA('#tata');           
	});
    
    Ca('teste les accesseurs de le MbaDirective sur deux niveaux avec un tableau de sous-directives avec root', 
       function(){
           var mbaDirective = new MbaRootDirective(twoLevelsAndSubDirectivesPrecursorWithRoot, false);
           
           var directiveAccessorChain = mbaDirective.getAccessorChain();
           OnAttend(directiveAccessorChain.match([])).DEtreVrai();
           
           var bindingAccessorChain = mbaDirective.getBindings()[0].getTransformations()[0].getAccessorChain();
           OnAttend(bindingAccessorChain.match(['name'])).DEtreVrai();
           
           var subDirective1 = mbaDirective.getSubDirectives()[0];
           var subDirective1AccessorChain = subDirective1.getAccessorChain();
           OnAttend(subDirective1AccessorChain.match(['sub'])).DEtreVrai();
           
           var subBinding1AccessorChain = subDirective1.getBindings()[0].getTransformations()[0].getAccessorChain();
           OnAttend(subBinding1AccessorChain.match(['sub', 'age'])).DEtreVrai();
           
           var subDirective2 = mbaDirective.getSubDirectives()[1];
           var subDirective2AccessorChain = subDirective2.getAccessorChain();
           OnAttend(subDirective2AccessorChain.match(['sub'])).DEtreVrai();
           
           var subBinding2AccessorChain = subDirective2.getBindings()[0].getTransformations()[0].getAccessorChain();
           OnAttend(subBinding2AccessorChain.match(['sub', 'job'])).DEtreVrai();
    });
    
    var minimalPrecursorNoRoot = {name: '#toto'};
    
    Ca('teste hasRoot() sur un precurseur sans root', function(){
        var precursor = {name: '#toto'};
        var directive = new MbaRootDirective(precursor, false);
        OnAttend(directive.hasRoot()).DEtreFaux();
    });
    
    Ca('teste la création d\'une MbaDirective minimale sans root', function(){
        var mbaDirective = new MbaRootDirective(minimalPrecursorNoRoot, false);
        OnAttend(mbaDirective.hasRoot()).DEtreFaux();
           
        var bindings = mbaDirective.getBindings();
        OnAttend(bindings.length).DEtreEgalA(1);
        OnAttend(bindingsHaveOnlyOneTransformation(bindings)).DEtreVrai();
        OnAttend(bindings[0].getSelector()).DEtreEgalA('#toto');
    });
    
    Ca('teste les accesseurs de la MbaDirective minimale sans root', function(){
        var mbaDirective = new MbaRootDirective(minimalPrecursorNoRoot, false);
        
        var directiveAccessorChain = mbaDirective.getAccessorChain();
        OnAttend(directiveAccessorChain.match([])).DEtreVrai();
           
        var bindingAccessorChain = mbaDirective.getBindings()[0].getTransformations()[0].getAccessorChain();
        OnAttend(bindingAccessorChain.match(['name'])).DEtreVrai();
    });
    
    var twoDirectivesPrecursorNoRoot = {name: '#toto', age: '#tutu'};
    
    Ca('teste la création d\'une MbaDirective avec deux directives sans root', function(){
        var mbaDirective = new MbaRootDirective(twoDirectivesPrecursorNoRoot, false);
        OnAttend(mbaDirective.hasRoot()).DEtreFaux();
           
        var bindings = mbaDirective.getBindings();
        OnAttend(bindings.length).DEtreEgalA(2);
        OnAttend(bindingsHaveOnlyOneTransformation(bindings)).DEtreVrai();
        OnAttend(bindings[0].getSelector()).DEtreEgalA('#toto');
        OnAttend(bindings[1].getSelector()).DEtreEgalA('#tutu');
    });
    
    Ca('teste les accesseurs de la MbaDirective avec deux directives sans root', function(){
        var mbaDirective = new MbaRootDirective(twoDirectivesPrecursorNoRoot, false);
       
        var directiveAccessorChain = mbaDirective.getAccessorChain();
        OnAttend(directiveAccessorChain.match([])).DEtreVrai();
           
        var binding1AccessorChain = mbaDirective.getBindings()[0].getTransformations()[0].getAccessorChain();
        OnAttend(binding1AccessorChain.match(['name'])).DEtreVrai();
        
        var binding2AccessorChain = mbaDirective.getBindings()[1].getTransformations()[0].getAccessorChain();
        OnAttend(binding2AccessorChain.match(['age'])).DEtreVrai();
    });
    
    var twoLevelsPrecursorParentNoRoot = {name: '#toto', sub : {r00t: '#root', age: '#tutu'}};
    
    Ca('teste la création d\'une MbaDirective sur deux niveaux, parent sans root', 
       function(){
           var mbaDirective = new MbaRootDirective(twoLevelsPrecursorParentNoRoot, false);
           OnAttend(mbaDirective.hasRoot()).DEtreFaux();
           
           var bindings = mbaDirective.getBindings();
           OnAttend(bindings.length).DEtreEgalA(1);
           OnAttend(bindingsHaveOnlyOneTransformation(bindings)).DEtreVrai();
           OnAttend(bindings[0].getSelector()).DEtreEgalA('#toto');
           
           var subDirectives = mbaDirective.getSubDirectives();
           OnAttend(subDirectives.length).DEtreEgalA(1);
           OnAttend(subDirectives[0].getRootSelector()).DEtreEgalA('#root');
           
           var subBindings = subDirectives[0].getBindings();
           OnAttend(subBindings.length).DEtreEgalA(1);
           OnAttend(bindingsHaveOnlyOneTransformation(subBindings)).DEtreVrai();
           OnAttend(subBindings[0].getSelector()).DEtreEgalA('#tutu');
	});
    
    Ca('teste les accesseurs de la MbaDirective sur deux niveaux, parent sans root', 
       function(){
           var mbaDirective = new MbaRootDirective(twoLevelsPrecursorParentNoRoot, false);
           
           var directiveAccessorChain = mbaDirective.getAccessorChain();
           OnAttend(directiveAccessorChain.match([])).DEtreVrai();
           
           var bindingAccessorChain = mbaDirective.getBindings()[0].getTransformations()[0].getAccessorChain();
           OnAttend(bindingAccessorChain.match(['name'])).DEtreVrai();
        
           var subDirective = mbaDirective.getSubDirectives()[0];
           var subDirectiveAccessorChain = subDirective.getAccessorChain();
           OnAttend(subDirectiveAccessorChain.match(['sub'])).DEtreVrai();
           
           var subBindingAccessorChain = subDirective.getBindings()[0].getTransformations()[0].getAccessorChain();
           OnAttend(subBindingAccessorChain.match(['sub', 'age'])).DEtreVrai();
    });
    
    var twoLevelsPrecursorChildNoRoot = {r00t: '#root', name: '#toto', sub : {age: '#tutu'}};
    
    Ca('teste la création d\'une MbaDirective sur deux niveaux, enfant sans root', 
       function(){
           var mbaDirective = new MbaRootDirective(twoLevelsPrecursorChildNoRoot, false);
           OnAttend(mbaDirective.getRootSelector()).DEtreEgalA('#root');
           
           var bindings = mbaDirective.getBindings();
           OnAttend(bindings.length).DEtreEgalA(2);
           OnAttend(bindingsHaveOnlyOneTransformation(bindings)).DEtreVrai();
           OnAttend(bindings[0].getSelector()).DEtreEgalA('#toto');
           OnAttend(bindings[1].getSelector()).DEtreEgalA('#tutu');
           
           OnAttend(mbaDirective.getSubDirectives().length).DEtreEgalA(0);
	});
    
    Ca('teste les accesseurs de la MbaDirective sur deux niveaux, enfant sans root', 
       function(){
           var mbaDirective = new MbaRootDirective(twoLevelsPrecursorChildNoRoot, false);
           
           var directiveAccessorChain = mbaDirective.getAccessorChain();
           OnAttend(directiveAccessorChain.match([])).DEtreVrai();
           
           var binding1AccessorChain = mbaDirective.getBindings()[0].getTransformations()[0].getAccessorChain();
           OnAttend(binding1AccessorChain.match(['name'])).DEtreVrai();
           
           var binding2AccessorChain = mbaDirective.getBindings()[1].getTransformations()[0].getAccessorChain();
           OnAttend(binding2AccessorChain.match(['sub', 'age'])).DEtreVrai();
    });
    
    var threeLevelsPrecursorChildNoRoot = {r00t: '#root', name: '#toto', sub : {age: '#tutu', adress : {number : '#tata'}}};
    
    Ca('teste la création d\'une MbaDirective sur trois niveaux, enfant sans root', 
       function(){
           var mbaDirective = new MbaRootDirective(threeLevelsPrecursorChildNoRoot, false);
           OnAttend(mbaDirective.getRootSelector()).DEtreEgalA('#root');
           
           var bindings = mbaDirective.getBindings();
           OnAttend(bindings.length).DEtreEgalA(3);
           OnAttend(bindingsHaveOnlyOneTransformation(bindings)).DEtreVrai();
           OnAttend(bindings[0].getSelector()).DEtreEgalA('#toto');
           OnAttend(bindings[1].getSelector()).DEtreEgalA('#tutu');
           OnAttend(bindings[2].getSelector()).DEtreEgalA('#tata');
           
           OnAttend(mbaDirective.getSubDirectives().length).DEtreEgalA(0);
	});
    
    Ca('teste les accesseurs de la MbaDirective sur trois niveaux, enfant sans root', 
       function(){
           var mbaDirective = new MbaRootDirective(threeLevelsPrecursorChildNoRoot, false);
           
           var directiveAccessorChain = mbaDirective.getAccessorChain();
           OnAttend(directiveAccessorChain.match([])).DEtreVrai();
           
           var binding1AccessorChain = mbaDirective.getBindings()[0].getTransformations()[0].getAccessorChain();
           OnAttend(binding1AccessorChain.match(['name'])).DEtreVrai();
           
           var binding2AccessorChain = mbaDirective.getBindings()[1].getTransformations()[0].getAccessorChain();
           OnAttend(binding2AccessorChain.match(['sub', 'age'])).DEtreVrai();
           
           var binding3AccessorChain = mbaDirective.getBindings()[2].getTransformations()[0].getAccessorChain();
           OnAttend(binding3AccessorChain.match(['sub', 'adress', 'number'])).DEtreVrai();
    });
      
    var twoLevelsAndArraySubDirectivesPrecursorNoRoot = {name: '#toto', sub : [{age: '#tutu'}, {job: '#tata'}]};
    var twoLevelsSubDirectivesPrecursorNoRoot = {name: '#toto', sub : {age: '#tutu', job: '#tata'}};
    
    function testCreationForTwoLevelsSubDirectivesPrecursorNoRoot(twoLevelsSubDirectivesPrecursorNoRoot){
        var mbaDirective = new MbaRootDirective(twoLevelsSubDirectivesPrecursorNoRoot, false);
           OnAttend(mbaDirective.hasRoot()).DEtreFaux();
           
           var bindings = mbaDirective.getBindings();
           OnAttend(bindings.length).DEtreEgalA(3);
           OnAttend(bindingsHaveOnlyOneTransformation(bindings)).DEtreVrai();
           OnAttend(bindings[0].getSelector()).DEtreEgalA('#toto');
           OnAttend(bindings[1].getSelector()).DEtreEgalA('#tutu');
           OnAttend(bindings[2].getSelector()).DEtreEgalA('#tata');
           
           OnAttend(mbaDirective.getSubDirectives().length).DEtreEgalA(0);
    }
    
    function testAccessorsForTwoLevelsSubDirectivesPrecursorNoRoot(twoLevelsSubDirectivesPrecursorNoRoot){
        var mbaDirective = new MbaRootDirective(twoLevelsSubDirectivesPrecursorNoRoot, false);
           
           var directiveAccessorChain = mbaDirective.getAccessorChain();
           OnAttend(directiveAccessorChain.match([])).DEtreVrai();
           
           var binding1AccessorChain = mbaDirective.getBindings()[0].getTransformations()[0].getAccessorChain();
           OnAttend(binding1AccessorChain.match(['name'])).DEtreVrai();
           
           var binding2AccessorChain = mbaDirective.getBindings()[1].getTransformations()[0].getAccessorChain();
           OnAttend(binding2AccessorChain.match(['sub', 'age'])).DEtreVrai();
           
           var binding3AccessorChain = mbaDirective.getBindings()[2].getTransformations()[0].getAccessorChain();
           OnAttend(binding3AccessorChain.match(['sub', 'job'])).DEtreVrai();
    }
    
    Ca('teste la création d\'une MbaDirective sur deux niveaux sans root', 
       function(){
           testCreationForTwoLevelsSubDirectivesPrecursorNoRoot(twoLevelsSubDirectivesPrecursorNoRoot);
	});
    
    Ca('teste la création d\'une MbaDirective sur deux niveaux sans root, enfant tableau', 
       function(){
           testCreationForTwoLevelsSubDirectivesPrecursorNoRoot(twoLevelsAndArraySubDirectivesPrecursorNoRoot);
	});    
    
    Ca('teste les accesseurs de la MbaDirective sur deux niveaux sans root', 
       function(){
           testAccessorsForTwoLevelsSubDirectivesPrecursorNoRoot(twoLevelsSubDirectivesPrecursorNoRoot);
    });
    
    Ca('teste les accesseurs de la MbaDirective sur deux niveaux sans root, enfant tableau', 
       function(){
           testAccessorsForTwoLevelsSubDirectivesPrecursorNoRoot(twoLevelsAndArraySubDirectivesPrecursorNoRoot);
    });
        
    var threeLevelsPrecursorParentsNoRootChildWithRoot = {me: {tel : {r00t: '#tel', number : '#number'}}};
    var fourLevelsPrecursorParentsNoRootChildWithRoot = {me: {adress: {tel : {r00t: '#tel', number : '#number'}}}};
    
    function testCreationForSeveralLevelsParentNoRootChildWithRoot(severalLevelsParentNoRootChildWithRoot){
        var mbaDirective = new MbaRootDirective(severalLevelsParentNoRootChildWithRoot, false);
        OnAttend(mbaDirective.hasRoot()).DEtreFaux();
        
        var bindings = mbaDirective.getBindings();
        OnAttend(bindings.length).DEtreEgalA(0);
        var subDirectives = mbaDirective.getSubDirectives();
        OnAttend(subDirectives.length).DEtreEgalA(1);
        
        var subDirective = subDirectives[0];
        OnAttend(subDirective.getRootSelector()).DEtreEgalA('#tel');
        var subBindings = subDirective.getBindings();
        OnAttend(bindingsHaveOnlyOneTransformation(subBindings)).DEtreVrai();
        OnAttend(subBindings.length).DEtreEgalA(1);
        OnAttend(subBindings[0].getSelector()).DEtreEgalA('#number');
    }
        
    Ca('teste la création d\'une MbaDirective sur trois niveaux, parents sans root, enfant avec root', 
       function(){
           testCreationForSeveralLevelsParentNoRootChildWithRoot(threeLevelsPrecursorParentsNoRootChildWithRoot);
	});
    
    Ca('teste les accesseurs d\'une MbaDirective sur trois niveaux, parents sans root, enfant avec root', 
       function(){
           var mbaDirective = new MbaRootDirective(threeLevelsPrecursorParentsNoRootChildWithRoot, false);
           
           var directiveAccessorChain = mbaDirective.getAccessorChain();
           OnAttend(directiveAccessorChain.match([])).DEtreVrai();
           
           var subDirective = mbaDirective.getSubDirectives()[0];
           var subDirectiveAccessorChain = subDirective.getAccessorChain();
           //console.log(subDirectiveAccessorChain.toString());
           OnAttend(subDirectiveAccessorChain.match(['me', 'tel'])).DEtreVrai();
           
           var subBindingAccessorChain = subDirective.getBindings()[0].getTransformations()[0].getAccessorChain();
           OnAttend(subBindingAccessorChain.match(['me', 'tel', 'number'])).DEtreVrai();
	});
    
    Ca('teste la création d\'une MbaDirective sur quatre niveaux, parents sans root, enfant avec root', 
       function(){
           testCreationForSeveralLevelsParentNoRootChildWithRoot(fourLevelsPrecursorParentsNoRootChildWithRoot);
	});
    
    Ca('teste les accesseurs d\'une MbaDirective sur quatre niveaux, parents sans root, enfant avec root', 
       function(){
           var mbaDirective = new MbaRootDirective(fourLevelsPrecursorParentsNoRootChildWithRoot, false);
          
           var directiveAccessorChain = mbaDirective.getAccessorChain();
           OnAttend(directiveAccessorChain.match([])).DEtreVrai();
           
           var subDirective = mbaDirective.getSubDirectives()[0];
           var subDirectiveAccessorChain = subDirective.getAccessorChain();
           //console.log(subDirectiveAccessorChain.toString());
           OnAttend(subDirectiveAccessorChain.match(['me', 'adress', 'tel'])).DEtreVrai();
            
           var subBindingAccessorChain = subDirective.getBindings()[0].getTransformations()[0].getAccessorChain();
           OnAttend(subBindingAccessorChain.match(['me', 'adress', 'tel', 'number'])).DEtreVrai();
	});   
        
    //TODO : avec MbaDirectives2 je ne suis pas sûr que les tableaux de directives aient un interet...
    Ca('teste hasRoot() sur un tableau de precurseurs', function(){
        var precursor = [{name: '#toto'}, {job: '#tutu'}];
        var directive = new MbaRootDirective(precursor, false);
        OnAttend(directive.hasRoot()).DEtreFaux();
        var bindings = directive.getBindings();
        OnAttend(bindings.length).DEtreEgalA(2);
        OnAttend(bindingsHaveOnlyOneTransformation(bindings)).DEtreVrai();
        OnAttend(bindings[0].getSelector()).DEtreEgalA('#toto');
        OnAttend(bindings[1].getSelector()).DEtreEgalA('#tutu');
    });
        
    var templateTwoLevels = '<div id="root"><div id="toto"></div><div id="sub"><div id="tutu"></div><div id="tata">title</div></div>';
    var directiveTwoLevelsWithRoot = {r00t: '#root', name: '#toto', location: {r00t:'#sub', type: '#tutu', title: '#tata'}};
    
    Ca('teste que le MbaTemplate.addTextNodeForBindingText ajoute les textNodes nécessaires', function(){
        var template = templateTwoLevels;
        var directive = directiveTwoLevelsWithRoot;
        var mbaTemplate = new MbaTemplate(template, directive);    
        mbaTemplate.constructDirectivesTree();
        
        var toto = mbaTemplate.findDom('#toto').getElement(0);
        var tutu = mbaTemplate.findDom('#tutu').getElement(0);
        var tata = mbaTemplate.findDom('#tata').getElement(0);
        
        OnAttend(toto.childNodes[0]).DEtreNull();
        OnAttend(tutu.childNodes[0]).DEtreNull();
        OnAttend(isATextNode(tata.childNodes[0])).DEtreVrai();
        OnAttend(tata.childNodes[0].textContent).DEtreEgalA('title');
        
        mbaTemplate.addTextNodeForBindingText();
        
        OnAttend(isATextNode(toto.childNodes[0])).DEtreVrai();
        OnAttend(isATextNode(tutu.childNodes[0])).DEtreVrai();
        OnAttend(isATextNode(tata.childNodes[0])).DEtreVrai();
        OnAttend(tata.childNodes[0].textContent).DEtreEgalA('title');
    });
    
    Ca('teste la création d\'une MbaTemplateDirective avec directive avec root', function(){
        var templateHtml = '<html><body><div id="root"></body></html>';
        var directivePrecursor = {r00t: '#root'};
        var mbaTemplate = new MbaTemplate(templateHtml, directivePrecursor); 
        mbaTemplate.constructDirectivesTree();
        var template = mbaTemplate.getTemplate();
        var rootDirective = mbaTemplate.getRootDirective();
        var templateDirective = new MbaTemplateDirective(template, rootDirective);
    
        var root = template.find('#root');
        OnAttend(templateDirective.getRootAnchor().equals(root)).DEtreVrai();
        OnAttend(templateDirective.getTemplateBindings().length).DEtreEgalA(0);
    });
    
    Ca('teste la création d\'une MbaTemplateDirective avec directive sans root', function(){
        var templateHtml = '<html><body><div id="root"></body></html>';
        var directivePrecursor = {};
        var mbaTemplate = new MbaTemplate(templateHtml, directivePrecursor); 
        mbaTemplate.constructDirectivesTree();
        var template = mbaTemplate.getTemplate();
        var rootDirective = mbaTemplate.getRootDirective();
        var templateDirective = new MbaTemplateDirective(template, rootDirective);
    
        OnAttend(templateDirective.getRootAnchor().equals(template)).DEtreVrai();
        OnAttend(templateDirective.getTemplateBindings().length).DEtreEgalA(0);
        OnAttend(templateDirective.getSubTemplateDirectives().length).DEtreEgalA(0);
    });
    
    Ca('teste la création d\'un MbaTemplateBinding', function(){
        var template = new MbaDomFromString('<body><div id="toto"></div></body>');
        var binding = new MbaBinding('#toto', new DefaultAnchorProvider(), new MbaTransfMock());
        var templateBinding = new MbaTemplateBinding(template, binding);
                
        var toto = template.find('#toto');
        OnAttend(templateBinding.getAnchor().equals(toto)).DEtreVrai();
    });
    
    Ca('teste la construction de l\'arborescence de MbaTemplateDirective et MbaTemplateBinding', function(){
        var html = '<div><div id="toto"></div><div id="tutu"></div></div>';
        //TODO : étudier cas particulier var html = '<html><body><div id="toto"></div><div id="tutu"></div></body></html>'; -> les balise body et html ne sont pas prises en compte...
        var directivePrecursor = {name: '#toto', sub: {r00t: '#tutu', job: '#tutu'}};
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        mbaTemplate.constructDirectivesTree();
        mbaTemplate.addTextNodeForBindingText();
        
        var htmlRoot = mbaTemplate.getTemplate();
        var toto = mbaTemplate.findOneMaxDom('#toto');
        var totoTextNode = toto.getChildren();
        var tutu = mbaTemplate.findOneMaxDom('#tutu');
        var tutuTextNode = tutu.getChildren();
        
        OnAttend(mbaTemplate.getTemplateDirective()).DEtreNull();
        
        mbaTemplate.constructTemplateDirective();
        
        var test = {rootAnchor: htmlRoot,
                    bindings: [{anchor: totoTextNode}],
                    subDirectives: [{rootAnchor: tutu, 
                                     bindings: [{anchor: tutuTextNode}],
                                     subDirectives: []}]};
        
        OnAttend(mbaTemplate.getTemplateDirective().match(test)).DEtreVrai();
    });
    
    Ca('teste la fusion des templateBinding quand l\'ancre est la même', function(){
        var html = '<div id="toto"></div><div id="tutu"></div>';
        var directivePrecursor = {name: '#toto', gender:'#toto', sub: {r00t: '#tutu', name: '#tutu', gender: '#tutu'}};
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        mbaTemplate.constructDirectivesTree();
        mbaTemplate.addTextNodeForBindingText();
        mbaTemplate.constructTemplateDirective();
        
        var template = mbaTemplate.getTemplate();
        var toto = mbaTemplate.findOneMaxDom('#toto');
        var totoTextNode = toto.getChildren();
        var tutu = mbaTemplate.findOneMaxDom('#tutu');
        var tutuTextNode = tutu.getChildren();
        
        var testBefore = {rootAnchor: template,
                          bindings: [{anchor: totoTextNode, nbTransf: 1},
                                     {anchor: totoTextNode, nbTransf: 1}],
                          subDirectives: [{rootAnchor: tutu, 
                                           bindings: [{anchor: tutuTextNode, nbTransf: 1},
                                                      {anchor: tutuTextNode, nbTransf: 1}],
                                           subDirectives: []}]};
        
        var templateDirective = mbaTemplate.getTemplateDirective();
        OnAttend(templateDirective.match(testBefore)).DEtreVrai();
        
        mbaTemplate.mergeTemplateDirectives();
        
        var testAfter = {rootAnchor: template,
                         bindings: [{anchor: totoTextNode, nbTransf: 2}],
                         subDirectives: [{rootAnchor: tutu, 
                                          bindings: [{anchor: tutuTextNode, nbTransf: 2}],
                                          subDirectives: []}]};
        
        OnAttend(templateDirective.match(testAfter)).DEtreVrai();
    });
    
    Ca('teste la fusion des templateDirective quand l\'ancre racine est la même', function(){
        var html = '<div id="toto"></div><div id="tutu"><div id="tata"></div><div id="titi"></div></div>';
        var directivePrecursor = {name: '#toto', sub: [{r00t: '#tutu', name: '#tata'}, {r00t: '#tutu', gender: '#titi'}]};
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        mbaTemplate.constructDirectivesTree();
        mbaTemplate.addTextNodeForBindingText();
        mbaTemplate.constructTemplateDirective();
        
        var template = mbaTemplate.getTemplate();
        var toto = mbaTemplate.findOneMaxDom('#toto');
        var totoTextNode = toto.getChildren();
        var tutu = mbaTemplate.findOneMaxDom('#tutu');
        var tutuTextNode = tutu.getChildren();
        var titi = mbaTemplate.findOneMaxDom('#titi');
        var titiTextNode = titi.getChildren();
        var tata = mbaTemplate.findOneMaxDom('#tata');
        var tataTextNode = tata.getChildren();
        
        var testBefore = {rootAnchor: template,
                          bindings: [{anchor: totoTextNode, nbTransf: 1}],
                          subDirectives: [{rootAnchor: tutu, 
                                           bindings: [{anchor: tataTextNode, nbTransf: 1}],
                                           subDirectives: []},
                                          {rootAnchor: tutu, 
                                           bindings: [{anchor: titiTextNode, nbTransf: 1}],
                                           subDirectives: []}]};
        
        var templateDirective = mbaTemplate.getTemplateDirective();
        OnAttend(templateDirective.match(testBefore)).DEtreVrai();
        
        mbaTemplate.mergeTemplateDirectives();
        
        var testAfter = {rootAnchor: template,
                          bindings: [{anchor: totoTextNode, nbTransf: 1}],
                          subDirectives: [{rootAnchor: tutu, 
                                           bindings: [{anchor: tataTextNode, nbTransf: 1},
                                                      {anchor: titiTextNode, nbTransf: 1}],
                                           subDirectives: []}]};
        
        OnAttend(templateDirective.match(testAfter)).DEtreVrai();
    });
        
    Ca('teste que la fusion des templateDirective doit se faire avant celle des templateBinding', function(){
        var html = '<div id="toto"></div><div id="tutu"></div>';
        var directivePrecursor = {name: '#toto', sub: [{r00t: '#tutu', name: '#tutu'}, {r00t: '#tutu', gender: '#tutu'}]};
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        mbaTemplate.constructDirectivesTree();
        mbaTemplate.addTextNodeForBindingText();
        mbaTemplate.constructTemplateDirective();
        
        var template = mbaTemplate.getTemplate();
        var toto = mbaTemplate.findOneMaxDom('#toto');
        var totoTextNode = toto.getChildren();
        var tutu = mbaTemplate.findOneMaxDom('#tutu');
        var tutuTextNode = tutu.getChildren();
        
        var testBefore = {rootAnchor: template,
                          bindings: [{anchor: totoTextNode, nbTransf: 1}],
                          subDirectives: [{rootAnchor: tutu, 
                                           bindings: [{anchor: tutuTextNode, nbTransf: 1}],
                                           subDirectives: []},
                                          {rootAnchor: tutu, 
                                           bindings: [{anchor: tutuTextNode, nbTransf: 1}],
                                           subDirectives: []}]};
        
        var templateDirective = mbaTemplate.getTemplateDirective();
        OnAttend(templateDirective.match(testBefore)).DEtreVrai();
        
        mbaTemplate.mergeTemplateDirectives();
        var testAfter = {rootAnchor: template,
                          bindings: [{anchor: totoTextNode, nbTransf: 1}],
                          subDirectives: [{rootAnchor: tutu, 
                                           bindings: [{anchor: tutuTextNode, nbTransf: 2}],
                                           subDirectives: []}]};
        
        OnAttend(templateDirective.match(testAfter)).DEtreVrai();
    });
    
    Ca('teste la construction des MbaNodeHtmlElement pour le template', function(){
        var html = '<div id="root"><div id="toto"></div><div id="tutu"></div></div>';
        var mbaTemplate = new MbaTemplate(html, {});
        
        var root = mbaTemplate.getTemplate();
        var toto = mbaTemplate.findOneMaxDom('#toto');
        var tutu = mbaTemplate.findOneMaxDom('#tutu');
        
        mbaTemplate.constructRootNode();
        
        var rootNode = mbaTemplate.getRootNode();    
        var test = {type: MbaRootNode,
                    dom: root,
                    children: [{type: MbaNodeHtmlElement,
                                dom: root,
                                children: [{type: MbaNodeHtmlElement, 
                                            dom: toto},
                                           {type: MbaNodeHtmlElement,
                                            dom: tutu}]}]};
        
        OnAttend(rootNode.match(test)).DEtreVrai();
    });
    
    Ca('teste l\'intégration des MbaNodeBinding et MbaNodeDirective dans l\'arborescence de MbaNode', function(){
        var html = '<div id="root"><div id="toto"></div><div id="tutu"></div></div>';
        var directivePrecursor = {r00t: '#root', name: '#toto', age: '#tutu'};
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        mbaTemplate.constructDirectivesTree();
        mbaTemplate.addTextNodeForBindingText();
        mbaTemplate.constructTemplateDirective();
        mbaTemplate.mergeTemplateDirectives();
        mbaTemplate.constructRootNode();        
        
        var template = mbaTemplate.getTemplate();
        var root = mbaTemplate.findOneMaxDom('#root');
        var toto = mbaTemplate.findOneMaxDom('#toto');
        var totoTextNode = toto.getChildren();
        var tutu = mbaTemplate.findOneMaxDom('#tutu');
        var tutuTextNode = tutu.getChildren();
        
        var rootNode = mbaTemplate.getRootNode();    
        var testBefore =
            {type: MbaRootNode,
             dom: template,
             children: [{type: MbaNodeHtmlElement,
                         dom: root,
                         children: [{type: MbaNodeHtmlElement, 
                                     dom: toto,
                                     children: [{type: MbaNodeHtmlElement, dom: totoTextNode}]},
                                    {type: MbaNodeHtmlElement,
                                     dom: tutu,
                                     children: [{type: MbaNodeHtmlElement, dom: tutuTextNode}]}]}]};
        OnAttend(rootNode.match(testBefore)).DEtreVrai();
        
        mbaTemplate.integrateDirectiveAndBindingNodes();
        
        var testAfter = 
            {type: MbaRootNode,
             dom: template,
             children: [{type: MbaNodeDirective,
                         dom: root,
                         children: [{type: MbaNodeHtmlElement,
                                     dom: root,
                                     children: [{type: MbaNodeHtmlElement, 
                                                 dom: toto,
                                                 children: [{type: MbaNodeBinding, 
                                                             dom: totoTextNode}]},
                                                {type: MbaNodeHtmlElement,
                                                 dom: tutu,
                                                 children: [{type: MbaNodeBinding, 
                                                             dom: tutuTextNode}]}]}]}]};
        OnAttend(rootNode.match(testAfter)).DEtreVrai();
        
    });
    
    Ca('teste que les MbaNodeBinding et MbaNodeDirective sont inséré au bon endroit dans leur parent', function(){
        var html = '<div id="root"><div id="first"></div><div id="second"></div><div id="third"></div></div>';
        var directivePrecursor = {toto: '#first',
                                  tutus: {r00t: '#second', name: '#second'},
                                  titi: '#third'};
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        mbaTemplate.constructDirectivesTree();
        mbaTemplate.addTextNodeForBindingText();
        mbaTemplate.constructTemplateDirective();
        mbaTemplate.mergeTemplateDirectives();
        mbaTemplate.constructRootNode();        
        
        var template = mbaTemplate.getTemplate();
        var root = mbaTemplate.findOneMaxDom('#root');
        var first = mbaTemplate.findOneMaxDom('#first');
        var firstTextNode = first.getChildren();
        var second = mbaTemplate.findOneMaxDom('#second');
        var secondTextNode = second.getChildren();
        var third = mbaTemplate.findOneMaxDom('#third');
        var thirdTextNode = third.getChildren();
        
        var rootNode = mbaTemplate.getRootNode();    
        //rootNode.debug();
        var testBefore =
            {type: MbaRootNode,
             dom: template,
             children: [{type: MbaNodeHtmlElement,
                         dom: root,
                         children: [{type: MbaNodeHtmlElement, 
                                     dom: first,
                                     children: [{type: MbaNodeHtmlElement, dom: firstTextNode}]},
                                    {type: MbaNodeHtmlElement,
                                     dom: second,
                                     children: [{type: MbaNodeHtmlElement, dom: secondTextNode}]},
                                    {type: MbaNodeHtmlElement,
                                     dom: third,
                                     children: [{type: MbaNodeHtmlElement, dom: thirdTextNode}]}]}]};
        OnAttend(rootNode.match(testBefore)).DEtreVrai();
        
        mbaTemplate.integrateDirectiveAndBindingNodes();
        //rootNode.debug();
        var testAfter = 
            {type: MbaRootNode,
             dom: template,
             children: [{type: MbaNodeHtmlElement,
                         dom: root,
                         children: [{type: MbaNodeHtmlElement, 
                                      dom: first,
                                      children: [{type: MbaNodeBinding, 
                                                  dom: firstTextNode}]},
                                     {type: MbaNodeDirective,
                                      dom: second,
                                      children: [{type: MbaNodeHtmlElement,
                                                  dom: second,
                                                  children: [{type: MbaNodeBinding, 
                                                              dom: secondTextNode}]}]},
                                     {type: MbaNodeHtmlElement,
                                      dom: third,
                                      children: [{type: MbaNodeBinding, 
                                                  dom: thirdTextNode}]}]}]};
        OnAttend(rootNode.match(testAfter)).DEtreVrai();
        
    });
        
    
    Ca('teste si il n\'y a pas de root alors pas de MbaNodeDirective', function(){
        var html = '<div id="root"><div id="toto"></div></div><div id="stuff"></div>';
        var directivePrecursor = {name: '#toto'};
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        
        mbaTemplate.prepareForRender();
        
        var template = mbaTemplate.getTemplate();
        var root = mbaTemplate.findOneMaxDom('#root');
        var toto = mbaTemplate.findOneMaxDom('#toto');
        var totoTextNode = toto.getChildren();
        var stuff = mbaTemplate.findOneMaxDom('#stuff');
        
        var rootNode = mbaTemplate.getRootNode();    
        
        var testAfter = 
            {type: MbaRootNode,
             dom: template,
             children: [{type: MbaNodeHtmlElement,
                         dom: root,
                         children: [{type: MbaNodeHtmlElement, 
                                     dom: toto,
                                     children: [{type: MbaNodeBinding, 
                                                 dom: totoTextNode}]}]},
                        {type: MbaNodeHtmlElement,
                         dom: stuff}]};
        OnAttend(rootNode.match(testAfter)).DEtreVrai();
    });
     
    function createTemplateBindingForTestTransformationParam(template, anchorSelector, modelProperty, transformation){
        var mbaAccessor = new MbaFieldAccessor('name');
        var mbaAccessorChain = new MbaAccessorChain().prependAccessor(mbaAccessor);
        var mbaTransf = new MbaTransf(transformation, mbaAccessorChain);
        var mbaBinding = new MbaBinding(anchorSelector, new DefaultAnchorProvider(), mbaTransf);
        return new MbaTemplateBinding(template, mbaBinding);
    }
    
    function createTemplateBindingForTest(template, anchorSelector, modelProperty){
        var transformation = function(dom, newValue, oldValue){dom.innerHTML = newValue;};
        return createTemplateBindingForTestTransformationParam(template, anchorSelector, modelProperty, transformation);
    }
    
    function createTemplateBindingWithTransformationWichRemoveElementIfModelValueIsNull(template, anchorSelector, modelProperty){
        var transformation = function(dom, newValue, oldValue){
            if(newValue == null)
                dom.parentNode.removeChild(dom);
            else
                dom.innerHTML = newValue;
        };
        return createTemplateBindingForTestTransformationParam(template, anchorSelector, modelProperty, transformation);
    }
    
    //TODO gérer le cas où la transformation supprime l'ancre dans le parent
    /*Ca('teste que l\'élément à mettre à jour est réinséré dans son parent avant d\'être mis à jour', function(){
        var template = new MbaDomFromString('<div id="root"><div id="toto"></div></div>');
        var toto = template.find('#toto');
        var totoDomElement = toto.getElement(0);
        var templatebinding = createTemplateBindingWithTransformationWichRemoveElementIfModelValueIsNull(template, '#toto', 'name');
        //Il faut demander au node parent de re-insérer l'enfant au bon endroit
        //La transformation ne peut pas savoir à quel endroit le ré-insérer
        templatebinding.render({});           
        OnAttend(template.toString()).DEtreEgalA('<div id="root"></div>');
        templatebinding.render({name: 'tutu'});  
        OnAttend(template.toString()).DEtreEgalA('<div id="root"><div id="toto">tutu</div></div>');
    });*/
 
   
    Ca('teste le rendu avec une directive minimale sans root', function(){
        var html = '<div id="root"><div id="toto">toto</div></div><div id="stuff"></div>';
        var directivePrecursor = {name: '#toto'};
        var model = {name: "tutu"};
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode(); 
        //rootNode.debug(true);
        var htmlRendered = '<div id="root"><div id="toto">tutu</div></div><div id="stuff"></div>';
        OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(htmlRendered);
        OnAttend(rootNode.indexedRenderedDomIsValid()).DEtreVrai();
    });
    
    Ca('teste le rendu avec une directive minimale avec root', function(){
        var html = '<div id="root"><div id="toto">toto</div></div><div id="stuff"></div>';
        var directivePrecursor = {r00t: '#toto', name: '#toto'};
        var model = {name: "tutu"};
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode(); 
        //rootNode.debug(true);
        var htmlRendered = '<div id="root"><div id="toto">tutu</div></div><div id="stuff"></div>';
        OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(htmlRendered);
        OnAttend(rootNode.indexedRenderedDomIsValid()).DEtreVrai();
    });   
        
    Ca('teste le rendu avec une directive minimale avec root, modèle tableau', function(){
        var html = '<div id="root"><div id="toto">toto</div></div><div id="stuff"></div>';
        var directivePrecursor = {r00t: '#toto', name: '#toto'};
        var model = [{name: "tutu"}, {name: "tata"}];
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode(); 

        //rootNode.debug(true);
        var htmlRendered = '<div id="root"><div id="toto">tutu</div><div id="toto">tata</div></div><div id="stuff"></div>';
        OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(htmlRendered);
        OnAttend(rootNode.indexedRenderedDomIsValid()).DEtreVrai();
    });

    Ca('teste le rendu quand on ajoute un élément dans le tableau', function(){
        var html = '<div id="root"><div class="name">toto</div></div>';
        var directivePrecursor = {r00t: '.name', name: '.name'};
        var model = [{name: "tutu"}, {name: "tata"}];
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode(); 
        var tutuBefore = mbaTemplate.selectInRenderedDom('.name')[0];
        var tataBefore = mbaTemplate.selectInRenderedDom('.name')[1];
            
        model.push({name: "titi"});
        mbaTemplate.render(model);
        var tutuAfter = mbaTemplate.selectInRenderedDom('.name')[0];
        var tataAfter = mbaTemplate.selectInRenderedDom('.name')[1];
        
        //rootNode.debug(true);
        var htmlRendered = '<div id="root"><div class="name">tutu</div><div class="name">tata</div><div class="name">titi</div></div>';
        OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(htmlRendered);
        OnAttend(rootNode.indexedRenderedDomIsValid()).DEtreVrai();
        OnAttend(tutuBefore).DeNePasEtreNull();
        OnAttend(tutuBefore).DEtreEgalA(tutuAfter);
        OnAttend(tataBefore).DeNePasEtreNull();
        OnAttend(tataBefore).DEtreEgalA(tataAfter);
    });
    
    Ca('teste le rendu quand on supprime un élément dans le tableau', function(){
        var html = '<div id="root"><div class="name">toto</div></div><div id="stuff"></div>';
        var directivePrecursor = {r00t: '.name', name: '.name'};
        var model = [{name: "tutu"}, {name: "tata"}];
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);        
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode(); 
        var tutuBefore = mbaTemplate.selectInRenderedDom('.name')[0];
        var tataBefore = mbaTemplate.selectInRenderedDom('.name')[1];
            
        model.pop();
        mbaTemplate.render(model);
        var tutuAfter = mbaTemplate.selectInRenderedDom('.name')[0];
        
        //rootNode.debug(true);
        var htmlRendered = '<div id="root"><div class="name">tutu</div></div><div id="stuff"></div>';
        OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(htmlRendered);
        OnAttend(rootNode.indexedRenderedDomIsValid()).DEtreVrai();
        OnAttend(tutuBefore).DeNePasEtreNull();
        OnAttend(tutuBefore).DEtreEgalA(tutuAfter);
    });
  
    Ca('teste le rendu quand on supprime puis rajoute un élément dans le tableau', function(){
        var html = '<div id="root"><div class="name">toto</div></div><div id="stuff"></div>';
        var directivePrecursor = {r00t: '.name', name: '.name'};
        var model = [{name: "tutu"}, {name: "tata"}];
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode(); 
        var tataBefore = mbaTemplate.selectInRenderedDom('.name')[1];
        OnAttend(tataBefore).DeNePasEtreNull();
        
        model.pop();
        mbaTemplate.render(model);
        
        model.push({name: "tata"});
        mbaTemplate.render(model);
        //rootNode.debug(true);
        var tataAfter = mbaTemplate.selectInRenderedDom('.name')[1];
        
        var htmlRendered = '<div id="root"><div class="name">tutu</div><div class="name">tata</div></div><div id="stuff"></div>';
        OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(htmlRendered);
        OnAttend(rootNode.indexedRenderedDomIsValid()).DEtreVrai();
        OnAttend(tataAfter).DeNePasEtreNull();
        OnAttend(tataAfter).DeNePasEtre(tataBefore);
    });
      
    Ca('teste le rendu avec deux niveaux de modèle', function(){
        var html = '<div id="root"><div class="name"></div><div class="tel"></div></div>';
        var directivePrecursor = {name: '.name', tel: {number: '.tel'}};
        var model = {name: "toto", tel: {number: "01234"}};
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode(); 
        //rootNode.debug(true);
        
        var htmlRendered = '<div id="root"><div class="name">toto</div><div class="tel">01234</div></div>';
        OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(htmlRendered);
        OnAttend(rootNode.indexedRenderedDomIsValid()).DEtreVrai();
    });

    Ca('teste le rendu avec deux niveaux de modèle sans root', function(){
        var html = '<div class="name"></div><div class="tel"></div>';
        var directivePrecursor = {name: '.name', tel: {number: '.tel'}};
        var model = {name: "toto", tel: {number: "1234"}};
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode(); 
        //rootNode.debug(true);
        
        var htmlRendered = '<div class="name">toto</div><div class="tel">1234</div>';
        OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(htmlRendered);
        OnAttend(rootNode.indexedRenderedDomIsValid()).DEtreVrai();
    });
    
    //TODO à faire marcher quand les MbaNodeBinding gèreront les itérations ou déduire les root pour ajouter une mbaNodeDirective
    /*Ca('teste le rendu avec deux niveaux de modèle, sous-modèle tableau, sans root', function(){
        var html = '<div class="name"></div><div class="tel"></div>';
        var directivePrecursor = {name: '.name', tel: {number: '.tel'}};
        var model = {name: "toto", tel: [{number: "1234"}, {number: "5678"}]};
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode(); 
        //rootNode.debug(true);
        
        var htmlRendered = '<div class="name">toto</div><div class="tel">1234</div><div class="tel">5678</div>';
        OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(htmlRendered);
    });*/
        
 
     Ca('teste le rendu avec deux niveaux de modèle, sous-modèle tableau, avec root', function(){
        var html = '<div class="name"></div><div class="tel"></div>';
        var directivePrecursor = {name: '.name', tel: {r00t: '.tel', number: '.tel'}};
        var model = {name: "toto", tel: [{number: "1234"}, {number: "5678"}]};
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode();        
        //rootNode.debug(true);
        
        var htmlRendered = '<div class="name">toto</div><div class="tel">1234</div><div class="tel">5678</div>';
        OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(htmlRendered);
        OnAttend(rootNode.indexedRenderedDomIsValid()).DEtreVrai();
    });
     
    Ca('teste le rendu avec deux niveaux de modèle, modèle et sous-modèle tableau, avec root', function(){
        var html = '<div class="person"><div class="name"></div><div class="tel"></div></div>';
        var directivePrecursor = {r00t: '.person', name: '.name', tel: {r00t: '.tel', number: '.tel'}};
        var model = [{name: "toto", tel: [{number: "1234"}, {number: "5678"}]},
                     {name: "tutu", tel: [{number: "0000"}]}];
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode(); 
        //rootNode.debug(true);
        
        var htmlRendered = 
            '<div class="person"><div class="name">toto</div><div class="tel">1234</div><div class="tel">5678</div></div>'+
            '<div class="person"><div class="name">tutu</div><div class="tel">0000</div></div>';
        OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(htmlRendered);
        OnAttend(rootNode.indexedRenderedDomIsValid()).DEtreVrai();
    });
        
    Ca('teste le rendu avec deux niveaux de modèle, sous-modèle tableau, avec root multi selecteur', function(){
        var html = '<div class="name"></div><div class="tel"></div>';
        var directivePrecursor = {r00t: '.name,.tel', name: '.name', tel: {r00t: '.tel', number: '.tel'}};
        var model = {name: "toto", tel: [{number: "1234"}]};
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode(); 
        //rootNode.debug(true);
        
        var htmlRendered = 
            '<div class="name">toto</div><div class="tel">1234</div>';
        OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(htmlRendered);
        OnAttend(rootNode.indexedRenderedDomIsValid()).DEtreVrai();
    });
            
    Ca('teste le rendu avec deux niveaux de modèle, modèle et sous-modèle tableau, avec root multi selecteur', function(){
        var html = '<div class="name"></div><div class="tel"></div>';
        var directivePrecursor = {r00t: '.name,.tel', name: '.name', tel: {r00t: '.tel', number: '.tel'}};
        var model = [{name: "toto", tel: [{number: "1234"}, {number: "5678"}]},
                     {name: "tutu", tel: [{number: "0000"}]}];
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode(); 
        //rootNode.debug(true);
        
        var htmlRendered = 
            '<div class="name">toto</div><div class="tel">1234</div><div class="tel">5678</div>'+
            '<div class="name">tutu</div><div class="tel">0000</div>';
        OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(htmlRendered);
        OnAttend(rootNode.indexedRenderedDomIsValid()).DEtreVrai();
    });
           
    Ca('teste le rendu avec une directive minimale sans root, modèle null', function(){
        var html = '<div id="root"><div id="toto">toto</div></div><div id="stuff"></div>';
        var directivePrecursor = {name: '#toto'};
        var model = null;
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode(); 
        //rootNode.debug(true);
        
        var htmlRendered = 
            '<div id="root"></div><div id="stuff"></div>';
        OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(htmlRendered);
        OnAttend(rootNode.indexedRenderedDomIsValid()).DEtreVrai();
    });
    
    Ca('teste le rendu avec une directive minimale avec root, modèle null', function(){
        var html = '<div id="root"><div id="toto">toto</div></div><div id="stuff"></div>';
        var directivePrecursor = {r00t: '#toto', name: '#toto'};
        var model = null;
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode(); 
        //rootNode.debug(true);
        
        var htmlRendered = 
            '<div id="root"></div><div id="stuff"></div>';
        OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(htmlRendered);
        OnAttend(rootNode.indexedRenderedDomIsValid()).DEtreVrai();
    });
            
    Ca('teste plusieurs types de modèles null équivalents', function(){
        var html = '<div class="person"><div class="name"></div><div class="tel"></div></div>';
        var directivePrecursor = {r00t: '.person', name: '.name', tel: {r00t: '.tel', number: '.tel'}};
        var model = null;
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode(); 
        var htmlRendered = '';
        OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(htmlRendered);
        OnAttend(rootNode.indexedRenderedDomIsValid()).DEtreVrai();
        //rootNode.debug(true);
        
        
        model = [{name: "toto", tel: [{number: "1234"}]},
                 {name: "tutu", tel: null}];
        htmlRendered = 
            '<div class="person"><div class="name">toto</div><div class="tel">1234</div></div>'+
            '<div class="person"><div class="name">tutu</div></div>';
        mbaTemplate.render(model);
        OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(htmlRendered);
        OnAttend(rootNode.indexedRenderedDomIsValid()).DEtreVrai();
        //rootNode.debug(true);
        
        model = [{name: "toto", tel: [{number: "1234"}]},
                 {name: "tutu", tel: []}];
        htmlRendered = 
            '<div class="person"><div class="name">toto</div><div class="tel">1234</div></div>'+
            '<div class="person"><div class="name">tutu</div></div>';
        mbaTemplate.render(model);
        OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(htmlRendered);
        OnAttend(rootNode.indexedRenderedDomIsValid()).DEtreVrai();
        //rootNode.debug(true);        
    });
          
    Ca('teste le rendu quand un élément du modèle tableau devient null, deux niveaux de directive avec root', function(){
        var html = '<div class="person"><div class="name"></div><div class="tel"></div></div>';
        var directivePrecursor = {r00t: '.person', name: '.name', tel: {r00t: '.tel', number: '.tel'}};
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
                
        var model = [{name: "toto", tel: [{number: "1234"}, {number: "5678"}]},
                     {name: "tutu", tel: [{number: "0000"}]}];
        var htmlRendered = 
            '<div class="person"><div class="name">toto</div><div class="tel">1234</div><div class="tel">5678</div></div>'+
            '<div class="person"><div class="name">tutu</div><div class="tel">0000</div></div>';
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode(); 
        
        OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(htmlRendered);
        OnAttend(rootNode.indexedRenderedDomIsValid()).DEtreVrai();
        //rootNode.debug(true);
        
        
        model = [{name: "toto", tel: [{number: "1234"}]}];
        htmlRendered = 
            '<div class="person"><div class="name">toto</div><div class="tel">1234</div></div>';
        mbaTemplate.render(model);
        OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(htmlRendered);
        OnAttend(rootNode.indexedRenderedDomIsValid()).DEtreVrai();
        //rootNode.debug(true);        
    });
    
    Ca('teste le rendu avec un modèle contenant plusieurs sous-modèles non utilisés sauf le dernier', function(){
        var html = '<div id="people"><div id="person"><div id="id"></div><div id="name"></div></div></div>';
        var directivePrecursor = 
            {toto: {tutu: {tata: {tete: {r00t : "#person",
                                         id : "#id",
                                         name : "#name"}}}}};
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
                
        var model = {toto: {tutu: {tata: {tete: [{id: 1, name: 'bob'},
                                                 {id: 2, name: 'patrick'}]}}}};
        mbaTemplate.render(model);    
        var rootNode = mbaTemplate.getRootNode(); 
        
        var htmlRendered = '<div id="people"><div id="person"><div id="id">1</div><div id="name">bob</div></div>'
            +'<div id="person"><div id="id">2</div><div id="name">patrick</div></div></div>';
        
        OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(htmlRendered);
        OnAttend(rootNode.indexedRenderedDomIsValid()).DEtreVrai();
        //rootNode.debug(true);                
    });
    
    Ca('teste que l\'insertion des éléments de dom se fait au bon endroit', function(){
        var html = '<div class="person"><div class="name"></div><div class="tel"></div><div class="job"></div></div>';
        var directivePrecursor = {r00t: '.person',
                                  name: '.name',
                                  tel: {r00t: '.tel', number: '.tel'},
                                  job: '.job'};
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
                
        var model = {name: "toto", 
                     tel: [{number: "1234"}],
                     job: "student"};
        var htmlRendered = 
            '<div class="person"><div class="name">toto</div><div class="tel">1234</div><div class="job">student</div></div>';
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode(); 
        //rootNode.debug(true);
        //rootNode.debugAccessors();
        OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(htmlRendered);
        OnAttend(rootNode.indexedRenderedDomIsValid()).DEtreVrai();
        
        model.tel.push({number: "5678"});
        mbaTemplate.render(model);
        htmlRendered = 
            '<div class="person"><div class="name">toto</div><div class="tel">1234</div><div class="tel">5678</div>'+
            '<div class="job">student</div></div>';
        //rootNode.debug(true);
        OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(htmlRendered);
        OnAttend(rootNode.indexedRenderedDomIsValid()).DEtreVrai();
    });
    
   Ca('teste que les éléments à la racine sont insérés dans le dom existant au bon endroit même '
       +'si la racine contenait d\'autres éléments', function(){
        var html = '<div class="message"></div><div id="stuff"></div>';
        var directive = {"r00t" : ".message", "text": ".message"};
        var model = [{text: 'tutu'}];
                
        var root = document.createElement('div');
        var mamba = new Mamba(model, html, directive, root);
        mamba.setOptions({debug: false});
        mamba.render();

        OnAttend(root.innerHTML).DEtreEgalA('<div class="message">tutu</div><div id="stuff"></div>');
        model.push({text: 'toto'});
        mamba.render(model);
        OnAttend(root.innerHTML).DEtreEgalA('<div class="message">tutu</div><div class="message">toto</div><div id="stuff"></div>');
    });
    
     Ca('teste que les éléments à la racine sont insérés dans le dom existant au bon endroit', function(){
        var html = '<div class="message"></div><div id="stuff"></div>';
        var directive = {"r00t" : ".message", "text": ".message"};
        var model = [{text: 'tutu'}];
        
        var mbaTemplate = new MbaTemplate(html, directive);
        mbaTemplate.render(model);
        var messages = mbaTemplate.getRenderedDom();
        var root = document.createElement('div');
        root.id = 'root';
        
        for(var i=0 ; i<messages.getLength() ; i++){
            root.appendChild(messages.getElement(i));
        }
        
        var mbaRoot = new MbaDomSingle(root);
        OnAttend(mbaRoot.toString()).DEtreEgalA('<div id="root"><div class="message">tutu</div><div id="stuff"></div></div>');
         
        model.push({text: 'toto'});
        mbaTemplate.render(model);
        OnAttend(mbaRoot.toString()).DEtreEgalA('<div id="root"><div class="message">tutu</div><div class="message">toto</div><div id="stuff"></div></div>');
    });
    
    Ca('teste que les éléments à la racine sont insérés dans le dom existant', function(){
        var html = '<div class="message"></div>';
        var directive = {"r00t" : ".message", "text": ".message"};
        var model = [{text: 'tutu'}];
        
        var root = document.createElement('div');
        var mamba = new Mamba(model, html, directive, root);
        mamba.setOptions({debug: false});
        mamba.render();
        
        OnAttend(root.innerHTML).DEtreEgalA('<div class="message">tutu</div>');
        model.push({text: 'toto'});
        mamba.render(model);
        OnAttend(root.innerHTML).DEtreEgalA('<div class="message">tutu</div><div class="message">toto</div>');
    });
    
    Ca('teste l\'appel d\'une méthode sur un évènement, ancre utilisée pour un binding', function(){
        var html = '<div id="toto"></div>';
        var directive = {"name": "#toto@attr",
                         "/doIt" : "#toto->click"};
        var model = {name: 'tutu', didIt: false, doIt: function(){this.didIt = true;}};
        
        var mbaTemplate = new MbaTemplate(html, directive);
        mbaTemplate.render(model);
        //mbaTemplate.getRootNode().debug(true);
        var dom = mbaTemplate.getRenderedDom();
        var toto = mbaTemplate.selectInRenderedDom('#toto')[0];
        OnAttend(dom.toString()).DEtreEgalA('<div attr="tutu" id="toto"></div>');
        OnAttend(model.didIt).DEtreFaux();
        
        toto.dispatchEvent(new Event('click'));
        OnAttend(model.didIt).DEtreVrai();        
    });
    
    //TODO : implémenter la résistance au changement de référence du superModel pour les actionBinding
    Ca('teste  que les action binding survivent au changement de référence du modèle.', function(){
        var html = '<div id="toto"></div>';
        var directive = {"/doIt" : "#toto->click"};
        var model = {didIt: false, doIt: function(){this.didIt = true;}};
        
        var mbaTemplate = new MbaTemplate(html, directive);
        mbaTemplate.render(model);
        var toto = mbaTemplate.selectInRenderedDom('#toto')[0];
        OnAttend(model.didIt).DEtreFaux();
        
        model = {didIt: false, doIt: function(){this.didIt = true;}};
        mbaTemplate.render(model);
                
        toto.dispatchEvent(new Event('click'));
        OnAttend(model.didIt).DEtreVrai();        
    });
    
   Ca('teste que la création des actionBinding lève une exception si l\'ancre de '
       +'l\'action n\'est pas un descendant du r00t', function(){
        var html = '<div id="root"></div><div id="toto"></div>';
        var directive = {"r00t" : "#root", "sub" : {"/doIt" : "#toto->click"}};
        var model = {sub: {didIt: false, doIt: function(){this.didIt = true;}}};
        
        try{
            var mbaTemplate = new MbaTemplate(html, directive);
            mbaTemplate.prepareForRender();
        }
        catch(e){
           OnAttend(e.code).DEtreEgalA(22);
           return;
        }
        OnAttend(false).DEtreVrai();     
    });
    
    Ca('teste l\'appel d\'une méthode du sous-modèle sur un évènement, directive avec root', function(){
        var html = '<div id="root"><div id="toto"></div></div>';
        var directive = {"r00t" : "#root", "sub" : {"/doIt" : "#toto->click"}};
        var model = {sub: {didIt: false, doIt: function(){this.didIt = true;}}};
        
        var mbaTemplate = new MbaTemplate(html, directive);
        mbaTemplate.render(model);
       // mbaTemplate.getRootNode().debug(true);
        var dom = mbaTemplate.getRenderedDom();
        var toto = mbaTemplate.selectInRenderedDom('#toto')[0];
        OnAttend(dom.toString()).DEtreEgalA(html);
        OnAttend(model.sub.didIt).DEtreFaux();
        
        toto.dispatchEvent(new Event('click'));
        OnAttend(model.sub.didIt).DEtreVrai();        
    });
    
    Ca('teste l\'appel d\'une méthode du sous-modèle sur un évènement, directive sans root', function(){
        var html = '<div id="toto"></div>';
        var directive = {"sub" : {"/doIt" : "#toto->click"}};
        var model = {sub: {didIt: false, doIt: function(){this.didIt = true;}}};
        
        var mbaTemplate = new MbaTemplate(html, directive);
        mbaTemplate.render(model);
       // mbaTemplate.getRootNode().debug(true);
        var dom = mbaTemplate.getRenderedDom();
        var toto = mbaTemplate.selectInRenderedDom('#toto')[0];
        OnAttend(dom.toString()).DEtreEgalA(html);
        OnAttend(model.sub.didIt).DEtreFaux();
        
        toto.dispatchEvent(new Event('click'));
        OnAttend(model.sub.didIt).DEtreVrai();        
    });
    
    Ca('teste l\'appel d\'une méthode sur un évènement', function(){
        var html = '<div id="toto"></div>';
        var directive = {"/doIt" : "#toto->click"};
        var model = {didIt: false, doIt: function(){this.didIt = true;}};
        
        var mbaTemplate = new MbaTemplate(html, directive);
        mbaTemplate.render(model);
        //mbaTemplate.getRootNode().debug(true);
        var dom = mbaTemplate.getRenderedDom();
        var toto = mbaTemplate.selectInRenderedDom('#toto')[0];
        OnAttend(dom.toString()).DEtreEgalA(html);
        OnAttend(model.didIt).DEtreFaux();
        
        toto.dispatchEvent(new Event('click'));
        OnAttend(model.didIt).DEtreVrai();        
    });
    
    //TODO tester sur modèle asymétrique (une branche plus profonde que l'autre)
    
    Ca('teste l\'application d\'une route vide par un MbaAccessorChain sans accesseurs', function(){
       var accessorChain = new MbaAccessorChain();
        
        var model = {tata: 'toto'};
        
        var inputRoute = [];
        var modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        var outputRoute = accessorChain.getLastRoute();
        OnAttend(modelValue).DEtreEgalA(model);      
        OnAttend(routesAreEquals(inputRoute, outputRoute)).DEtreVrai();
    });
    
    function routesAreEquals(route1, route2){
        if(route1.length != route2.length)
            return false;
        for(var i=0 ; i<route1.length ; i++){
            if(route1[i] != route2[i])
                return false;
        }
        return true;
    }
    
    Ca('teste l\'application d\'une route par le MbaAccessorChain', function(){
       var accessorChain = new MbaAccessorChain().prependAccessor(new MbaFieldAccessor('toto'));
        accessorChain.prependAccessor(new MbaFieldAccessor('titi'));
        accessorChain.prependAccessor(new MbaFieldAccessor('tata'));
        var model = {tata: [{titi: {toto: 'tutu1'}},
                            {titi: {toto: 'tutu2'}}]};
        
        var inputRoute = [0, 1, 0];
        var modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        var outputRoute = accessorChain.getLastRoute();
        OnAttend(modelValue).DEtreEgalA('tutu2');      
        OnAttend(routesAreEquals(inputRoute, outputRoute)).DEtreVrai();
    });
    

    
    Ca('teste l\'application d\'une route partielle par le MbaAccessorChain', function(){
       var accessorChain = new MbaAccessorChain().prependAccessor(new MbaFieldAccessor('toto'));
        accessorChain.prependAccessor(new MbaFieldAccessor('titi'));
        accessorChain.prependAccessor(new MbaFieldAccessor('tata'));
        var model = {tata: [{titi: {toto: 'tutu1'}},
                            {titi: {toto: 'tutu2'}}]};
        
        var inputRoute = [0, 1];
        var modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        var outputRoute = accessorChain.getLastRoute();
        OnAttend(modelValue).DEtreEgalA('tutu2');    
        OnAttend(routesAreEquals([0, 1, null], outputRoute)).DEtreVrai();
    }); 
    
     Ca('teste l\'application d\'une route avec plusieurs null par le MbaAccessorChain', function(){
       var accessorChain = new MbaAccessorChain();
        accessorChain.prependAccessor(new MbaFieldAccessor('toto'));
        accessorChain.prependAccessor(new MbaFieldAccessor('titi'));
        accessorChain.prependAccessor(new MbaFieldAccessor('tata'));
        
        var model = {tata: [{titi: [{toto: 'tutu1'}, {toto: 'tete1'}]},
                            {titi: [{toto: 'tutu2'}, {toto: 'tete2'}]}]};
        
        var inputRoute = [0, null, null];
        var modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        var outputRoute = accessorChain.getLastRoute();
        OnAttend(modelValue.length).DEtreEgalA(4); 
        OnAttend(modelValue[0]).DEtreEgalA('tutu1');
        OnAttend(modelValue[1]).DEtreEgalA('tete1');
        OnAttend(modelValue[2]).DEtreEgalA('tutu2');
        OnAttend(modelValue[3]).DEtreEgalA('tete2');
        OnAttend(routesAreEquals(inputRoute, outputRoute)).DEtreVrai();
         
        inputRoute = [null, null, null];
        modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        outputRoute = accessorChain.getLastRoute();
        OnAttend(modelValue.length).DEtreEgalA(4); 
        OnAttend(modelValue[0]).DEtreEgalA('tutu1');
        OnAttend(modelValue[1]).DEtreEgalA('tete1');
        OnAttend(modelValue[2]).DEtreEgalA('tutu2');
        OnAttend(modelValue[3]).DEtreEgalA('tete2');
        OnAttend(routesAreEquals(inputRoute, outputRoute)).DEtreVrai();
    });
    
    Ca('teste l\'application d\'une route avec un null par le MbaAccessorChain', function(){
       var accessorChain = new MbaAccessorChain();
        accessorChain.prependAccessor(new MbaFieldAccessor('toto'));
        accessorChain.prependAccessor(new MbaFieldAccessor('titi'));
        accessorChain.prependAccessor(new MbaFieldAccessor('tata'));
        
         var model = {tata: [{titi: [{toto: 'tutu1'}, {toto: 'tete1'}]},
                             {titi: [{toto: 'tutu2'}, {toto: 'tete2'}]}]};
        
        var inputRoute = [null, 1, 0];
        var modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        var outputRoute = accessorChain.getLastRoute();
        OnAttend(modelValue).DEtreEgalA('tutu2'); 
        OnAttend(routesAreEquals(inputRoute, outputRoute)).DEtreVrai();
        
        inputRoute = [0, null, 0];
        modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        outputRoute = accessorChain.getLastRoute();
        OnAttend(modelValue).DEtreEgalA('tutu1');
        OnAttend(routesAreEquals(inputRoute, outputRoute)).DEtreVrai();
        
        inputRoute = [0, null, 1];
        modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        outputRoute = accessorChain.getLastRoute();
        OnAttend(modelValue).DEtreEgalA('tete1');
        OnAttend(routesAreEquals(inputRoute, outputRoute)).DEtreVrai();
        
        inputRoute = [0, null, 2];
        modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        outputRoute = accessorChain.getLastRoute();
        OnAttend(modelValue).DEtreEgalA('tutu2');
        OnAttend(routesAreEquals(inputRoute, outputRoute)).DEtreVrai();
        
        inputRoute = [0, null, 3];
        modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        outputRoute = accessorChain.getLastRoute();
        OnAttend(modelValue).DEtreEgalA('tete2');
        OnAttend(routesAreEquals(inputRoute, outputRoute)).DEtreVrai();
        
        inputRoute = [0, 1, null];
        modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        outputRoute = accessorChain.getLastRoute();
        OnAttend(modelValue.length).DEtreEgalA(2); 
        OnAttend(modelValue[0]).DEtreEgalA('tutu2');
        OnAttend(modelValue[1]).DEtreEgalA('tete2');
        OnAttend(routesAreEquals(inputRoute, outputRoute)).DEtreVrai();
    });
    
    Ca('teste l\'application d\'une route sans null par le MbaAccessorChain', function(){
       var accessorChain = new MbaAccessorChain();
        accessorChain.prependAccessor(new MbaFieldAccessor('toto'));
        accessorChain.prependAccessor(new MbaFieldAccessor('titi'));
        accessorChain.prependAccessor(new MbaFieldAccessor('tata'));
        
         var model = {tata: [{titi: [{toto: 'tutu1'}, {toto: 'tete1'}]},
                             {titi: [{toto: 'tutu2'}, {toto: 'tete2'}]}]};
        
        var inputRoute = [0, 0, 0];
        var modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        var outputRoute = accessorChain.getLastRoute();
        OnAttend(modelValue).DEtreEgalA('tutu1');
        OnAttend(routesAreEquals(inputRoute, outputRoute)).DEtreVrai();
        
        inputRoute = [0, 0, 1];
        modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        outputRoute = accessorChain.getLastRoute();
        OnAttend(modelValue).DEtreEgalA('tete1');
        OnAttend(routesAreEquals(inputRoute, outputRoute)).DEtreVrai();
        
        inputRoute = [0, 1, 0];
        modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        outputRoute = accessorChain.getLastRoute();
        OnAttend(modelValue).DEtreEgalA('tutu2');
        OnAttend(routesAreEquals(inputRoute, outputRoute)).DEtreVrai();
        
        inputRoute = [0, 1, 1];
        modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        outputRoute = accessorChain.getLastRoute();
        OnAttend(modelValue).DEtreEgalA('tete2');
        OnAttend(routesAreEquals(inputRoute, outputRoute)).DEtreVrai();
        
        try{
            modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute([1, 0, 0]));
            OnAttend(true).DEtreFaux();
        }catch(e){ OnAttend(e.code).DEtreEgalA(35);}
        
        try{
            modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute([0, 2, 0]));
            OnAttend(true).DEtreFaux();
        }catch(e){ OnAttend(e.code).DEtreEgalA(34);}
    });
        
    Ca('teste l\'application d\'une route sur un modèle null par le MbaAccessorChain', function(){
       var accessorChain = new MbaAccessorChain();
        accessorChain.prependAccessor(new MbaFieldAccessor('toto'));
        accessorChain.prependAccessor(new MbaFieldAccessor('titi'));
        accessorChain.prependAccessor(new MbaFieldAccessor('tata'));
        
        var model = null;
        var inputRoute = [0, 1, 0];
        var modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        var outputRoute = accessorChain.getLastRoute();
        OnAttend(modelValue).DEtreNull();
        OnAttend(routesAreEquals(outputRoute, [0])).DEtreVrai();
    });
        
    Ca('teste l\'application d\'une route sur un sous-modèle null par le MbaAccessorChain', function(){
        var accessorChain = new MbaAccessorChain();
        accessorChain.prependAccessor(new MbaFieldAccessor('toto'));
        accessorChain.prependAccessor(new MbaFieldAccessor('titi'));
        accessorChain.prependAccessor(new MbaFieldAccessor('tata'));
        
        var model = {tata: null};
        var inputRoute = [0, 0, 1];
        var modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        var outputRoute = accessorChain.getLastRoute();
        OnAttend(modelValue).DEtreNull();
        OnAttend(routesAreEquals(outputRoute, [0])).DEtreVrai();
    });

    Ca('teste que l\'on peut mettre à jour une valeur du modèle en suivante une route', function(){
        var accessorChain = new MbaAccessorChain();
        accessorChain.prependAccessor(new MbaFieldAccessor('name'));
        
        var model = [{"name" : "tutu"},
                     {"name" : "titi"}];
        var route = new MbaRoute([0]);
        accessorChain.setModelValueFromRoute(model, route, 'toto');
        OnAttend(model[0].name).DEtreEgalA('toto');
        
        route = new MbaRoute([1]);
        accessorChain.setModelValueFromRoute(model, route, 'tata');
        OnAttend(model[1].name).DEtreEgalA('tata');
    });
    
    Ca('teste que l\'on peut mettre à jour une valeur du sous-modèle en suivante une route', function(){
        var accessorChain = new MbaAccessorChain();
        accessorChain.prependAccessor(new MbaFieldAccessor('prop'));
        accessorChain.prependAccessor(new MbaFieldAccessor('sub'));
        
        var model = [{"sub" : {"prop" : "toto"}},
                     {"sub" : {"prop" : "tutu"}}];
        var route = new MbaRoute([0, 0]);
        accessorChain.setModelValueFromRoute(model, route, 'toto2');
        OnAttend(model[0].sub.prop).DEtreEgalA('toto2');
         
        route = new MbaRoute([1, 0]);
        accessorChain.setModelValueFromRoute(model, route, 'tutu2');
        OnAttend(model[1].sub.prop).DEtreEgalA('tutu2');
    });
    
    Ca('teste l\'extraction des selecteur, binding et evènement sur directive minimale', function(){
        var directive = 'toto';
        var parser = new DirectiveParser();
        parser.setDirective(directive);         
        parser.computeIndexes();
        var selector = parser.extractSelector(directive);
        var binding = parser.extractBinding(directive);
        var events = parser.extractEvents(directive);
        
        OnAttend(selector).DEtreEgalA('toto');
        OnAttend(binding).DEtreNull;
        OnAttend(events).DEtreNull;
    }); 
    
    Ca('teste l\'extraction des selecteur, binding et evènement sur directive avec attribut', function(){
        var directive = 'toto@attr';
        var parser = new DirectiveParser();
        parser.setDirective(directive);         
        parser.computeIndexes();
        var selector = parser.extractSelector();
        var binding = parser.extractBinding();
        var events = parser.extractEvents();
        
        OnAttend(selector).DEtreEgalA('toto');
        OnAttend(binding).DEtreEgalA('@attr');
        OnAttend(events).DEtreNull;
    });
    
    Ca('teste l\'extraction des selecteur, binding et evènement sur directive avec attribut et paramètres', function(){
        var directive = 'toto@attr(param)';
        var parser = new DirectiveParser();
        parser.setDirective(directive);         
        parser.computeIndexes();
        var selector = parser.extractSelector();
        var binding = parser.extractBinding();
        var events = parser.extractEvents();
        
        OnAttend(selector).DEtreEgalA('toto');
        OnAttend(binding).DEtreEgalA('@attr(param)');
        OnAttend(events).DEtreNull;
    });
    
    Ca('teste l\'extraction des selecteur, binding et evènement sur directive de type propriété', function(){
        var directive = 'toto$prop';
        var parser = new DirectiveParser();
        parser.setDirective(directive);         
        parser.computeIndexes();
        var selector = parser.extractSelector();
        var binding = parser.extractBinding();
        var events = parser.extractEvents();
        
        OnAttend(selector).DEtreEgalA('toto');
        OnAttend(binding).DEtreEgalA('$prop');
        OnAttend(events).DEtreNull;
    });
    
    Ca('teste l\'extraction des selecteur, binding et evènement sur directive de type propriété, selecteur avec $', function(){
        var directive = 'toto[foo$="bar"]$prop';
        var parser = new DirectiveParser();
        parser.setDirective(directive);         
        parser.computeIndexes();
        var selector = parser.extractSelector();
        var binding = parser.extractBinding();
        var events = parser.extractEvents();
        
        OnAttend(selector).DEtreEgalA('toto[foo$="bar"]');
        OnAttend(binding).DEtreEgalA('$prop');
        OnAttend(events).DEtreNull;
    });
    
    Ca('teste l\'extraction des selecteur, binding et evènement sur directive avec fonction référencé', function(){
        var directive = 'toto$:fonctionName';
        var parser = new DirectiveParser();
        parser.setDirective(directive);         
        parser.computeIndexes();
        var selector = parser.extractSelector();
        var binding = parser.extractBinding();
        var events = parser.extractEvents();
        
        OnAttend(selector).DEtreEgalA('toto');
        OnAttend(binding).DEtreEgalA('$:fonctionName');
        OnAttend(events).DEtreNull;
    });
    
     Ca('teste l\'extraction des selecteur, binding et evènement sur directive avec fonction custom', function(){
        var directive = 'toto${function(arg1, arg2){....}}';
        var parser = new DirectiveParser();
        parser.setDirective(directive);         
        parser.computeIndexes();
        var selector = parser.extractSelector();
        var binding = parser.extractBinding();
        var events = parser.extractEvents();
        
        OnAttend(selector).DEtreEgalA('toto');
        OnAttend(binding).DEtreEgalA('${function(arg1, arg2){....}}');
        OnAttend(events).DEtreNull;
    });
    
    Ca('teste l\'extraction des selecteur, binding et evènement sur directive minimale avec evènement', function(){
        var directive = 'toto->blur';
        var parser = new DirectiveParser();
        parser.setDirective(directive);         
        parser.computeIndexes();
        var selector = parser.extractSelector(directive);
        var binding = parser.extractBinding(directive);
        var events = parser.extractEvents(directive);
        
        OnAttend(selector).DEtreEgalA('toto');
        OnAttend(binding).DEtreNull;
        OnAttend(events).DEtreEgalA('->blur');
    });
    
    Ca('teste l\'extraction des selecteur, binding et evènement sur directive avec attribut et evènement', function(){
        var directive = 'toto@attr->blur';
        var parser = new DirectiveParser();
        parser.setDirective(directive);         
        parser.computeIndexes();
        var selector = parser.extractSelector();
        var binding = parser.extractBinding();
        var events = parser.extractEvents();
        
        OnAttend(selector).DEtreEgalA('toto');
        OnAttend(binding).DEtreEgalA('@attr');
        OnAttend(events).DEtreEgalA('->blur');
    });
    
    Ca('teste l\'extraction des selecteur, binding et evènement sur directive avec attribut et paramètres et evènement', function(){
        var directive = 'toto@attr(param)->blur';
        var parser = new DirectiveParser();
        parser.setDirective(directive);         
        parser.computeIndexes();
        var selector = parser.extractSelector();
        var binding = parser.extractBinding();
        var events = parser.extractEvents();
        
        OnAttend(selector).DEtreEgalA('toto');
        OnAttend(binding).DEtreEgalA('@attr(param)');
        OnAttend(events).DEtreEgalA('->blur');
    });
    
    Ca('teste l\'extraction des selecteur, binding et evènement sur directive avec fonction référencé et evènement', function(){
        var directive = 'toto$:fonctionName->blur';
        var parser = new DirectiveParser();
        parser.setDirective(directive);         
        parser.computeIndexes();
        var selector = parser.extractSelector();
        var binding = parser.extractBinding();
        var events = parser.extractEvents();
        
        OnAttend(selector).DEtreEgalA('toto');
        OnAttend(binding).DEtreEgalA('$:fonctionName');
        OnAttend(events).DEtreEgalA('->blur');
    });
    
     Ca('teste l\'extraction des selecteur, binding et evènement sur directive avec fonction custom et evènement', function(){
        var directive = 'toto${function(arg1, arg2){....}}->blur';
        var parser = new DirectiveParser();
        parser.setDirective(directive);
        parser.computeIndexes();
        var selector = parser.extractSelector();
        var binding = parser.extractBinding();
        var events = parser.extractEvents();
        
        OnAttend(selector).DEtreEgalA('toto');
        OnAttend(binding).DEtreEgalA('${function(arg1, arg2){....}}');
        OnAttend(events).DEtreEgalA('->blur');
    });
    
    Ca('teste l\'extraction des selecteur, binding et evènement sur directive avec fonction custom contenant des symboles'
        +' spéciaux et evènement', function(){
        var directive = 'toto${function(arg1, arg2){console.log(\'@$:${->\');}}->blur';
        var parser = new DirectiveParser();
        parser.setDirective(directive);
        parser.computeIndexes();
        var selector = parser.extractSelector();
        var binding = parser.extractBinding();
        var events = parser.extractEvents();
        
        OnAttend(selector).DEtreEgalA('toto');
        OnAttend(binding).DEtreEgalA('${function(arg1, arg2){console.log(\'@$:${->\');}}');
        OnAttend(events).DEtreEgalA('->blur');
    });
    
    Ca('teste le calcule des index des fonctions custom', function(){
        var directive = 'toto${function(){...}}, titi@attr,tata${function(){//blabla}}->blur';
        var splitter = new DirectiveSplitter();
        splitter.setDirective(directive);
        var customFunctionRanges = splitter.computeCustomFunctionRanges();
        
        OnAttend(customFunctionRanges.length).DEtreEgalA(2);
        OnAttend(customFunctionRanges[0].start).DEtreEgalA(4);
        OnAttend(customFunctionRanges[0].end).DEtreEgalA(22);
        OnAttend(customFunctionRanges[1].start).DEtreEgalA(38);
        OnAttend(customFunctionRanges[1].end).DEtreEgalA(61);
    });
    
    Ca('teste le calcule des index des évènement multiples', function(){
        var directive = 'toto@attr->(blur, mouseover), titi@attr->(click, toto)';
        var splitter = new DirectiveSplitter();
        splitter.setDirective(directive);
        var eventRanges = splitter.computeMultipleEventRanges();
        
        OnAttend(eventRanges.length).DEtreEgalA(2);
        OnAttend(eventRanges[0].start).DEtreEgalA(9);
        OnAttend(eventRanges[0].end).DEtreEgalA(28);
        OnAttend(eventRanges[1].start).DEtreEgalA(39);
        OnAttend(eventRanges[1].end).DEtreEgalA(54);
    });
    
    Ca('teste la séparation des selecteurs avec fonctions custom', function(){
        var directive = 'toto${function(){,}}, titi@attr->(blur, click),tata${function(){//blabla,}}->blur';
        var splitter = new DirectiveSplitter();
        //splitter.setDirective(directive);
        var splittedDirectives = splitter.splitDirective(directive);
        
        OnAttend(splittedDirectives.length).DEtreEgalA(3);
        OnAttend(splittedDirectives[0]).DEtreEgalA('toto${function(){,}}');
        OnAttend(splittedDirectives[1]).DEtreEgalA('titi@attr->(blur, click)');
        OnAttend(splittedDirectives[2]).DEtreEgalA('tata${function(){//blabla,}}->blur');
    });
    
    Ca('teste la création d\'une transformation de texte', function(){
        var directive = 'titi';
        var directiveParser = new DirectiveParser();
        var transformation = directiveParser.createTransformation(directive);
        
        OnAttend(transformation instanceof MbaTextTransf).DEtreVrai();
    });
        
    Ca('teste la transformation de texte', function(){
        var directive = 'titi';
        var directiveParser = new DirectiveParser();
        var transformation = directiveParser.createTransformation(directive);
        var domElement = document.createTextNode('');
        
        transformation.updateDomWithModel(domElement, 'toto', null);
        OnAttend(domElement.textContent).DEtreEgalA('toto');
        
        domElement.textContent = 'tutu';
        OnAttend(transformation.readValueFromDom(domElement, 'toto')).DEtreEgalA('tutu');
    });
    
    Ca('teste la lecture du dom pour une transformation texte', function(){
        var directive = 'titi';
        var directiveParser = new DirectiveParser();
        var transformation = directiveParser.createTransformation(directive);
        var domElement = document.createTextNode('');
        
        domElement.textContent = 'tutu';
        OnAttend(transformation.readValueFromDom(domElement, 'toto')).DEtreEgalA('tutu');
    });
        
    Ca('teste la création d\'une transformation d\'attribut', function(){
        var directive = 'titi@attr';
        var directiveParser = new DirectiveParser();
        var transformation = directiveParser.createTransformation(directive);
        
        OnAttend(transformation instanceof MbaAttributeTransf).DEtreVrai();
        OnAttend(transformation.getAttribute()).DEtreEgalA('attr');
    });
    
    Ca('teste la transformation d\'attribut', function(){
        var directive = 'titi@attr';
        var directiveParser = new DirectiveParser();
        var transformation = directiveParser.createTransformation(directive);
        var domElement = document.createElement('div');
        
        transformation.updateDomWithModel(domElement, 'toto', null);
        OnAttend(domElement.getAttribute('attr')).DEtreEgalA('toto');
        
        transformation.updateDomWithModel(domElement, false, null);
        OnAttend(domElement.hasAttribute('attr')).DEtreFaux();
        
        transformation.updateDomWithModel(domElement, true, null);
        OnAttend(domElement.hasAttribute('attr')).DEtreVrai();
    });
        
    Ca('teste la lecture du dom pour une transformation d\'attribut', function(){
       var directive = 'titi@attr';
        var directiveParser = new DirectiveParser();
        var transformation = directiveParser.createTransformation(directive);
        var domElement = document.createElement('div');
        
        domElement.setAttribute('attr', 'tutu');
        OnAttend(transformation.readValueFromDom(domElement, 'toto')).DEtreEgalA('tutu');
        OnAttend(transformation.readValueFromDom(domElement, false)).DEtreVrai();
        OnAttend(transformation.readValueFromDom(domElement, true)).DEtreVrai();
        
        domElement.removeAttribute('attr');
        try{transformation.readValueFromDom(domElement, 'toto'); OnAttend(true).DEtreFaux();}catch(e){};
        OnAttend(transformation.readValueFromDom(domElement, false)).DEtreFaux();
        OnAttend(transformation.readValueFromDom(domElement, true)).DEtreFaux();
    });
    
      Ca('teste la transformation de type propriété', function(){
        var directive = 'titi$prop';
        var directiveParser = new DirectiveParser();
        var transformation = directiveParser.createTransformation(directive);
        var domElement = document.createElement('div');
        
        transformation.updateDomWithModel(domElement, 'toto', null);
        OnAttend(domElement.prop).DEtreEgalA('toto');
    });
        
    Ca('teste la lecture du dom pour une transformation de type propriété', function(){
       var directive = 'titi$prop';
        var directiveParser = new DirectiveParser();
        var transformation = directiveParser.createTransformation(directive);
        var domElement = document.createElement('div');
        
        domElement.prop = 'tutu';
        OnAttend(transformation.readValueFromDom(domElement, 'toto')).DEtreEgalA('tutu');
    });
    
    Ca('teste la création d\'une transformation de classe sans argument', function(){
        var directive = 'toto@class';
        var directiveParser = new DirectiveParser();
        var transformation = directiveParser.createTransformation(directive);
        
        OnAttend(transformation instanceof MbaClassTransf).DEtreVrai();
    });
    
     Ca('teste la transformation de classe sans argument', function(){
        var directive = 'toto@class';
        var directiveParser = new DirectiveParser();
        var transformation = directiveParser.createTransformation(directive);
        var domElement = document.createElement('div');
         
        transformation.updateDomWithModel(domElement, 'toto', null);
        OnAttend(domElement.className).DEtreEgalA('toto');
         
        transformation.updateDomWithModel(domElement, 'titi', 'toto');
        OnAttend(domElement.className).DEtreEgalA('titi');
         
        transformation.updateDomWithModel(domElement, null, 'titi');
        OnAttend(domElement.className).DEtreEgalA('');        
    });
    
    Ca('teste la transformation de classe sans argument, élément avec déjà une classe', function(){
        var directive = 'toto@class';
        var directiveParser = new DirectiveParser();
        var transformation = directiveParser.createTransformation(directive);
        var domElement = document.createElement('div');
        domElement.classList.add('tutu');
         
        transformation.updateDomWithModel(domElement, 'toto', null);
        OnAttend(domElement.className).DEtreEgalA('tutu toto');
         
        transformation.updateDomWithModel(domElement, 'titi', 'toto');
        OnAttend(domElement.className).DEtreEgalA('tutu titi');
         
        transformation.updateDomWithModel(domElement, null, 'titi');
        OnAttend(domElement.className).DEtreEgalA('tutu');             
    });
    
    Ca('teste la transformation de classe sans argument et valeur booléenne lève une exception', function(){
        var directive = 'toto@class';
        var directiveParser = new DirectiveParser();
        var transformation = directiveParser.createTransformation(directive);
        var domElement = document.createElement('div');
         
        try{
            transformation.updateDomWithModel(domElement, true, null);
        }
        catch(e){
            OnAttend(e.code).DEtreEgalA(1);
            return;
        }
        OnAttend(false).DEtreVrai();
    });
       
    Ca('teste la création d\'une transformation de classe avec argument', function(){
        var directive = 'toto@class(tutu)';
        var directiveParser = new DirectiveParser();
        var transformation = directiveParser.createTransformation(directive);
        var domElement = document.createElement('div');
        
        OnAttend(transformation instanceof MbaClassWithArgTransf).DEtreVrai();
        OnAttend(transformation.getClassName()).DEtreEgalA('tutu');
    });
    
    Ca('teste la transformation de classe avec argument', function(){
        var directive = 'toto@class(tutu)';
        var directiveParser = new DirectiveParser();
        var transformation = directiveParser.createTransformation(directive);
        var domElement = document.createElement('div');
        
        transformation.updateDomWithModel(domElement, true, null);
        OnAttend(domElement.className).DEtreEgalA('tutu');
        
        transformation.updateDomWithModel(domElement, false, null);
        OnAttend(domElement.className).DEtreEgalA('');
    });
    
    Ca('teste la transformation de classe avec argument, élément avec déjà une classe', function(){
        var directive = 'toto@class(tutu)';
        var directiveParser = new DirectiveParser();
        var transformation = directiveParser.createTransformation(directive);
        var domElement = document.createElement('div');
        domElement.classList.add('toto');
        
        transformation.updateDomWithModel(domElement, true, null);
        OnAttend(domElement.className).DEtreEgalA('toto tutu');
        
        transformation.updateDomWithModel(domElement, false, null);
        OnAttend(domElement.className).DEtreEgalA('toto');
    });
    
    Ca('teste que la transformation de classe avec argument et valeur non booléenne lève une exception', function(){
        var directive = 'toto@class(tutu)';
        var directiveParser = new DirectiveParser();
        var transformation = directiveParser.createTransformation(directive);
        var domElement = document.createElement('div');
        
        try{
            transformation.updateDomWithModel(domElement, 'true', null);
        }
        catch(e){
            OnAttend(e.code).DEtreEgalA(2);
            return;
        }
        OnAttend(false).DEtreVrai();
    });
    
    Ca('teste la lecture du dom pour une transformation classe avec argument', function(){
       var directive = 'titi@class(tutu)';
        var directiveParser = new DirectiveParser();
        var transformation = directiveParser.createTransformation(directive);
        var domElement = document.createElement('div');
        domElement.classList.add('tutu');
        
        OnAttend(transformation.readValueFromDom(domElement, true)).DEtreVrai();
        OnAttend(transformation.readValueFromDom(domElement, false)).DEtreVrai();
        
        domElement.classList.remove('tutu');
        OnAttend(transformation.readValueFromDom(domElement, true)).DEtreFaux();
        OnAttend(transformation.readValueFromDom(domElement, false)).DEtreFaux();
        
    });
        
    Ca('teste la création d\'une transformation avec fonction référencée', function(){
        var refFunction = function(domElement){domElement.id='toto';};
        MBA_CST.REF_FUNCTIONS = {myFunction : refFunction};
        var directive = 'toto$:myFunction';
        var directiveParser = new DirectiveParser();
        var transformation = directiveParser.createTransformation(directive);
        var domElement = document.createElement('div');
        
        OnAttend(transformation instanceof MbaRefFunctionTransf).DEtreVrai();
        OnAttend(transformation.getFunction()).DEtreEgalA(refFunction);
        transformation.updateDomWithModel(domElement, null, null)
        OnAttend(domElement.id).DEtreEgalA('toto');
    });
    
    Ca('teste que la création d\'une transformation avec fonction référence lève une exception si fonction non référencée', function(){
        var refFunction = function(domElement){domElement.id='toto';};
        MBA_CST.REF_FUNCTIONS = {myFunctionZZ : refFunction};
        var directive = 'toto$:myFunction';
        var directiveParser = new DirectiveParser();
        try{
            var transformation = directiveParser.createTransformation(directive);
        }
        catch(e){
            OnAttend(e.code).DEtreEgalA(3);
            return;
        }
        OnAttend(false).DEtreVrai();
    });
    
    Ca('teste la création d\'une transformation avec fonction custom', function(){
        var directive = 'toto${function(a, b){return a+b;}}';
        var directiveParser = new DirectiveParser();
        var transformation = directiveParser.createTransformation(directive);
           
        OnAttend(transformation instanceof MbaCustomFunctionTransf).DEtreVrai();
        OnAttend(transformation.getCustomFunction()(1,2)).DEtreEgalA(3);
    });
    
    Ca('teste la portée des customFunction', function(){
        var customFunctionText1 = 'function(a, b){return a+b;}';
        var customFunctionText2 = 'function(a, b){return a-b;}';
        var transformation1 = new MbaCustomFunctionTransf(customFunctionText1);
        var transformation2 = new MbaCustomFunctionTransf(customFunctionText2);
        
        OnAttend(transformation1.getCustomFunction()(1,2)).DEtreEgalA(3);
        OnAttend(transformation2.getCustomFunction()(1,2)).DEtreEgalA(-1);
    });
    
    Ca('teste que l\'on passe bien la valeur précédente du modèle à la transformation', function(){
        var html = '<div id="toto"></div>';
        var directivePrecursor = {name: '#toto${function(dom, next, prev){dom.setAttribute("prev", prev);}}'};
        var model = {name: "tutu"};
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        mbaTemplate.render(model);
        
        var htmlRendered = '<div prev="undefined" id="toto"></div>';
        OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(htmlRendered);
        
        model.name = 'tata';
        mbaTemplate.render(model);
        
        var htmlRendered = '<div prev="tutu" id="toto"></div>';
        OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(htmlRendered);
    });
    
    function getDirectivesTypes(){
        var refFunction = function(domElement){domElement.id='toto';};
        MBA_CST.REF_FUNCTIONS = {myFunction : refFunction};
        return ['titi', 'titi@attr', 'titi$prop', 'titi@class', 'titi@class(toto)', 'titi$:myFunction', 'titi${function(){}}'];        
    }
    
    Ca('teste la création des transformations avec un évènement', function(){
        var directivesTypes =  getDirectivesTypes();
        for(var i=0 ; i<directivesTypes.length; i++){
            var directive = directivesTypes[i]+'->click';
            var directiveParser = new DirectiveParser();
            var transformation = directiveParser.createTransformation(directive);
        
            var events = transformation.getEvents();
            OnAttend(events.length).DEtreEgalA(1);
            OnAttend(events[0]).DEtreEgalA('click');    
        }        
    });
    
    Ca('teste la création des transformations avec deux évènements', function(){
        var directivesTypes =  getDirectivesTypes();
        for(var i=0 ; i<directivesTypes.length; i++){
            var directive = directivesTypes[i]+'->(click, blur)';
            var directiveParser = new DirectiveParser();
            var transformation = directiveParser.createTransformation(directive);
        
            var events = transformation.getEvents();
            OnAttend(events.length).DEtreEgalA(2);
            OnAttend(events[0]).DEtreEgalA('click');    
            OnAttend(events[1]).DEtreEgalA('blur');    
        }        
    });
    
    Ca('teste la lecture du dom sur l\'évènement passé dans la directive', function(){
        var html = '<div id="toto"></div>';
        var directivePrecursor = {name: '#toto@attr->click'};
        var model = {name: "tutu"};
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        mbaTemplate.render(model);
        //mbaTemplate.getRootNode().debug(true);
        
        var toto = mbaTemplate.selectInRenderedDom('#toto')[0];
        toto.setAttribute('attr', 'tata');
        toto.dispatchEvent(new Event('click'));
        
        OnAttend(model.name).DEtreEgalA('tata');
    });
    
    Ca('teste la lecture du dom pour les textNodes passe par l\élément parent', function(){
        var html = '<div id="toto"></div>';
        var directivePrecursor = {name: '#toto->click'};
        var model = {name: "tutu"};
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        mbaTemplate.render(model);
        
        var toto = mbaTemplate.selectInRenderedDom('#toto')[0];
        var totoTextNode = toto.childNodes[0];
        totoTextNode.textContent = 'tata';
        toto.dispatchEvent(new Event('click'));
        
        OnAttend(model.name).DEtreEgalA('tata');
    });
    
     Ca('teste que la lecture du dom sur résiste au changement de référence du modèle', function(){
        var html = '<div id="toto"></div>';
        var directivePrecursor = {name: '#toto@attr->click'};
        var model = {name: "tutu"};
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        mbaTemplate.render(model);
        var model2 = {name: "toto"};
        mbaTemplate.render(model2);
        
        var toto = mbaTemplate.selectInRenderedDom('#toto')[0];
        toto.setAttribute('attr', 'tata');
        toto.dispatchEvent(new Event('click'));
        
        OnAttend(model.name).DEtreEgalA('tutu');
        OnAttend(model2.name).DEtreEgalA('tata');
    });
    
    Ca('teste que lorsque\'on lit le dom pour mettre à jour le modèle on rafraichit tout le dom qui lui correspond', function(){
        var html = '<input type="text"></input><span></span>';
        var directivePrecursor = {name: 'input$value->blur, span'};
        var model = {name: "toto"};
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        mbaTemplate.render(model);
        
        var input = mbaTemplate.selectInRenderedDom('input')[0];
        var span = mbaTemplate.selectInRenderedDom('span')[0];
        
        OnAttend(input.value).DEtreEgalA('toto');
        OnAttend(span.innerHTML).DEtreEgalA('toto');
        
        input.value = 'tutu';
        input.dispatchEvent(new Event('blur'));
        
        OnAttend(model.name).DEtreEgalA('tutu');
        OnAttend(input.value).DEtreEgalA('tutu');
        OnAttend(span.innerHTML).DEtreEgalA('tutu');
    });
    
 
        
    Ca('teste le rafraichissement sans r00t sur deux niveaux', function(){
        var html = '<input type="text" id="prop"></input><span id="prop_"></span>'
                  +'<input type="text" id="subprop"></input><span id="subprop_"></span>';
        var directivePrecursor = {"prop" : "#prop$value->blur, #prop_",
                                  "sub" : {"prop" : "#subprop$value->blur, #subprop_"}};
        var model = {"prop": "toto",
                     "sub" : {"prop" : "tutu"}};
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode();
        //rootNode.debug(true);
        
        var dom = mbaTemplate.getRenderedDom().getElements();
        var propInput = mbaTemplate.selectInRenderedDom('#prop')[0];
        var propSpan = mbaTemplate.selectInRenderedDom('#prop_')[0];
        var subPropInput = mbaTemplate.selectInRenderedDom('#subprop')[0];
        var subPropSpan = mbaTemplate.selectInRenderedDom('#subprop_')[0];
        
        OnAttend(dom[0]).DEtre(propInput);
        OnAttend(dom[1]).DEtre(propSpan);
        OnAttend(dom[2]).DEtre(subPropInput);
        OnAttend(dom[3]).DEtre(subPropSpan);
        
        OnAttend(propInput.value).DEtreEgalA('toto');
        OnAttend(propSpan.innerHTML).DEtreEgalA('toto');
        OnAttend(subPropInput.value).DEtreEgalA('tutu');
        OnAttend(subPropSpan.innerHTML).DEtreEgalA('tutu');
        
        propInput.value = 'toto2';
        propInput.dispatchEvent(new Event('blur'));
        
        OnAttend(propInput.value).DEtreEgalA('toto2');
        OnAttend(propSpan.innerHTML).DEtreEgalA('toto2');
        OnAttend(subPropInput.value).DEtreEgalA('tutu');
        OnAttend(subPropSpan.innerHTML).DEtreEgalA('tutu');
         
        subPropInput.value = 'tutu2';
        subPropInput.dispatchEvent(new Event('blur'));
         
        OnAttend(propInput.value).DEtreEgalA('toto2');
        OnAttend(propSpan.innerHTML).DEtreEgalA('toto2');
        OnAttend(subPropInput.value).DEtreEgalA('tutu2');
        OnAttend(subPropSpan.innerHTML).DEtreEgalA('tutu2');
    });
    
     Ca('teste le rafraichissement avec r00t sur deux niveaux', function(){
        var html = '<input type="text" id="prop"></input><span id="prop_"></span>'
                  +'<input type="text" id="subprop"></input><span id="subprop_"></span>';
        var directivePrecursor = {"prop" : "#prop$value->blur, #prop_",
                                  "sub" : {"r00t" : "#subprop, #subprop_", "prop" : "#subprop$value->blur, #subprop_"}};
        var model = {"prop": "toto",
                     "sub" : {"prop" : "tutu"}};
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode();
        //rootNode.debug(true);
        
        var dom = mbaTemplate.getRenderedDom().getElements();
        var propInput = mbaTemplate.selectInRenderedDom('#prop')[0];
        var propSpan = mbaTemplate.selectInRenderedDom('#prop_')[0]
        var subPropInput = mbaTemplate.selectInRenderedDom('#subprop')[0];
        var subPropSpan = mbaTemplate.selectInRenderedDom('#subprop_')[0];
        
        OnAttend(dom[0]).DEtre(propInput);
        OnAttend(dom[1]).DEtre(propSpan);
        OnAttend(dom[2]).DEtre(subPropInput);
        OnAttend(dom[3]).DEtre(subPropSpan);
        OnAttend(propInput.value).DEtreEgalA('toto');
        OnAttend(propSpan.innerHTML).DEtreEgalA('toto');
        OnAttend(subPropInput.value).DEtreEgalA('tutu');
        OnAttend(subPropSpan.innerHTML).DEtreEgalA('tutu');
        
        propInput.value = 'toto2';
        propInput.dispatchEvent(new Event('blur'));
        
        OnAttend(propInput.value).DEtreEgalA('toto2');
        OnAttend(propSpan.innerHTML).DEtreEgalA('toto2');
        OnAttend(subPropInput.value).DEtreEgalA('tutu');
        OnAttend(subPropSpan.innerHTML).DEtreEgalA('tutu');
         
        subPropInput.value = 'tutu2';
        subPropInput.dispatchEvent(new Event('blur'));
         
        OnAttend(propInput.value).DEtreEgalA('toto2');
        OnAttend(propSpan.innerHTML).DEtreEgalA('toto2');
        OnAttend(subPropInput.value).DEtreEgalA('tutu2');
        OnAttend(subPropSpan.innerHTML).DEtreEgalA('tutu2');
    });
    
    Ca('teste le scénario 01', function(){
        var html = 
            '<div id="prop_root"><input type="text" id="prop"></input><span id="prop_"></span><div id="subprop_root"><input type="text" id="subprop"></input><span id="subprop_"></span></div></div>';
        var directivePrecursor = 
            {"r00t" : "#prop_root",
             "prop" : "#prop$value->blur, #prop_",
             "sub" : {"r00t" : "#subprop_root", 
             "prop" : "#subprop$value->blur, #subprop_"}};
        var model = 
            [{"prop": "toto",
              "sub" : [{"prop" : "tutu"}, {"prop" : "titi"}]},
             {"prop": "bob",
              "sub" : [{"prop" : "patrick"}, {"prop" : "sandy"}]}];
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode();
        //rootNode.debug(true);
        
        var renderedHtml = 
            '<div id="prop_root"><input id="prop" type="text"><span id="prop_">toto</span><div id="subprop_root"><input id="subprop" type="text"><span id="subprop_">tutu</span></div><div id="subprop_root"><input id="subprop" type="text"><span id="subprop_">titi</span></div></div><div id="prop_root"><input id="prop" type="text"><span id="prop_">bob</span><div id="subprop_root"><input id="subprop" type="text"><span id="subprop_">patrick</span></div><div id="subprop_root"><input id="subprop" type="text"><span id="subprop_">sandy</span></div></div>';
        
        var dom = mbaTemplate.getRenderedDom();
        OnAttend(dom.toString()).DEtreEgalA(renderedHtml);
        
        var totoInput = mbaTemplate.selectInRenderedDom('#prop')[0];
        var totoSpan = mbaTemplate.selectInRenderedDom('#prop_')[0];
        var bobInput = mbaTemplate.selectInRenderedDom('#prop')[1];
        var bobSpan = mbaTemplate.selectInRenderedDom('#prop_')[1];
        var tutuInput = mbaTemplate.selectInRenderedDom('#subprop')[0];
        var tutuSpan = mbaTemplate.selectInRenderedDom('#subprop_')[0];
        var titiInput = mbaTemplate.selectInRenderedDom('#subprop')[1];
        var titiSpan = mbaTemplate.selectInRenderedDom('#subprop_')[1];
        var patrickInput = mbaTemplate.selectInRenderedDom('#subprop')[2];
        var patrickSpan = mbaTemplate.selectInRenderedDom('#subprop_')[2];
        var sandyInput = mbaTemplate.selectInRenderedDom('#subprop')[3];
        var sandySpan = mbaTemplate.selectInRenderedDom('#subprop_')[3];
        
        totoInput.value += '2';
        totoInput.dispatchEvent(new Event('blur'));
        OnAttend(totoSpan.innerHTML).DEtreEgalA('toto2');
        OnAttend(bobSpan.innerHTML).DEtreEgalA('bob');
        OnAttend(tutuSpan.innerHTML).DEtreEgalA('tutu');
        OnAttend(titiSpan.innerHTML).DEtreEgalA('titi');
        OnAttend(patrickSpan.innerHTML).DEtreEgalA('patrick');
        OnAttend(sandySpan.innerHTML).DEtreEgalA('sandy');
        
        bobInput.value += '2';
        bobInput.dispatchEvent(new Event('blur'));
        OnAttend(totoSpan.innerHTML).DEtreEgalA('toto2');
        OnAttend(bobSpan.innerHTML).DEtreEgalA('bob2');
        OnAttend(tutuSpan.innerHTML).DEtreEgalA('tutu');
        OnAttend(titiSpan.innerHTML).DEtreEgalA('titi');
        OnAttend(patrickSpan.innerHTML).DEtreEgalA('patrick');
        OnAttend(sandySpan.innerHTML).DEtreEgalA('sandy');
        
        tutuInput.value += '2';
        tutuInput.dispatchEvent(new Event('blur'));
        OnAttend(totoSpan.innerHTML).DEtreEgalA('toto2');
        OnAttend(bobSpan.innerHTML).DEtreEgalA('bob2');
        OnAttend(tutuSpan.innerHTML).DEtreEgalA('tutu2');
        OnAttend(titiSpan.innerHTML).DEtreEgalA('titi');
        OnAttend(patrickSpan.innerHTML).DEtreEgalA('patrick');
        OnAttend(sandySpan.innerHTML).DEtreEgalA('sandy');
        
        titiInput.value += '2';
        titiInput.dispatchEvent(new Event('blur'));
        OnAttend(totoSpan.innerHTML).DEtreEgalA('toto2');
        OnAttend(bobSpan.innerHTML).DEtreEgalA('bob2');
        OnAttend(tutuSpan.innerHTML).DEtreEgalA('tutu2');
        OnAttend(titiSpan.innerHTML).DEtreEgalA('titi2');
        OnAttend(patrickSpan.innerHTML).DEtreEgalA('patrick');
        OnAttend(sandySpan.innerHTML).DEtreEgalA('sandy');
        
        patrickInput.value += '2';
        patrickInput.dispatchEvent(new Event('blur'));
        OnAttend(totoSpan.innerHTML).DEtreEgalA('toto2');
        OnAttend(bobSpan.innerHTML).DEtreEgalA('bob2');
        OnAttend(tutuSpan.innerHTML).DEtreEgalA('tutu2');
        OnAttend(titiSpan.innerHTML).DEtreEgalA('titi2');
        OnAttend(patrickSpan.innerHTML).DEtreEgalA('patrick2');
        OnAttend(sandySpan.innerHTML).DEtreEgalA('sandy');
        
        sandyInput.value += '2';
        sandyInput.dispatchEvent(new Event('blur'));
        OnAttend(totoSpan.innerHTML).DEtreEgalA('toto2');
        OnAttend(bobSpan.innerHTML).DEtreEgalA('bob2');
        OnAttend(tutuSpan.innerHTML).DEtreEgalA('tutu2');
        OnAttend(titiSpan.innerHTML).DEtreEgalA('titi2');
        OnAttend(patrickSpan.innerHTML).DEtreEgalA('patrick2');
        OnAttend(sandySpan.innerHTML).DEtreEgalA('sandy2');
    });
    
     Ca('teste le scénario 02', function(){
        var html = 
            '<input type="text" id="prop"></input><span id="prop_"></span><input type="text" id="subprop"></input><span id="subprop_"></span>';
        var directivePrecursor = 
            {"r00t" : "#prop, #prop_",
             "prop" : "#prop$value->blur, #prop_",
             "sub" : {"r00t" : "#subprop, #subprop_", 
                      "prop" : "#subprop$value->blur, #subprop_"}};
        var model = 
            [{"prop": "toto",
              "sub" : [{"prop" : "tutu"}, {"prop" : "titi"}]},
             {"prop": "bob",
              "sub" : [{"prop" : "patrick"}, {"prop" : "sandy"}]}];
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode();
        //rootNode.debug(true);
        
        var renderedHtml = 
            '<input id="prop" type="text"><span id="prop_">toto</span><input id="prop" type="text"><span id="prop_">bob</span><input id="subprop" type="text"><span id="subprop_">tutu</span><input id="subprop" type="text"><span id="subprop_">titi</span><input id="subprop" type="text"><span id="subprop_">patrick</span><input id="subprop" type="text"><span id="subprop_">sandy</span>';
        
        var dom = mbaTemplate.getRenderedDom();
        OnAttend(dom.toString()).DEtreEgalA(renderedHtml);
        
        var totoInput = mbaTemplate.selectInRenderedDom('#prop')[0];
        var totoSpan = mbaTemplate.selectInRenderedDom('#prop_')[0];
        var bobInput = mbaTemplate.selectInRenderedDom('#prop')[1];
        var bobSpan = mbaTemplate.selectInRenderedDom('#prop_')[1];
        var tutuInput = mbaTemplate.selectInRenderedDom('#subprop')[0];
        var tutuSpan = mbaTemplate.selectInRenderedDom('#subprop_')[0];
        var titiInput = mbaTemplate.selectInRenderedDom('#subprop')[1];
        var titiSpan = mbaTemplate.selectInRenderedDom('#subprop_')[1];
        var patrickInput = mbaTemplate.selectInRenderedDom('#subprop')[2];
        var patrickSpan = mbaTemplate.selectInRenderedDom('#subprop_')[2];
        var sandyInput = mbaTemplate.selectInRenderedDom('#subprop')[3];
        var sandySpan = mbaTemplate.selectInRenderedDom('#subprop_')[3];
        
        totoInput.value += '2';
        totoInput.dispatchEvent(new Event('blur'));
        OnAttend(totoSpan.innerHTML).DEtreEgalA('toto2');
        OnAttend(bobSpan.innerHTML).DEtreEgalA('bob');
        OnAttend(tutuSpan.innerHTML).DEtreEgalA('tutu');
        OnAttend(titiSpan.innerHTML).DEtreEgalA('titi');
        OnAttend(patrickSpan.innerHTML).DEtreEgalA('patrick');
        OnAttend(sandySpan.innerHTML).DEtreEgalA('sandy');
        
        bobInput.value += '2';
        bobInput.dispatchEvent(new Event('blur'));
        OnAttend(totoSpan.innerHTML).DEtreEgalA('toto2');
        OnAttend(bobSpan.innerHTML).DEtreEgalA('bob2');
        OnAttend(tutuSpan.innerHTML).DEtreEgalA('tutu');
        OnAttend(titiSpan.innerHTML).DEtreEgalA('titi');
        OnAttend(patrickSpan.innerHTML).DEtreEgalA('patrick');
        OnAttend(sandySpan.innerHTML).DEtreEgalA('sandy');
        
        tutuInput.value += '2';
        tutuInput.dispatchEvent(new Event('blur'));
        OnAttend(totoSpan.innerHTML).DEtreEgalA('toto2');
        OnAttend(bobSpan.innerHTML).DEtreEgalA('bob2');
        OnAttend(tutuSpan.innerHTML).DEtreEgalA('tutu2');
        OnAttend(titiSpan.innerHTML).DEtreEgalA('titi');
        OnAttend(patrickSpan.innerHTML).DEtreEgalA('patrick');
        OnAttend(sandySpan.innerHTML).DEtreEgalA('sandy');
        
        titiInput.value += '2';
        titiInput.dispatchEvent(new Event('blur'));
        OnAttend(totoSpan.innerHTML).DEtreEgalA('toto2');
        OnAttend(bobSpan.innerHTML).DEtreEgalA('bob2');
        OnAttend(tutuSpan.innerHTML).DEtreEgalA('tutu2');
        OnAttend(titiSpan.innerHTML).DEtreEgalA('titi2');
        OnAttend(patrickSpan.innerHTML).DEtreEgalA('patrick');
        OnAttend(sandySpan.innerHTML).DEtreEgalA('sandy');
        
        patrickInput.value += '2';
        patrickInput.dispatchEvent(new Event('blur'));
        OnAttend(totoSpan.innerHTML).DEtreEgalA('toto2');
        OnAttend(bobSpan.innerHTML).DEtreEgalA('bob2');
        OnAttend(tutuSpan.innerHTML).DEtreEgalA('tutu2');
        OnAttend(titiSpan.innerHTML).DEtreEgalA('titi2');
        OnAttend(patrickSpan.innerHTML).DEtreEgalA('patrick2');
        OnAttend(sandySpan.innerHTML).DEtreEgalA('sandy');
        
        sandyInput.value += '2';
        sandyInput.dispatchEvent(new Event('blur'));
        OnAttend(totoSpan.innerHTML).DEtreEgalA('toto2');
        OnAttend(bobSpan.innerHTML).DEtreEgalA('bob2');
        OnAttend(tutuSpan.innerHTML).DEtreEgalA('tutu2');
        OnAttend(titiSpan.innerHTML).DEtreEgalA('titi2');
        OnAttend(patrickSpan.innerHTML).DEtreEgalA('patrick2');
        OnAttend(sandySpan.innerHTML).DEtreEgalA('sandy2');
    });
    
       Ca('teste le scénario 03', function(){
        var html = 
            '<div id="prop_root"><input type="text" id="prop"></input><span id="prop_"></span></div><div id="subprop_root"><input type="text" id="subprop"></input><span id="subprop_"></span></div>';
        var directivePrecursor = 
            {"r00t" : "#prop_root",
             "prop" : "#prop$value->blur, #prop_",
             "sub" : {"r00t" : "#subprop_root", 
             "prop" : "#subprop$value->blur, #subprop_"}};
        var model = 
            [{"prop": "toto",
              "sub" : [{"prop" : "tutu"}, {"prop" : "titi"}]},
             {"prop": "bob",
              "sub" : [{"prop" : "patrick"}, {"prop" : "sandy"}]}];
        var mbaTemplate = new MbaTemplate(html, directivePrecursor);
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode();
        //rootNode.debug(true);
        
        var renderedHtml = 
            '<div id="prop_root"><input id="prop" type="text"><span id="prop_">toto</span></div><div id="prop_root"><input id="prop" type="text"><span id="prop_">bob</span></div><div id="subprop_root"><input id="subprop" type="text"><span id="subprop_">tutu</span></div><div id="subprop_root"><input id="subprop" type="text"><span id="subprop_">titi</span></div><div id="subprop_root"><input id="subprop" type="text"><span id="subprop_">patrick</span></div><div id="subprop_root"><input id="subprop" type="text"><span id="subprop_">sandy</span></div>';
        
        var dom = mbaTemplate.getRenderedDom();
        OnAttend(dom.toString()).DEtreEgalA(renderedHtml);
        
        var totoInput = mbaTemplate.selectInRenderedDom('#prop')[0];
        var totoSpan = mbaTemplate.selectInRenderedDom('#prop_')[0];
        var bobInput = mbaTemplate.selectInRenderedDom('#prop')[1];
        var bobSpan = mbaTemplate.selectInRenderedDom('#prop_')[1];
        var tutuInput = mbaTemplate.selectInRenderedDom('#subprop')[0];
        var tutuSpan = mbaTemplate.selectInRenderedDom('#subprop_')[0];
        var titiInput = mbaTemplate.selectInRenderedDom('#subprop')[1];
        var titiSpan = mbaTemplate.selectInRenderedDom('#subprop_')[1];
        var patrickInput = mbaTemplate.selectInRenderedDom('#subprop')[2];
        var patrickSpan = mbaTemplate.selectInRenderedDom('#subprop_')[2];
        var sandyInput = mbaTemplate.selectInRenderedDom('#subprop')[3];
        var sandySpan = mbaTemplate.selectInRenderedDom('#subprop_')[3];
        
        totoInput.value += '2';
        totoInput.dispatchEvent(new Event('blur'));
        OnAttend(totoSpan.innerHTML).DEtreEgalA('toto2');
        OnAttend(bobSpan.innerHTML).DEtreEgalA('bob');
        OnAttend(tutuSpan.innerHTML).DEtreEgalA('tutu');
        OnAttend(titiSpan.innerHTML).DEtreEgalA('titi');
        OnAttend(patrickSpan.innerHTML).DEtreEgalA('patrick');
        OnAttend(sandySpan.innerHTML).DEtreEgalA('sandy');
        
        bobInput.value += '2';
        bobInput.dispatchEvent(new Event('blur'));
        OnAttend(totoSpan.innerHTML).DEtreEgalA('toto2');
        OnAttend(bobSpan.innerHTML).DEtreEgalA('bob2');
        OnAttend(tutuSpan.innerHTML).DEtreEgalA('tutu');
        OnAttend(titiSpan.innerHTML).DEtreEgalA('titi');
        OnAttend(patrickSpan.innerHTML).DEtreEgalA('patrick');
        OnAttend(sandySpan.innerHTML).DEtreEgalA('sandy');
        
        tutuInput.value += '2';
        tutuInput.dispatchEvent(new Event('blur'));
        OnAttend(totoSpan.innerHTML).DEtreEgalA('toto2');
        OnAttend(bobSpan.innerHTML).DEtreEgalA('bob2');
        OnAttend(tutuSpan.innerHTML).DEtreEgalA('tutu2');
        OnAttend(titiSpan.innerHTML).DEtreEgalA('titi');
        OnAttend(patrickSpan.innerHTML).DEtreEgalA('patrick');
        OnAttend(sandySpan.innerHTML).DEtreEgalA('sandy');
        
        titiInput.value += '2';
        titiInput.dispatchEvent(new Event('blur'));
        OnAttend(totoSpan.innerHTML).DEtreEgalA('toto2');
        OnAttend(bobSpan.innerHTML).DEtreEgalA('bob2');
        OnAttend(tutuSpan.innerHTML).DEtreEgalA('tutu2');
        OnAttend(titiSpan.innerHTML).DEtreEgalA('titi2');
        OnAttend(patrickSpan.innerHTML).DEtreEgalA('patrick');
        OnAttend(sandySpan.innerHTML).DEtreEgalA('sandy');
        
        patrickInput.value += '2';
        patrickInput.dispatchEvent(new Event('blur'));
        OnAttend(totoSpan.innerHTML).DEtreEgalA('toto2');
        OnAttend(bobSpan.innerHTML).DEtreEgalA('bob2');
        OnAttend(tutuSpan.innerHTML).DEtreEgalA('tutu2');
        OnAttend(titiSpan.innerHTML).DEtreEgalA('titi2');
        OnAttend(patrickSpan.innerHTML).DEtreEgalA('patrick2');
        OnAttend(sandySpan.innerHTML).DEtreEgalA('sandy');
        
        sandyInput.value += '2';
        sandyInput.dispatchEvent(new Event('blur'));
        OnAttend(totoSpan.innerHTML).DEtreEgalA('toto2');
        OnAttend(bobSpan.innerHTML).DEtreEgalA('bob2');
        OnAttend(tutuSpan.innerHTML).DEtreEgalA('tutu2');
        OnAttend(titiSpan.innerHTML).DEtreEgalA('titi2');
        OnAttend(patrickSpan.innerHTML).DEtreEgalA('patrick2');
        OnAttend(sandySpan.innerHTML).DEtreEgalA('sandy2');
    });
    
    Ca('teste que l\'on appelle d\'abord le rendu des enfants puis celui du parent', function(){
        var html = '<select><option/></select>';
        var model =  
            {"selection" : "tata", 
             "options" : [{"val" : "toto"},
                          {"val" : "tutu"}, 
                          {"val" : "tata"}, 
                          {"val" : "titi"}]};
        var directive = 
            {"selection" : "select$value",
             "options" : {"r00t" : "option", 
                          "val" : "option"}};
        var mbaTemplate = new MbaTemplate(html, directive);
        mbaTemplate.render(model);
        
        var dom = mbaTemplate.getRenderedDom();
        var select = mbaTemplate.selectInRenderedDom('select')[0];
        var renderedHtml = '<select><option>toto</option><option>tutu</option><option>tata</option><option>titi</option></select>';
        OnAttend(dom.toString()).DEtreEgalA(renderedHtml);   
        OnAttend(select.value).DEtreEgalA('tata');
    });
    
    
  Ca('teste que l\'on supprime un élément à la racine de son parent si son modèle est supprimé', function(){
        var html = '<div class="test"></div>';
        var model = [{text: 'toto'}, {text: 'tutu'}];
        var directive = {r00t: '.test', text: '.test'};
        
        var root = document.createElement('div');
        var mamba = new Mamba(model, html, directive, root);
        mamba.setOptions({debug: false});
        mamba.render(); 
      
        OnAttend(root.innerHTML).DEtreEgalA('<div class="test">toto</div><div class="test">tutu</div>');
        
        model.pop();
        mamba.render(model);
        OnAttend(root.innerHTML).DEtreEgalA('<div class="test">toto</div>');
    });
    
    Ca('teste le scénario 04', function(){
        var html = 
            '<div class="message"></div><input id="button" type="button"></input>';
        var directive =
            {"messages" : {"r00t" : ".message", "text": ".message"},
             "/addMessage" : "#button->click"};
        var model = 
            {messages: [],
             addMessage: function(){this.messages.push({text: 'toto'});}};
        
        var root = renderIntoRoot(model, html, directive);
        var button = root.childNodes[0];
        button.dispatchEvent(new Event('click'));
        OnAttend(root.innerHTML).DEtreEgalA('<div class="message">toto</div><input id="button" type="button">');
    });
    
    function getHtmlDirectiveAndModelForManualDomUpdate(){
        var result = {};
        result.html = 
            '<div class="anime"><div class="name"></div><div class="ep_number"></div><div class="ep_name"></div></div>';
        result.directive = 
            {"video" : 
                {"animes" : 
                    {"r00t" : ".anime",
                     "name" : ".name",
                     "episodes" : 
                        {"r00t"   : ".ep_number, .ep_name",
                         "number" : ".ep_number",
                         "name"   : ".ep_name"}}}};
        result.model = 
            {video : 
                {animes: 
                    [{name: 'SpongeBob SquarePants', 
                     episodes: [{number: '01a', name: 'Help Wanted'},
                               {number: '01b', name: 'Reef Blower'}]},
                     {name: 'Dragon Ball', 
                     episodes: [{number: '01', name: 'Bulma and Son Goku'},
                               {number: '02', name: 'What the...?! No Balls!'}]}]}};
        return result;
    }
    
    Ca('test que la mise à jour du sous-modèle sans binding mais avec une liste d\'enfants avec binding', function(){
        var data = getHtmlDirectiveAndModelForManualDomUpdate();
        var html = data.html;
        var directive = data.directive;
        var model = data.model;
        var mamba = new Mamba(model, html, directive);
        mamba.setOptions({debug: false});
        var renderedDom = mamba.render();
        
        model.video.animes.pop();
        var renderedDom = mamba.refresh(model.video);
        //mamba.debugNodes();
        //mamba.debugDirective();
        
        var expectedHtml = 
            '<div class="anime"><div class="name">SpongeBob SquarePants</div><div class="ep_number">01a</div><div class="ep_name">Help Wanted</div><div class="ep_number">01b</div><div class="ep_name">Reef Blower</div></div>';        
        OnAttend(new MbaDom(renderedDom).toString()).DEtreEgalA(expectedHtml);
    });
    
    Ca('test que la mise à jour du sous-modèle fonctionne avec un modèle incomplet', function(){
        var data = getHtmlDirectiveAndModelForManualDomUpdate();
        var html = data.html;
        var directive = data.directive;
        var model = data.model;
        model.video.animes[1].episodes = null;
        var mamba = new MbaTemplate(html, directive);
        mamba.render(model);
        mamba.updateDomForModel(model.video.animes[1]);
        
        var renderedDom = mamba.getRenderedDom();
        var expectedHtml = 
            '<div class="anime"><div class="name">SpongeBob SquarePants</div><div class="ep_number">01a</div><div class="ep_name">Help Wanted</div><div class="ep_number">01b</div><div class="ep_name">Reef Blower</div></div><div class="anime"><div class="name">Dragon Ball</div></div>';        
        OnAttend(renderedDom.toString()).DEtreEgalA(expectedHtml);
    });
    
    Ca('lève une exception si le modèle n\'est pas un sous-modèle du super modèle', function(){
        var data = getHtmlDirectiveAndModelForManualDomUpdate();
        var html = data.html;
        var directive = data.directive;
        var model = data.model;
        var mamba = new MbaTemplate(html, directive);
        mamba.render(model);
        try{
            mamba.updateDomForModel({});
        }
        catch(e){
            OnAttend(e.message).DEtreEgalA('Passed model is not a sub model of super model');
            return;
        }
        OnAttend(false).DEtreVrai();
    });
    

    Ca('teste la récupération du dernier modèle pour une route vide par un MbaAccessorChain sans accesseurs', function(){
        var accessorChain = new MbaAccessorChain();
        var model = {tata: 'toto'};
        
        var inputRoute = [];
        var modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        var lastModel = accessorChain.getLastModel();
        OnAttend(lastModel).DEtreEgalA(model);      
    });
    
    Ca('teste la récupération du dernier modèle pour une route', function(){
        var accessorChain = new MbaAccessorChain().prependAccessor(new MbaFieldAccessor('toto'));
        accessorChain.prependAccessor(new MbaFieldAccessor('titi'));
        accessorChain.prependAccessor(new MbaFieldAccessor('tata'));
        var model = {tata: [{titi: {toto: 'tutu1'}},
                            {titi: {toto: 'tutu2'}}]};
        
        var inputRoute = [0, 1, 0];
        var modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        var lastModel = accessorChain.getLastModel();
        OnAttend(lastModel).DEtreEgalA(model.tata[1].titi);
    });
    
    Ca('teste la récupération du dernier modèle pour une route partielle', function(){
        var accessorChain = new MbaAccessorChain().prependAccessor(new MbaFieldAccessor('toto'));
        accessorChain.prependAccessor(new MbaFieldAccessor('titi'));
        accessorChain.prependAccessor(new MbaFieldAccessor('tata'));
        var model = {tata: [{titi: {toto: 'tutu1'}},
                            {titi: {toto: 'tutu2'}}]};
        
        var inputRoute = [0, 1];
        var modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        var lastModel = accessorChain.getLastModel();
        OnAttend(lastModel).DEtreEgalA(model.tata[1].titi);
    }); 
    
     Ca('teste la récupération du dernier modèle pour une route avec plusieurs null', function(){
        var accessorChain = new MbaAccessorChain();
        accessorChain.prependAccessor(new MbaFieldAccessor('toto'));
        accessorChain.prependAccessor(new MbaFieldAccessor('titi'));
        accessorChain.prependAccessor(new MbaFieldAccessor('tata'));
        
        var model = {tata: [{titi: [{toto: 'tutu1'}, {toto: 'tete1'}]},
                            {titi: [{toto: 'tutu2'}, {toto: 'tete2'}]}]};
        
        var inputRoute = [0, null, null];
        var modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        var lastModel = accessorChain.getLastModel();
        OnAttend(lastModel.length).DEtreEgalA(4);
        OnAttend(lastModel[0]).DEtreEgalA(model.tata[0].titi[0]);
        OnAttend(lastModel[1]).DEtreEgalA(model.tata[0].titi[1]);
        OnAttend(lastModel[2]).DEtreEgalA(model.tata[1].titi[0]);
        OnAttend(lastModel[3]).DEtreEgalA(model.tata[1].titi[1]);
         
        inputRoute = [null, null, null];
        modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        lastModel = accessorChain.getLastModel();
        OnAttend(lastModel.length).DEtreEgalA(4);
        OnAttend(lastModel[0]).DEtreEgalA(model.tata[0].titi[0]);
        OnAttend(lastModel[1]).DEtreEgalA(model.tata[0].titi[1]);
        OnAttend(lastModel[2]).DEtreEgalA(model.tata[1].titi[0]);
        OnAttend(lastModel[3]).DEtreEgalA(model.tata[1].titi[1]);
    });
    
    Ca('teste la récupération du dernier modèle pour une route avec un null', function(){
       var accessorChain = new MbaAccessorChain();
        accessorChain.prependAccessor(new MbaFieldAccessor('toto'));
        accessorChain.prependAccessor(new MbaFieldAccessor('titi'));
        accessorChain.prependAccessor(new MbaFieldAccessor('tata'));
        
         var model = {tata: [{titi: [{toto: 'tutu1'}, {toto: 'tete1'}]},
                             {titi: [{toto: 'tutu2'}, {toto: 'tete2'}]}]};
        
        var inputRoute = [null, 1, 0];
        var modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        var lastModel = accessorChain.getLastModel();
        OnAttend(lastModel).DEtreEgalA(model.tata[1].titi[0]);
        
        inputRoute = [0, null, 0];
        modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        lastModel = accessorChain.getLastModel();
        OnAttend(lastModel).DEtreEgalA(model.tata[0].titi[0]);
        
        inputRoute = [0, null, 1];
        modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        lastModel = accessorChain.getLastModel();
        OnAttend(lastModel).DEtreEgalA(model.tata[0].titi[1]);
        
        inputRoute = [0, null, 2];
        modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        lastModel = accessorChain.getLastModel();
        OnAttend(lastModel).DEtreEgalA(model.tata[1].titi[0]);
        
        inputRoute = [0, null, 3];
        modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        lastModel = accessorChain.getLastModel();
        OnAttend(lastModel).DEtreEgalA(model.tata[1].titi[1]);
        
        inputRoute = [0, 1, null];
        modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        lastModel = accessorChain.getLastModel();
        OnAttend(lastModel.length).DEtreEgalA(2);
        OnAttend(lastModel[0]).DEtreEgalA(model.tata[1].titi[0]);
        OnAttend(lastModel[1]).DEtreEgalA(model.tata[1].titi[1]);
    });
    
    Ca('teste l\'application d\'une route sans null', function(){
       var accessorChain = new MbaAccessorChain();
        accessorChain.prependAccessor(new MbaFieldAccessor('toto'));
        accessorChain.prependAccessor(new MbaFieldAccessor('titi'));
        accessorChain.prependAccessor(new MbaFieldAccessor('tata'));
        
         var model = {tata: [{titi: [{toto: 'tutu1'}, {toto: 'tete1'}]},
                             {titi: [{toto: 'tutu2'}, {toto: 'tete2'}]}]};
        
        var inputRoute = [0, 0, 0];
        var modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        var lastModel = accessorChain.getLastModel();
        OnAttend(lastModel).DEtreEgalA(model.tata[0].titi[0]);
        
        inputRoute = [0, 0, 1];
        modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        lastModel = accessorChain.getLastModel();
        OnAttend(lastModel).DEtreEgalA(model.tata[0].titi[1]);
        
        inputRoute = [0, 1, 0];
        modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        lastModel = accessorChain.getLastModel();
        OnAttend(lastModel).DEtreEgalA(model.tata[1].titi[0]);
        
        inputRoute = [0, 1, 1];
        modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        lastModel = accessorChain.getLastModel();
        OnAttend(lastModel).DEtreEgalA(model.tata[1].titi[1]);
        
        try{
            modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute([1, 0, 0]));
            OnAttend(true).DEtreFaux();
        }catch(e){ OnAttend(e.code).DEtreEgalA(35);}
    });
     
    Ca('teste le scénario de la demo 01', function(){
        var html = 
            '<div class="messages"></div>'+
            '<input id="message" type="text"></input>'+
            '<input id="add" type="button" value="Ajouter"></input>'+
            '<input id="delete" type="button" value="Vider"></input>';
        
        var model = 
            {messages: [],
             addMessage: function(){this.messages.push({text :this.newMessage});this.newMessage='';},
             vider: function(){this.messages = [];},
             newMessage: '', 
             placeHolder: 'taper un message ici'};
    
        var directive = 
            {"messages" : {"r00t" : ".messages", "text": ".messages"},
             "newMessage" : "#message$value->blur",
             "placeHolder" : "#message@placeholder",
             "/addMessage" : "#add->click", 
             "/vider" : "#delete->click"};
        
        var mamba = new MbaTemplate(html, directive);
        mamba.render(model);
        //mamba.getRootNode().debug(true);
        var dom = mamba.getRenderedDom();
        var expectedHtml = '<input placeholder="taper un message ici" id="message" type="text"><input id="add" value="Ajouter" type="button"><input id="delete" value="Vider" type="button">';
        OnAttend(dom.toString()).DEtreEgalA(expectedHtml);   
        
        var messageInput = mamba.selectInRenderedDom('#message')[0];
        var addBtn = mamba.selectInRenderedDom('#add')[0];
        var deleteBtn = mamba.selectInRenderedDom('#delete')[0];
        
        messageInput.value = 'toto';
        messageInput.dispatchEvent(new Event('blur'));
        OnAttend(model.newMessage).DEtreEgalA('toto');
        
        addBtn.dispatchEvent(new Event('click'));
        OnAttend(model.newMessage).DEtreEgalA('');
        OnAttend(model.messages.length).DEtreEgalA(1);
        OnAttend(model.messages[0].text).DEtreEgalA('toto');
        expectedHtml = '<div class="messages">toto</div><input placeholder="taper un message ici" id="message" type="text"><input id="add" value="Ajouter" type="button"><input id="delete" value="Vider" type="button">';
        dom = mamba.getRenderedDom();
        OnAttend(dom.toString()).DEtreEgalA(expectedHtml);  
        OnAttend(messageInput.value).DEtreEgalA('');
        
        messageInput.value = 'tutu';
        messageInput.dispatchEvent(new Event('blur'));
        OnAttend(model.newMessage).DEtreEgalA('tutu');
        
        addBtn.dispatchEvent(new Event('click'));
        OnAttend(model.newMessage).DEtreEgalA('');
        OnAttend(model.messages.length).DEtreEgalA(2);
        OnAttend(model.messages[0].text).DEtreEgalA('toto');
        OnAttend(model.messages[1].text).DEtreEgalA('tutu');
        expectedHtml = '<div class="messages">toto</div><div class="messages">tutu</div><input placeholder="taper un message ici" id="message" type="text"><input id="add" value="Ajouter" type="button"><input id="delete" value="Vider" type="button">';
        dom = mamba.getRenderedDom();
        OnAttend(dom.toString()).DEtreEgalA(expectedHtml);  
        OnAttend(messageInput.value).DEtreEgalA('');
        
        deleteBtn.dispatchEvent(new Event('click'));
        OnAttend(model.messages.length).DEtreEgalA(0);
        expectedHtml = '<input placeholder="taper un message ici" id="message" type="text"><input id="add" value="Ajouter" type="button"><input id="delete" value="Vider" type="button">';
        dom = mamba.getRenderedDom();
        OnAttend(dom.toString()).DEtreEgalA(expectedHtml);  
    });
   
    
    Ca('teste le scénario de la demo 02', function(){
        function Message(text, parent){
            this.text = text;
            this._parent = parent;
            this.remove = function(){
                this._parent.remove(this);
            }
        }
    
        function MessageCollection(){
            this.messages = [];
            this.newMessage = '';
            this.add = function(){
                this.messages.push(new Message(this.newMessage, this));
                this.newMessage = '';
            };
            this.remove = function(message){
                var index = this.messages.indexOf(message);
                this.messages.splice(index, 1);
                this.populate();
            };
            this.empty = function(){
                this.messages = [];
            };
            this.populate = function(){
                var event = new CustomEvent('populate');
                event.model = this;
                document.dispatchEvent(event);
            };
        }        
    
        var html = 
            '<div class="messages"></div>'+
            '<input id="message" type="text" placeholder="taper un message ici"></input>'+
            '<input id="addBtn" type="button" value="Ajouter"></input>'+
            '<input id="emptyBtn" type="button" value="Vider"></input>';
        
        var model = new MessageCollection();

        var directive = 
            {"messages": 
                {"r00t": ".messages", 
                 "text": ".messages", 
                 "/remove" : ".messages->click"},
             "newMessage": "#message$value->blur",
             "/add": "#addBtn->click", 
             "/empty": "#emptyBtn->click"};
        
        var root = renderIntoRoot(model, html, directive);
        var input = root.childNodes[0];
        var add = root.childNodes[1];
        var empty = root.childNodes[2];
            
        var expectedHtml = 
            '<input id="message" placeholder="taper un message ici" type="text"><input id="addBtn" value="Ajouter" type="button"><input id="emptyBtn" value="Vider" type="button">';
        OnAttend(root.innerHTML).DEtreEgalA(expectedHtml);
        
        input.value = 'toto';
        input.dispatchEvent(new Event('blur'));
        OnAttend(model.newMessage).DEtreEgalA('toto');
        add.dispatchEvent(new Event('click'));
        OnAttend(model.messages.length).DEtreEgalA(1);
        var expectedHtml = 
            '<div class="messages">toto</div><input id="message" placeholder="taper un message ici" type="text"><input id="addBtn" value="Ajouter" type="button"><input id="emptyBtn" value="Vider" type="button">';
        OnAttend(root.innerHTML).DEtreEgalA(expectedHtml);
        
        input.value = 'tutu';
        input.dispatchEvent(new Event('blur'));
        OnAttend(model.newMessage).DEtreEgalA('tutu');
        add.dispatchEvent(new Event('click'));
        OnAttend(model.messages.length).DEtreEgalA(2);
        expectedHtml = 
            '<div class="messages">toto</div><div class="messages">tutu</div><input id="message" placeholder="taper un message ici" type="text"><input id="addBtn" value="Ajouter" type="button"><input id="emptyBtn" value="Vider" type="button">';
        OnAttend(root.innerHTML).DEtreEgalA(expectedHtml);
        
        input.value = 'titi';
        input.dispatchEvent(new Event('blur'));
        OnAttend(model.newMessage).DEtreEgalA('titi');
        add.dispatchEvent(new Event('click'));
        OnAttend(model.messages.length).DEtreEgalA(3);
        expectedHtml = 
            '<div class="messages">toto</div><div class="messages">tutu</div><div class="messages">titi</div><input id="message" placeholder="taper un message ici" type="text"><input id="addBtn" value="Ajouter" type="button"><input id="emptyBtn" value="Vider" type="button">';
        OnAttend(root.innerHTML).DEtreEgalA(expectedHtml);
        
        var tutu = root.childNodes[1];
        tutu.dispatchEvent(new Event('click'));
        OnAttend(model.messages.length).DEtreEgalA(2);
        expectedHtml = 
            '<div class="messages">toto</div><div class="messages">titi</div><input id="message" placeholder="taper un message ici" type="text"><input id="addBtn" value="Ajouter" type="button"><input id="emptyBtn" value="Vider" type="button">';
        OnAttend(root.innerHTML).DEtreEgalA(expectedHtml);
        
        empty.dispatchEvent(new Event('click'));       
        OnAttend(model.messages.length).DEtreEgalA(0);
        expectedHtml = 
            '<input id="message" placeholder="taper un message ici" type="text"><input id="addBtn" value="Ajouter" type="button"><input id="emptyBtn" value="Vider" type="button">';
        OnAttend(root.innerHTML).DEtreEgalA(expectedHtml);
    });
    
    Ca('teste le scénario de la demo 03', function(){
        function Message(text, parent){
            this.text = text;
        }
        
        function MessageCollection(){
            this.messages = [];
            this.newMessage = '';
            this.add = function(){
                this.messages.push(new Message(this.newMessage, this));
                this.newMessage = '';
            };
            this.remove = function(message){
                var index = this.messages.indexOf(message);
                this.messages.splice(index, 1);
            };
            this.empty = function(){
                this.messages = [];
            };
        }
                
        var html = 
            '<div class="messages"></div>'+
            '<input id="message" type="text" placeholder="taper un message ici"></input>'+
            '<input id="addBtn" type="button" value="Ajouter"></input>'+
            '<input id="emptyBtn" type="button" value="Vider"></input>';
        
        var model = new MessageCollection();
        
        var directive = 
            {"messages": 
             {"r00t": ".messages", 
              "text": ".messages"},
             "newMessage": "#message$value->blur",
             "/add": "#addBtn->click", 
             "/empty": "#emptyBtn->click", 
             "/remove": ".messages->click"};
        
        var root = renderIntoRoot(model, html, directive);
        var input = root.childNodes[0];
        var add = root.childNodes[1];
        var empty = root.childNodes[2];
        
        var expectedHtml = 
            '<input id="message" placeholder="taper un message ici" type="text"><input id="addBtn" value="Ajouter" type="button"><input id="emptyBtn" value="Vider" type="button">';
        OnAttend(root.innerHTML).DEtreEgalA(expectedHtml);
        
        input.value = 'toto';
        input.dispatchEvent(new Event('blur'));
        OnAttend(model.newMessage).DEtreEgalA('toto');
        add.dispatchEvent(new Event('click'));
        OnAttend(model.messages.length).DEtreEgalA(1);
        var expectedHtml = 
            '<div class="messages">toto</div><input id="message" placeholder="taper un message ici" type="text"><input id="addBtn" value="Ajouter" type="button"><input id="emptyBtn" value="Vider" type="button">';
        OnAttend(root.innerHTML).DEtreEgalA(expectedHtml);
        
        input.value = 'tutu';
        input.dispatchEvent(new Event('blur'));
        OnAttend(model.newMessage).DEtreEgalA('tutu');
        add.dispatchEvent(new Event('click'));
        OnAttend(model.messages.length).DEtreEgalA(2);
        expectedHtml = 
            '<div class="messages">toto</div><div class="messages">tutu</div><input id="message" placeholder="taper un message ici" type="text"><input id="addBtn" value="Ajouter" type="button"><input id="emptyBtn" value="Vider" type="button">';
        OnAttend(root.innerHTML).DEtreEgalA(expectedHtml);
        
        input.value = 'titi';
        input.dispatchEvent(new Event('blur'));
        OnAttend(model.newMessage).DEtreEgalA('titi');
        add.dispatchEvent(new Event('click'));
        OnAttend(model.messages.length).DEtreEgalA(3);
        expectedHtml = 
            '<div class="messages">toto</div><div class="messages">tutu</div><div class="messages">titi</div><input id="message" placeholder="taper un message ici" type="text"><input id="addBtn" value="Ajouter" type="button"><input id="emptyBtn" value="Vider" type="button">';
        OnAttend(root.innerHTML).DEtreEgalA(expectedHtml);
        
        var tutu = root.childNodes[1];
        tutu.dispatchEvent(new Event('click'));
        OnAttend(model.messages.length).DEtreEgalA(2);
        expectedHtml = 
            '<div class="messages">toto</div><div class="messages">titi</div><input id="message" placeholder="taper un message ici" type="text"><input id="addBtn" value="Ajouter" type="button"><input id="emptyBtn" value="Vider" type="button">';
        OnAttend(root.innerHTML).DEtreEgalA(expectedHtml);
        
        empty.dispatchEvent(new Event('click'));       
        OnAttend(model.messages.length).DEtreEgalA(0);
        expectedHtml = 
            '<input id="message" placeholder="taper un message ici" type="text"><input id="addBtn" value="Ajouter" type="button"><input id="emptyBtn" value="Vider" type="button">';
        OnAttend(root.innerHTML).DEtreEgalA(expectedHtml);
    });    
   

    Ca('test que l\'on passe le bon modèle pour les actions sur le r00t', function(){
      var html = '<div class="element"><span></span></div>';
      var model = 
          {elements : [{name: 'toto'}, {name: 'titi'}, {name: 'tutu'}],
           remove : function(element){this.elements.splice(this.elements.indexOf(element), 1);}};
      var directive = 
          {"elements": {"r00t": ".element",
                        "name": "span"},
           "/remove": ".element->click"};
      var mamba = new MbaTemplate(html, directive);
      mamba.render(model);
      var dom = mamba.getRenderedDom();
      var titiElement = dom.getElement(1);
      
      var expectedHtml = '<div class="element"><span>toto</span></div><div class="element"><span>titi</span></div><div class="element"><span>tutu</span></div>';
      OnAttend(dom.toString()).DEtreEgalA(expectedHtml);
      titiElement.dispatchEvent(new Event('click'));
      dom = mamba.getRenderedDom();
      var expectedHtml = '<div class="element"><span>toto</span></div><div class="element"><span>tutu</span></div>';
      OnAttend(dom.toString()).DEtreEgalA(expectedHtml);
  });
        
  Ca('teste que les setter sont appelés avant les actions', function(){
        var model = 
            {text: "",
             normalizedText: "",
             toUpper: function(){this.normalizedText = this.text.toUpperCase();}};
                
        var html = 
            '<input type="text"></input><span></span>'+
            '<div></div>';
        
        var directive = 
            {"text" : "input$value->keyup, span",
             "normalizedText" : "div",
             "/toUpper" : "input->keyup"};
        
        var root = renderIntoRoot(model, html, directive);
        var input = root.childNodes[0];
        var span = root.childNodes[1];
        var div = root.childNodes[2];
      
        var expectedHtml = 
            '<input type="text"><span></span><div></div>';
        OnAttend(root.innerHTML).DEtreEgalA(expectedHtml);
        
        input.value = 'toto';
        input.dispatchEvent(new Event('keyup'));
        OnAttend(model.text).DEtreEgalA('toto');
        OnAttend(model.normalizedText).DEtreEgalA('TOTO');
    }); 
        
     Ca('teste que les evènements de binding et d\'action fonctionnent sur des nouveaux éléments', function(){
        var model = 
            {items: [],
             newItem: "",
             add: function(){this.items.push({name: this.newItem});},
             del: function(item){this.items.splice(this.items.indexOf(item), 1);}};

                
        var html = 
            '<input id="newItem" type="text"></input><button id="add">ajouter</button>'+
            '<div class="itemCont"><input class="item" type="text"></input><button class="del">suppr</button></div>';
        
        var directive = 
            {"newItem": "#newItem$value->blur",
             "items": {"r00t": ".itemCont", "name": ".item$value->keyup"},
             "/add": "#add->click",
             "/del": ".del->click"};
        
        var root = renderIntoRoot(model, html, directive);
        var newItemInput = root.childNodes[0];
        var addBtn = root.childNodes[1];
        
        var expectedHtml = 
            '<input id="newItem" type="text"><button id="add">ajouter</button>';
        OnAttend(root.innerHTML).DEtreEgalA(expectedHtml);
        
        newItemInput.value = 'toto';
        newItemInput.dispatchEvent(new Event('blur'));
        addBtn.dispatchEvent(new Event('click'));
        newItemInput.value = 'tutu';
        newItemInput.dispatchEvent(new Event('blur'));
        addBtn.dispatchEvent(new Event('click'));
        newItemInput.value = 'titi';
        newItemInput.dispatchEvent(new Event('blur'));
        addBtn.dispatchEvent(new Event('click'));
      
        OnAttend(model.items.length).DEtreEgalA(3);
        OnAttend(model.items[0].name).DEtreEgalA('toto');
        OnAttend(model.items[1].name).DEtreEgalA('tutu');
        OnAttend(model.items[2].name).DEtreEgalA('titi');
      
        var secondItemInput = root.childNodes[3].childNodes[0];
        secondItemInput.value = 'tata';
        secondItemInput.dispatchEvent(new Event('keyup'));
        OnAttend(model.items[1].name).DEtreEgalA('tata');
      
        var secondItemBtn = root.childNodes[3].childNodes[1];
        secondItemBtn.dispatchEvent(new Event('click'));
        OnAttend(model.items.length).DEtreEgalA(2);
        OnAttend(model.items[0].name).DEtreEgalA('toto');
        OnAttend(model.items[1].name).DEtreEgalA('titi');
    });
    
    Ca('teste que l\'on peut utiliser un selecteur css qui retourne plusieurs éléments du template pour le binding', function(){
        var model = {name: 'toto'};
        var directive = {name: 'span'}
        var root = document.createElement('div');
        root.id = 'root';
        root.innerHTML = '<a></a><span></span><span></span><b></b>';
        document.body.appendChild(root);
        var template = document.querySelectorAll('#root > span');
        var mamba = new Mamba(model, template, directive);
        mamba.setOptions({debug: false});
        var renderedDom = domToString(mamba.render());
        
        OnAttend(renderedDom).DEtreEgalA('<span>toto</span><span>toto</span>');
        OnAttend(domToString(root)).DEtreEgalA('<div id="root"><a></a><span>toto</span><span>toto</span><b></b></div>');
        document.body.removeChild(root);
    });
        
    Ca('teste la création de dom à partir d\'une chaine', function(){
        var stringDom = '<span id="toto"></span><div id="tutu"></div>';
        var dom = stringToDom(stringDom);
        
        OnAttend(dom.length).DEtreEgalA(2);
        OnAttend(dom[0].id).DEtreEgalA('toto');
        OnAttend(dom[1].id).DEtreEgalA('tutu');
    });
        
    Ca('teste l\'api mamba peut rafraichir un sous-modèle, config 01', function(){
      var root = document.createElement('div');
      root.id = 'root';
      var template = '<div></div><span></span>';
      var model = {name : 'toto', adress: [{number: 12}]};
      var directive = {"name" : "div", "adress" : {"r00t" : "span", "number" : "span"}};
      var mamba = new Mamba(model, template, directive, root);
        mamba.setOptions({debug: false});
      mamba.setOptions({debug: false});
      
      mamba.render();
      OnAttend(root.innerHTML).DEtreEgalA('<div>toto</div><span>12</span>');
      
      //mamba.debugNodes();
      model.name = 'tutu';
      model.adress[0].number = 27;
      mamba.refresh(model.adress[0]);
      
      OnAttend(root.innerHTML).DEtreEgalA('<div>toto</div><span>27</span>');
    });
    
    Ca('teste l\'api mamba peut rafraichir un sous-modèle, config 02', function(){
      var root = document.createElement('div');
      root.id = 'root';
      var template = '<div></div><span></span>';
      var model = {name : 'toto', adress: {number: 12}};
      var directive = {"name" : "div", "adress" : {"number" : "span"}};
      var mamba = new Mamba(model, template, directive, root);
      mamba.setOptions({debug: false});
        
      mamba.render();
      OnAttend(root.innerHTML).DEtreEgalA('<div>toto</div><span>12</span>');
      
      //mamba.debugNodes();
      model.name = 'tutu';
      model.adress.number = 27;
      mamba.refresh(model.adress);
      
      OnAttend(root.innerHTML).DEtreEgalA('<div>toto</div><span>27</span>');
    });
        
    Ca('teste l\'api mamba peut rafraichir un sous-modèle, config 03', function(){
      var root = document.createElement('div');
      root.id = 'root';
      var template = '<div></div><span></span>';
      var model = {name : 'toto', adress: {number: 12}};
      var directive = {"name" : "div", "adress" : {"r00t" : "span", "number" : "span"}};
      var mamba = new Mamba(model, template, directive, root);
      mamba.setOptions({debug: false});
        
      mamba.render();
      OnAttend(root.innerHTML).DEtreEgalA('<div>toto</div><span>12</span>');
      
      //mamba.debugNodes();
      model.name = 'tutu';
      model.adress.number = 27;
      mamba.refresh(model.adress);
      
      OnAttend(root.innerHTML).DEtreEgalA('<div>toto</div><span>27</span>');
    });

    Ca('teste l\'api mamba avec template texte et sans ancre', function(){
        var model = {name: 'toto'};
        var template = '<span></span>';
        var directive = {name: 'span'};
        var mamba = new Mamba(model, template, directive);
        mamba.setOptions({debug: false});
        var renderedDom = domToString(mamba.render());
        
        OnAttend(renderedDom).DEtreEgalA('<span>toto</span>');
    });
    
    Ca('teste l\'api mamba avec template texte et ancre dom', function(){
        var model = {name: 'toto'};
        var template = '<span></span>';
        var directive = {name: 'span'}
        var anchor = document.createElement('div');
        var mamba = new Mamba(model, template, directive, anchor);
        mamba.setOptions({debug: false});
        var renderedDom = domToString(mamba.render());
        
        OnAttend(renderedDom).DEtreEgalA('<span>toto</span>');
        OnAttend(domToString(anchor)).DEtreEgalA('<div><span>toto</span></div>');
    });
    
    Ca('teste l\'api mamba avec template texte et ancre selecteur css', function(){
        var model = {name: 'toto'};
        var template = '<span></span>';
        var directive = {name: 'span'}
        var root = document.createElement('div');
        root.id = 'root';
        document.body.appendChild(root);
        var mamba = new Mamba(model, template, directive, '#root');
        mamba.setOptions({debug: false});
        var renderedDom = domToString(mamba.render());
        
        OnAttend(renderedDom).DEtreEgalA('<span>toto</span>');
        OnAttend(domToString(root)).DEtreEgalA('<div id="root"><span>toto</span></div>');
        document.body.removeChild(root);
    });
    
    Ca('teste l\'api mamba avec template dom et sans ancre', function(){
        var model = {name: 'toto'};
        var template = '<span></span>';
        var directive = {name: 'span'}
        var root = document.createElement('div');
        root.id = 'root';
        root.innerHTML = template;
        document.body.appendChild(root);
        template = document.querySelector('#root > span');
        var mamba = new Mamba(model, template, directive);
        mamba.setOptions({debug: false});
        var renderedDom = domToString(mamba.render());
        
        OnAttend(renderedDom).DEtreEgalA('<span>toto</span>');
        OnAttend(domToString(root)).DEtreEgalA('<div id="root"><span>toto</span></div>');
        document.body.removeChild(root);
    });
    
    Ca('teste l\'api mamba avec template dom et root avec éléments existants à la racine', function(){
        var model = {name: 'toto'};
        var directive = {name: 'span'}
        var root = document.createElement('div');
        root.id = 'root';
        root.innerHTML = '<a></a><span></span><b></b>';
        document.body.appendChild(root);
        var template = document.querySelector('#root > span');
        var mamba = new Mamba(model, template, directive);
        mamba.setOptions({debug: false});
        var renderedDom = domToString(mamba.render());
        
        OnAttend(renderedDom).DEtreEgalA('<span>toto</span>');
        OnAttend(domToString(root)).DEtreEgalA('<div id="root"><a></a><span>toto</span><b></b></div>');
        document.body.removeChild(root);
    });  
    
    Ca('teste l\'api mamba avec template NodeList et root avec éléments existants à la racine', function(){
        var model = {name: 'toto'};
        var directive = {name: 'span, div'}
        var root = document.createElement('div');
        root.id = 'root';
        root.innerHTML = '<a></a><span></span><div></div><b></b>';
        document.body.appendChild(root);
        var template = document.querySelectorAll('#root > span, #root > div');
        var mamba = new Mamba(model, template, directive);
        mamba.setOptions({debug: false});
        var renderedDom = domToString(mamba.render());
        
        OnAttend(renderedDom).DEtreEgalA('<span>toto</span><div>toto</div>');
        OnAttend(domToString(root)).DEtreEgalA('<div id="root"><a></a><span>toto</span><div>toto</div><b></b></div>');
        document.body.removeChild(root);
    });  
    
    Ca('teste l\'api mamba pour refaire un rendu complet avec un autre modèle', function(){
      var root = document.createElement('div');
      root.id = 'root';
      var template = '<div></div>';
      var model = {name : 'toto'};
      var directive = {"name" : "div"};
      var mamba = new Mamba(model, template, directive, root);
      mamba.setOptions({debug: false});
        
      mamba.render();
      OnAttend(root.innerHTML).DEtreEgalA('<div>toto</div>');
      
      model = {name: 'titi'};
      mamba.render(model);
      
      OnAttend(root.innerHTML).DEtreEgalA('<div>titi</div>');
    });

    Ca('teste l\'api mamba peut tout rafraichir', function(){
      var root = document.createElement('div');
      root.id = 'root';
      var template = '<div></div><span></span>';
      var model = {name : 'toto', adress: {number: 12}};
      var directive = {"name" : "div", "adress" : {"number" : "span"}};
      var mamba = new Mamba(model, template, directive, root);
      mamba.setOptions({debug: false});
        
      mamba.render();
      OnAttend(root.innerHTML).DEtreEgalA('<div>toto</div><span>12</span>');
      
      model.name = 'tutu';
      mamba.refresh();
      
      OnAttend(root.innerHTML).DEtreEgalA('<div>tutu</div><span>12</span>');
    });
    
       Ca('teste quand on appelle refresh sur un modèle qui n\'est plus un sous-modèle du super modèle', function(){
        var model = {list: [{name : 'toto'}, {name : 'tutu'}]};
        var template = '<span></span>';
        var directive = {list : {r00t : 'span', name : 'span'}};
        var root = document.createElement('div');
        root.id = 'root';
        root.innerHTML = template;
        var mamba = new Mamba(model, root.childNodes, directive);
        mamba.setOptions({genRefresh: true, debug: false});
        mamba.render();
        
        var removedItem = model.list.pop();
        try{
            removedItem.refresh();
        }
        catch(e){
            OnAttend(e.message).DEtreEgalA('Passed model is not a sub model of super model');
            return;
        }
        OnAttend(false).DEtreVrai();
    });
    
    Ca('teste que les éléments sont supprimés suite à un refresh manuel', function(){
        var model = {list: [{name : 'toto'}, {name : 'tutu'}]};
        var template = '<span></span>';
        var directive = {list : {r00t : 'span', name : 'span'}};
        var root = document.createElement('div');
        root.id = 'root';
        root.innerHTML = template;
        var mamba = new Mamba(model, root.childNodes, directive);
        mamba.setOptions({genRefresh: true, debug: false});
        mamba.render();
        
        OnAttend(root.innerHTML).DEtreEgalA('<span>toto</span><span>tutu</span>');
        
        model.list.pop();
        model.refresh();
        
        OnAttend(root.innerHTML).DEtreEgalA('<span>toto</span>');
    });
    
    Ca('teste que les éléments sont ajoutés et leurs évènements branchés suite à un refresh manuel', function(){
        function Name (name){this.name=name;  this.upper=function(){this.name = this.name.toUpperCase();}};
        var model = {list: [new Name('toto'), new Name('tutu')]};
        var template = '<span></span>';
        var directive = {'list': {'r00t': 'span', 'name': 'span', '/upper': 'span->click'}};
        var root = document.createElement('div');
        root.id = 'root';
        root.innerHTML = template;
        var mamba = new Mamba(model, root.childNodes, directive);
        mamba.setOptions({genRefresh: true, debug: false});
        mamba.render();
        
        OnAttend(root.innerHTML).DEtreEgalA('<span>toto</span><span>tutu</span>');
        
        var spanToto = root.childNodes[0];
        spanToto.dispatchEvent(new Event('click'));
        OnAttend(root.innerHTML).DEtreEgalA('<span>TOTO</span><span>tutu</span>');
        
        var removedItem = model.list.push(new Name('tata'));
        model.refresh();
        
        OnAttend(root.innerHTML).DEtreEgalA('<span>TOTO</span><span>tutu</span><span>tata</span>');
        
        var spanTata = root.childNodes[2];
        spanTata.dispatchEvent(new Event('click'));
        OnAttend(root.innerHTML).DEtreEgalA('<span>TOTO</span><span>tutu</span><span>TATA</span>');
    });
    
      Ca('teste que l\'api mamba permet de passer des options', function(){
        var model = {name: 'toto'};
        var template = '<div></div>';
        var directive = {'name' : 'div'};
        var options = {genRefresh: false, debug: false};
        var mamba = new Mamba(model, template, directive);
        mamba.setOptions(options);
        
        var dom = mamba.render();
        OnAttend(new MbaDom(dom).toString()).DEtreEgalA('<div>toto</div>');
    });
    
    Ca('teste que l\'api mamba détecte les options non reconnues', function(){
        var model = {name: 'toto'};
        var template = '<div></div>';
        var directive = {'name' : 'div'};
        var options = {genRefreshzzzz: false};
        var mamba = new Mamba(model, template, directive);
        try { 
            mamba.setOptions(options);
        } catch(e){
            OnAttend(e.message).DEtreEgalA('Received an invalid option \'genRefreshzzzz\'.');
            return;
        }
        OnAttend(false).DEtreVrai();
    });

    Ca('teste la génération d\'une fonction refresh dans les modèles', function(){
        var data = getHtmlDirectiveAndModelForManualDomUpdate();
        var model = data.model;
        var template = data.html;
        var directive = data.directive;
        var mamba = new Mamba(model, template, directive);
        mamba.setOptions({genRefresh: false, debug: false});
        mamba.render();
        
        OnAttend(model.hasOwnProperty('refresh')).DEtreFaux();
        OnAttend(model.video.hasOwnProperty('refresh')).DEtreFaux();
        OnAttend(model.video.animes[0].hasOwnProperty('refresh')).DEtreFaux();
        OnAttend(model.video.animes[0].episodes[0].hasOwnProperty('refresh')).DEtreFaux();
        OnAttend(model.video.animes[0].episodes[1].hasOwnProperty('refresh')).DEtreFaux();
        OnAttend(model.video.animes[1].hasOwnProperty('refresh')).DEtreFaux();
        OnAttend(model.video.animes[1].episodes[0].hasOwnProperty('refresh')).DEtreFaux();
        OnAttend(model.video.animes[1].episodes[1].hasOwnProperty('refresh')).DEtreFaux();
        
        mamba.setOptions({genRefresh: true});
        mamba.render();
        
        OnAttend(model.hasOwnProperty('refresh')).DEtreVrai();
        OnAttend(model.video.hasOwnProperty('refresh')).DEtreVrai();
        OnAttend(model.video.animes[0].hasOwnProperty('refresh')).DEtreVrai();
        OnAttend(model.video.animes[0].episodes[0].hasOwnProperty('refresh')).DEtreVrai();
        OnAttend(model.video.animes[0].episodes[1].hasOwnProperty('refresh')).DEtreVrai();
        OnAttend(model.video.animes[1].hasOwnProperty('refresh')).DEtreVrai();
        OnAttend(model.video.animes[1].episodes[0].hasOwnProperty('refresh')).DEtreVrai();
        OnAttend(model.video.animes[1].episodes[1].hasOwnProperty('refresh')).DEtreVrai();
    });
    
     Ca('teste que la fonction refresh générée rafraichit bien le modèle', function(){
        var data = getHtmlDirectiveAndModelForManualDomUpdate();
        var model = data.model;
        var template = data.html;
        var directive = data.directive;
        var root = document.createElement('div');
        root.id = 'root';
        root.innerHTML = template;
        var mamba = new Mamba(model, root.childNodes, directive);
        mamba.setOptions({genRefresh: true, debug: false});
        mamba.render();
         
        OnAttend(root.innerHTML).DEtreEgalA('<div class="anime"><div class="name">SpongeBob SquarePants</div><div class="ep_number">01a</div><div class="ep_name">Help Wanted</div><div class="ep_number">01b</div><div class="ep_name">Reef Blower</div></div><div class="anime"><div class="name">Dragon Ball</div><div class="ep_number">01</div><div class="ep_name">Bulma and Son Goku</div><div class="ep_number">02</div><div class="ep_name">What the...?! No Balls!</div></div>');
        
        model.video.animes[0].episodes[0].number = '1A'; 
        model.video.animes[0].episodes[0].refresh();
         
        OnAttend(root.innerHTML).DEtreEgalA('<div class="anime"><div class="name">SpongeBob SquarePants</div><div class="ep_number">1A</div><div class="ep_name">Help Wanted</div><div class="ep_number">01b</div><div class="ep_name">Reef Blower</div></div><div class="anime"><div class="name">Dragon Ball</div><div class="ep_number">01</div><div class="ep_name">Bulma and Son Goku</div><div class="ep_number">02</div><div class="ep_name">What the...?! No Balls!</div></div>');
        
        model.video.animes[0].episodes[1].number = '1B'; 
        model.video.animes[0].episodes[1].refresh();
         
        OnAttend(root.innerHTML).DEtreEgalA('<div class="anime"><div class="name">SpongeBob SquarePants</div><div class="ep_number">1A</div><div class="ep_name">Help Wanted</div><div class="ep_number">1B</div><div class="ep_name">Reef Blower</div></div><div class="anime"><div class="name">Dragon Ball</div><div class="ep_number">01</div><div class="ep_name">Bulma and Son Goku</div><div class="ep_number">02</div><div class="ep_name">What the...?! No Balls!</div></div>');
         
        model.video.animes[1].episodes[0].number = '1'; 
        model.video.animes[1].episodes[0].refresh();
         
        OnAttend(root.innerHTML).DEtreEgalA('<div class="anime"><div class="name">SpongeBob SquarePants</div><div class="ep_number">1A</div><div class="ep_name">Help Wanted</div><div class="ep_number">1B</div><div class="ep_name">Reef Blower</div></div><div class="anime"><div class="name">Dragon Ball</div><div class="ep_number">1</div><div class="ep_name">Bulma and Son Goku</div><div class="ep_number">02</div><div class="ep_name">What the...?! No Balls!</div></div>');
         
        model.video.animes[1].episodes[1].number = '2'; 
        model.video.animes[1].episodes[1].refresh();
         
        OnAttend(root.innerHTML).DEtreEgalA('<div class="anime"><div class="name">SpongeBob SquarePants</div><div class="ep_number">1A</div><div class="ep_name">Help Wanted</div><div class="ep_number">1B</div><div class="ep_name">Reef Blower</div></div><div class="anime"><div class="name">Dragon Ball</div><div class="ep_number">1</div><div class="ep_name">Bulma and Son Goku</div><div class="ep_number">2</div><div class="ep_name">What the...?! No Balls!</div></div>');
    });
    
    Ca('teste que la fonction refresh générée rafraichit bien le modèle et ses sous-modèles', function(){
        var data = getHtmlDirectiveAndModelForManualDomUpdate();
        var model = data.model;
        var template = data.html;
        var directive = data.directive;
        var root = document.createElement('div');
        root.id = 'root';
        root.innerHTML = template;
        var mamba = new Mamba(model, root.childNodes, directive);
        mamba.setOptions({genRefresh: true, debug: false});
        mamba.render();
         
        OnAttend(root.innerHTML).DEtreEgalA('<div class="anime"><div class="name">SpongeBob SquarePants</div><div class="ep_number">01a</div><div class="ep_name">Help Wanted</div><div class="ep_number">01b</div><div class="ep_name">Reef Blower</div></div><div class="anime"><div class="name">Dragon Ball</div><div class="ep_number">01</div><div class="ep_name">Bulma and Son Goku</div><div class="ep_number">02</div><div class="ep_name">What the...?! No Balls!</div></div>');
        
        model.video.animes[0].episodes[0].number = '1A'; 
        model.refresh();
        
        OnAttend(root.innerHTML).DEtreEgalA('<div class="anime"><div class="name">SpongeBob SquarePants</div><div class="ep_number">1A</div><div class="ep_name">Help Wanted</div><div class="ep_number">01b</div><div class="ep_name">Reef Blower</div></div><div class="anime"><div class="name">Dragon Ball</div><div class="ep_number">01</div><div class="ep_name">Bulma and Son Goku</div><div class="ep_number">02</div><div class="ep_name">What the...?! No Balls!</div></div>');
        
        model.video.animes[0].episodes[1].number = '1B'; 
        model.refresh();
         
        OnAttend(root.innerHTML).DEtreEgalA('<div class="anime"><div class="name">SpongeBob SquarePants</div><div class="ep_number">1A</div><div class="ep_name">Help Wanted</div><div class="ep_number">1B</div><div class="ep_name">Reef Blower</div></div><div class="anime"><div class="name">Dragon Ball</div><div class="ep_number">01</div><div class="ep_name">Bulma and Son Goku</div><div class="ep_number">02</div><div class="ep_name">What the...?! No Balls!</div></div>');
         
        model.video.animes[1].episodes[0].number = '1'; 
        model.refresh();
         
        OnAttend(root.innerHTML).DEtreEgalA('<div class="anime"><div class="name">SpongeBob SquarePants</div><div class="ep_number">1A</div><div class="ep_name">Help Wanted</div><div class="ep_number">1B</div><div class="ep_name">Reef Blower</div></div><div class="anime"><div class="name">Dragon Ball</div><div class="ep_number">1</div><div class="ep_name">Bulma and Son Goku</div><div class="ep_number">02</div><div class="ep_name">What the...?! No Balls!</div></div>');
         
        model.video.animes[1].episodes[1].number = '2'; 
        model.refresh();
         
        OnAttend(root.innerHTML).DEtreEgalA('<div class="anime"><div class="name">SpongeBob SquarePants</div><div class="ep_number">1A</div><div class="ep_name">Help Wanted</div><div class="ep_number">1B</div><div class="ep_name">Reef Blower</div></div><div class="anime"><div class="name">Dragon Ball</div><div class="ep_number">1</div><div class="ep_name">Bulma and Son Goku</div><div class="ep_number">2</div><div class="ep_name">What the...?! No Balls!</div></div>');
    });
};
	

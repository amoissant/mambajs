
var testMbaV2 = 
//Test(function() {
    function() {

	Ca('teste qu\'un binding peut contenir des elements de dom', function() {
		var binding = {
			'propDom' : $('<div>toto</div>')[0]
		};
		OnAttend(isValidBinding(binding)).DEtreVrai();
	});

	Ca(	'teste qu\'un binding peut contenir un tableau d\'elements de dom',
		function() {
			var binding = {
				'propDom' : [ $('<div>toto</div>')[0], $('<div>tutu</div>')[0] ]
			};
			OnAttend(isValidBinding(binding)).DEtreVrai();

			binding = {
				'propDom' : [ 'toto', 'tutu' ]
			};
			OnAttend(isValidBinding(binding)).DEtreVrai();
	});

	Ca(	'teste qu\'un binding peut contenir un autre binding',
		function() {
			var binding = {
				'subBinding' : {
					'propDom' : [ $('<div>toto</div>')[0],
							$('<div>tutu</div>')[0] ]
				}
			};
			OnAttend(isValidBinding(binding)).DEtreVrai();

			binding = {
				'subBinding' : {
					'propDom' : [ 'toto', 'tutu' ]
				}
			};
			OnAttend(isValidBinding(binding)).DEtreVrai();
	});

	Ca('teste qu\'un binding peut contenir un selecteur css', function() {
		var binding = {
			'propDom' : '#toto'
		};
		OnAttend(isValidBinding(binding)).DEtreVrai();		
	});

	Ca(	'teste qu\'un binding peut contenir un tableau de selecteur css',
		function() {
			var binding = {
				'propDom' : [ '#toto', '#tata' ]
			};
			OnAttend(isValidBinding(binding)).DEtreVrai();

			binding = {
				'propDom' : [ 'toto', 'tutu' ]
			};
			OnAttend(isValidBinding(binding)).DEtreVrai();
	});

	Ca('teste qu\'un binding ne peut contenir null', function() {
		var binding = {
			'propNull' : null
		};
		OnAttend(isValidBinding(binding)).DEtreFaux();

		binding = {};
		OnAttend(isValidBinding(binding)).DEtreFaux();
	});
	
	Ca('teste qu\'un binding peut être récursif', function() {
		var binding = {"nom" : "#nom",
					   "enfant" : {"prenom" : "#prenom"}};
		
		binding.enfant.parent = binding;
		
		OnAttend(isValidBinding(binding)).DEtreVrai();	
	});


	Ca('valide un binding par rapport à un modèle sur un niveau', function() {
		var binding = {
			'prop1' : $('<div></div>')[0],
			'prop2' : $('<span></span>')[0]
		};
		var model = {
			'prop1' : 'value1',
			'prop2' : 'value2'
		};
		OnAttend(bindingMatchModel(binding, model)).DEtreVrai();

		binding = {
			'propNotInModel' : $('<div></div>')[0],
			'prop2' : $('<span></span>')[0]
		};
		model = {
			'prop1' : 'value1',
			'prop2' : 'value2'
		};
		OnAttend(bindingMatchModel(binding, model)).DEtreFaux();

		binding = {
			'prop1' : 'value1'
		};
		model = null;
		OnAttend(bindingMatchModel(binding, model)).DEtreFaux();

		binding = null;
		model = {
			'propNotInModel' : '<div></div>'
		};
		OnAttend(bindingMatchModel(binding, model)).DEtreFaux();

		//bindingMatchModel() vérifie la concordance entre les propriétés
		//du binding et du modèle ne vérifie pas que le binding est valide.
		binding = {
			'prop1' : null,
			'prop2' : null
		};
		model = {
			'prop1' : 'value1',
			'prop2' : 'value2'
		};
		OnAttend(bindingMatchModel(binding, model)).DEtreVrai();
		OnAttend(isValidBinding(binding)).DEtreFaux();
	});

	Ca(	'valide un binding par rapport à un modèle sur plusieurs niveaux',
		function() {
			var binding = {
				'prop1' : $('<div></div>')[0],
				'prop2' : {
					'subProp' : $('<input></input>')[0]
				},
				'prop3' : $('<span></span>')[0]
			};
			var model = {
				'prop1' : 'value1',
				'prop2' : {
					'subProp' : 'totoVal'
				},
				'prop3' : 'value2'
			};
			OnAttend(bindingMatchModel(binding, model)).DEtreVrai();

			binding = {
				'prop1' : $('<div></div>')[0],
				'prop2' : {
					'subProp' : $('<input></input>')[0]
				},
				'prop3' : $('<span></span>')[0]
			};
			model = {
				'prop1' : 'value1',
				'prop2' : {
					'propNotInModel' : 'totoVal'
				},
				'prop3' : 'value2'
			};
			OnAttend(bindingMatchModel(binding, model)).DEtreFaux();
		});

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

	Ca('teste isjQuery', function() {
		OnAttend(isJQuery(null)).DEtreFaux();
		OnAttend(isJQuery('toto')).DEtreFaux();
		OnAttend(isJQuery([ 'toto', 'tutu' ])).DEtreFaux();
		OnAttend(isJQuery($('<div id="root"></div>'))).DEtreVrai();
		OnAttend(isJQuery($('<div id="root"></div>').get())).DEtreFaux();
		OnAttend(isJQuery($('<div id="root"></div>')[0])).DEtreFaux();
	});

	Ca('teste domToString sur du dom', function() {
		var domString = '<div id="root"></div>';
		var dom = $.parseHTML(domString)[0];
		OnAttend(domToString(dom)).DEtreEgalA(domString);
	});

	Ca('teste domToString sur un tableau', function() {
		var domString = '<div id="root"></div>';
		var dom = $.parseHTML(domString)[0];
		var domJQuery = $(domString).get(0);
		var domArray = [ dom, domJQuery ];
		OnAttend(domToString(domArray)).DEtreEgalA(domString + domString);
	});

	Ca(	'teste l\'initialisation d\'une instance de la classe MbaDom. ',
		function() {
			var dom = new MbaDom('<div id="toto"></div><span id="tata"></span>');

			OnAttend($.isArray(dom.getDom())).DEtreVrai();
			OnAttend(dom.getDom().length).DEtreEgalA(2);
			OnAttend(isDom(dom.getDom())).DEtreVrai();
		});

	Ca('teste MbaDom.toString() ', function() {
		var domString = '<div id="toto"></div><span id="tata"></span>';
		var dom = new MbaDom(domString);
		var res = dom.toString();
		
		OnAttend(domString).DEtreEgalA(res);
	});

	Ca('teste MbaDom.clone() ', function() {
		var dom = new MbaDom('<div id="toto"></div><span id="tata"></span>');
		var clone = dom.clone();
				
		OnAttend(clone instanceof MbaDom).DEtreVrai();
		OnAttend(clone.getDom().length).DEtreEgalA(dom.getDom().length);
		OnAttend(clone.getDom()[0].id).DEtreEgalA(dom.getDom()[0].id);
		OnAttend(clone.getDom()[1].id).DEtreEgalA(dom.getDom()[1].id);
	});


	Ca('teste MbaDom.find() ', function() {
		var dom = new MbaDom('<div id="toto"></div><span id="tata"></span>');
	
		var toto = dom.find('#toto');
		
		OnAttend(toto instanceof MbaDom).DEtreVrai();
		OnAttend(toto.getDom()[0].id).DEtreEgalA('toto');
	});

	Ca('teste MbaDom.isEmpty() ', function() {
		var dom = new MbaDom('<div id="toto"></div><span id="tata"></span>');
	
		var tutu = dom.find('#tutu');
		var tata = dom.find('#tata');
		
		OnAttend(tutu.isEmpty()).DEtreVrai();
		OnAttend(tata.isEmpty()).DEtreFaux();
	});
	
	Ca('teste MbaDom.replace() ', function() {
		var dom = new MbaDom('<div id="toto"></div><span id="tata"></span>');
		var toto = dom.find('#toto');
		var tutu = new MbaDom('<div id="tutu"></div>');
		
		dom.replace(toto, tutu);
		
		var toto2 = dom.find('#toto');
		var tutu2 = dom.find('#tutu');
		
		OnAttend(toto2.isEmpty()).DEtreVrai();
		OnAttend(tutu2.isEmpty()).DEtreFaux();
		OnAttend(tutu2.getDom()[0].id).DEtreEgalA('tutu');
		OnAttend(dom.getDom()[0].id).DEtreEgalA('tutu');
		OnAttend(dom.getDom()[1].id).DEtreEgalA('tata');
	});

	Ca('teste MbaDom.concat() ', function() {
		var dom = new MbaDom('<div id="toto"></div><span id="tata"></span>');
		var tutu = new MbaDom('<div id="tutu"></div>');
		
		dom.concat(tutu);
		
		OnAttend(dom.getDom()[0].id).DEtreEgalA('toto');
		OnAttend(dom.getDom()[1].id).DEtreEgalA('tata');
		OnAttend(dom.getDom()[2].id).DEtreEgalA('tutu');
	});

	Ca(	'teste l\'initialisation d\'une instance de la classe Directive. ',
		function() {
			var directive = new MbaDirective({
				'toto' : '#toto',
				'tutu' : {'r00t' : '#tutu', 'tata': '#tata'}	
			});

			OnAttend(directive.getData()).DePosséder('toto');
			OnAttend(directive.getData()).DePosséder('tutu');
			OnAttend(directive.getData()).DeNePasPosséder('tata');
			OnAttend(directive.getProp('tutu').getData()).DeNePasPosséder('toto');
			OnAttend(directive.getProp('tutu').getData()).DePosséder('tata');
			OnAttend(directive.getProp('toto')).DEtreEgalA('#toto');
		});
	
	Ca('teste MbaDirective.isDirective() ', function() {
		var dom = new MbaDom('<div id="toto"></div><span id="tata"></span>');
		var directive = new MbaDirective({'toto' : '#toto', 'tutu' : {'tata' : '#tata'}});
		
		OnAttend(directive.isDirective('toto')).DEtreFaux();
		OnAttend(directive.isDirective('tutu')).DEtreVrai();		
	});	
	
	Ca('teste MbaDirective.hasRoot() ', function() {
		var dom = new MbaDom('<div id="toto"></div><span id="tata"></span>');
		var directiveNoRoot = new MbaDirective({'toto' : '#toto'});
		var directiveRoot = new MbaDirective({'r00t' : '#toto, #tata', 'toto' : '#toto'});
		
		OnAttend(directiveNoRoot.hasRoot()).DEtreFaux();
		OnAttend(directiveRoot.hasRoot()).DEtreVrai();
	});	

	Ca('teste que findInTemplate() lève une exception avec un template au format "string"', function() {
		var template = '<div id="toto"></div><span id="tata"></span>';
		try{
			var domElement = findInTemplate(template, '#toto');
		}catch(e){
			return;
		}

		OnAttend(true).DEtreFaux();
	});
	
	Ca('teste que findInTemplate() accepte les selecteurs css'
			+ ' et retourne un elément de dom', function() {
		var template = $.parseHTML('<div id="toto"></div><span id="tata"></span>');
		var domElement = findInTemplate(template, '#toto');

		OnAttend(domElement).DeNePasEtreNull();
		OnAttend(domElement[0].id).DEtreEgalA('toto');
	});

	Ca(	'teste que findInTemplate() retourne le même '
				+ 'objet que celui du template si le template est un dom.',
		function() {
			var template = '<div id="toto"></div><span id="tata"></span>';
			var dom = $.parseHTML(template);
			dom[1].setAttribute('customattr', 'I\'m tata');
			var domElement = findInTemplate(dom, '#tata');

			OnAttend(domElement).DeNePasEtreNull();
			OnAttend(domElement[0].id).DEtreEgalA('tata');
			OnAttend(domElement[0].getAttribute('customattr'))
					.DEtreEgalA('I\'m tata');
		});

	Ca('teste que findInTemplate() accepte les selecteurs css'
			+ ' et peut retourner plusieurs eléments de dom', function() {
		template = '<div id="toto" class="tutu"></div>'
				+ '<span id="tata" class="tutu"></span>';
		template = $.parseHTML(template);
		var domElements = findInTemplate(template, '.tutu');
		OnAttend(domElements).DeNePasEtreNull();
		OnAttend($.isArray(domElements)).DEtreVrai();
		OnAttend(domElements.length).DEtreEgalA(2);
	});

	Ca('teste que findInTemplate() retourne l\'élément voulu même si celui-ci '
			+ 'est à la racine', function() {
		var template = '<div id="root"><div id="toto"></div>';
		template = $.parseHTML(template);
		var root = findInTemplate(template, "#root");
		var toto = findInTemplate(template, "#toto");

		OnAttend(root[0]).DeNePasEtreNull();
		OnAttend(root[0].id).DEtreEgalA('root');
		OnAttend(toto[0]).DeNePasEtreNull();
		OnAttend(toto[0].id).DEtreEgalA('toto');
	});

	Ca(	'teste que findInTemplate() peut trouver un élément dans un tableau',
		function() {
			var template = [ $('<div id="root">')[0], $('<div id="root2">')[0] ];

			var root = findInTemplate(template, '#root');
			OnAttend(root[0].id).DEtreEgalA('root');

			var root2 = findInTemplate(template, '#root2');
			OnAttend(root2[0].id).DEtreEgalA('root2');
		});

	Ca(	'teste que findInTemplate() peut trouver plusieurs élements',
		function() {
			var template = $.parseHTML('<div id="root">'
					+ '<div id="toto1"></div>' + '<div id="toto2"></div>'
					+ '</div>');
			var res = findInTemplate(template, '#toto1, #toto2');
			OnAttend($.isArray(res)).DEtreVrai();
			OnAttend(res.length).DEtreEgalA(2);
			OnAttend(res[0].id).DEtreEgalA('toto1');
			OnAttend(res[1].id).DEtreEgalA('toto2');
		});

	Ca('teste que findInTemplate() peut retourner une sous-partie des '
			+ 'éléments à la racine', function() {
		var template = $.parseHTML('<div id="toto"></div>'
				+ '<div id="tata"></div>' + '<div id="titi"></div>'
				+ '<div id="tutu"></div>');

		var res = findInTemplate(template, '#toto, #tata, #titi');

		OnAttend($.isArray(res)).DEtreVrai();
		OnAttend(res.length).DEtreEgalA(3);
		OnAttend(res[0].id).DEtreEgalA('toto');
		OnAttend(res[1].id).DEtreEgalA('tata');
		OnAttend(res[2].id).DEtreEgalA('titi');
	});
        
    Ca('teste que findInTemplate2 ne modifie pas la position des éléments dans le dom', function(){
        var htmlString = '<div id="root"><div id="first"></div><div id="second"></div><div id="third"></div></div>';
        var html = $(htmlString).get();
        var second = html[0].childNodes[1];
        var found = findInTemplate2([second], '#second');
        
        OnAttend(found.length).DEtreEgalA(1);
        OnAttend(found[0]).DEtreEgalA(second);
        OnAttend(new MbaDom(html).toString()).DEtreEgalA(htmlString);
    });
        
	Ca('teste que replaceInTemplate() remplace un élément à la racine par un '
			+ 'autre élement', function() {
		var template = $
				.parseHTML('<div id="root"></div><div id="toto"></div>');
		var src = findInTemplate(template, '#root');
		var target = $('<div id="root">')[0];
		target.textContent = 'je suis root et vide';
		template = replaceInTemplate(template, src, target);

		OnAttend(template.length).DEtreEgalA(2);
		var root = findInTemplate(template, '#root')[0];
		OnAttend(root).DeNePasEtreNull();
		OnAttend(root.textContent).DEtreEgalA('je suis root et vide');
		var toto = findInTemplate(template, '#toto')[0];
		OnAttend(toto).DeNePasEtreNull();
		OnAttend(toto.id).DEtreEgalA('toto');
	});

	Ca('teste que replaceInTemplate() remplace un élément pas à la racine par '
			+ 'un autre élement', function() {
		var template = $
				.parseHTML('<div id="root"><div id="toto"></div></div>');
		var src = findInTemplate(template, '#toto');
		var target = $('<div id="toto">')[0];
		target.textContent = 'je suis toto';
		template = replaceInTemplate(template, src, target);

		OnAttend(template.length).DEtreEgalA(1);
		var toto = findInTemplate(template, '#toto')[0];
		OnAttend(toto).DeNePasEtreNull();
		OnAttend(toto.textContent).DEtreEgalA('je suis toto');
	});

	Ca('teste que replaceInTemplate() remplace un élément à la racine par '
			+ 'plusieurs éléments', function() {
		var template = $
				.parseHTML('<div id="root"><div id="toto"></div></div>');
		var src = findInTemplate(template, '#root');
		var target = [ $('<div id="root">')[0], $('<div id="root2">')[0] ];
		template = replaceInTemplate(template, src, target);

		OnAttend(template.length).DEtreEgalA(2);
		var root = findInTemplate(template, '#root')[0];
		OnAttend(root.id).DEtreEgalA('root');
		var root2 = findInTemplate(template, '#root2')[0];
		OnAttend(root2.id).DEtreEgalA('root2');
	});

	Ca('teste que replaceInTemplate() remplace un élément pas à la racine par '
			+ 'plusieurs éléments', function() {
		var template = $
				.parseHTML('<div id="root"><div id="toto"></div></div>');
		var src = findInTemplate(template, '#toto');
		var target = [ $('<div id="toto1">')[0], $('<div id="toto2">')[0] ];
		template = replaceInTemplate(template, src, target);

		OnAttend(template.length).DEtreEgalA(1);
		var toto = findInTemplate(template, '#toto1')[0];
		OnAttend(toto.id).DEtreEgalA('toto1');
		var toto2 = findInTemplate(template, '#toto2')[0];
		OnAttend(toto2.id).DEtreEgalA('toto2');
	});

	Ca('teste que replaceInTemplate() remplace plusieurs éléments à la racine '
			+ 'par un élément', function() {
		var template = $
				.parseHTML('<div id="root1"></div><div id="root2"></div>');
		var src = findInTemplate(template, '#root1, #root2');
		var target = $('<div id="toto">')[0];
		template = replaceInTemplate(template, src, target);

		OnAttend(template.length).DEtreEgalA(1);
		var toto = findInTemplate(template, '#toto')[0];
		OnAttend(toto.id).DEtreEgalA('toto');
	});

	Ca('teste que replaceInTemplate() remplace plusieurs éléments pas à la '
			+ 'racine par un élément', function() {
		var template = $.parseHTML('<div id="root">' + '<div id="toto1"></div>'
				+ '<div id="toto2"></div>' + '</div>')[0];
		var src = findInTemplate(template, '#toto1, #toto2');
		var target = $('<div id="toto">')[0];
		template = replaceInTemplate(template, src, target);

		OnAttend(template.length).DEtreEgalA(1);
		var toto = findInTemplate(template, '#toto')[0];
		OnAttend(toto.id).DEtreEgalA('toto');
		var toto1 = findInTemplate(template, '#toto1')[0];
		OnAttend(toto1).DEtreNull();
		var toto2 = findInTemplate(template, '#toto2')[0];
		OnAttend(toto2).DEtreNull();
	});

	Ca('teste que replaceInTemplate() remplace plusieurs éléments à la racine '
			+ 'par plusieurs éléments', function() {
		var template = $.parseHTML('<div id="root1"></div>'
				+ '<div id="root2"></div>');
		var src = findInTemplate(template, '#root1, #root2');
		var target = [ $('<div id="toto1">')[0], $('<div id="toto2">')[0] ];
		template = replaceInTemplate(template, src, target);

		OnAttend(template.length).DEtreEgalA(2);
		var toto1 = findInTemplate(template, '#toto1')[0];
		OnAttend(toto1.id).DEtreEgalA('toto1');
		var toto2 = findInTemplate(template, '#toto2')[0];
		OnAttend(toto2.id).DEtreEgalA('toto2');
		var root1 = findInTemplate(template, '#root1')[0];
		OnAttend(root1).DEtreNull();
		var root2 = findInTemplate(template, '#root2')[0];
		OnAttend(root2).DEtreNull();
	});

	Ca('teste que replaceInTemplate() remplace plusieurs éléments pas à la '
			+ 'racine par plusieurs éléments', function() {
		var template = $.parseHTML('<div id="root">' + '<div id="toto1"></div>'
				+ '<div id="toto2"></div>' + '</div>')[0];
		var src = findInTemplate(template, '#toto1, #toto2');
		var target = [ $('<div id="tata1">')[0], $('<div id="tata2">')[0] ];
		template = replaceInTemplate(template, src, target);

		OnAttend(template.length).DEtreEgalA(1);
		var toto1 = findInTemplate(template, '#toto1')[0];
		OnAttend(toto1).DEtreNull();
		;
		var toto2 = findInTemplate(template, '#toto2')[0];
		OnAttend(toto2).DEtreNull();
		var tata1 = findInTemplate(template, '#tata1')[0];
		OnAttend(tata1.id).DEtreEgalA('tata1');
		var tata2 = findInTemplate(template, '#tata2')[0];
		OnAttend(tata2.id).DEtreEgalA('tata2');
	});

	Ca('teste que addIdToDom() ajoute un numéro unique à chaque élément de dom', function(){
		
		var template = '<div id="root"><span id="toto"></span><div id="tata"></div><div id="tutu"><span id="titi"></span></div></div>';
			
		var mbaDom = new MbaDom(template);
		mbaDom.addMbaId();
		var dom = mbaDom.getDom();
		
		OnAttend(findInTemplate(dom, '#root')[0]._mbaId).DEtreEgalA(0);
		OnAttend(findInTemplate(dom, '#toto')[0]._mbaId).DEtreEgalA(1);
		OnAttend(findInTemplate(dom, '#tata')[0]._mbaId).DEtreEgalA(2);
		OnAttend(findInTemplate(dom, '#tutu')[0]._mbaId).DEtreEgalA(3);
		OnAttend(findInTemplate(dom, '#titi')[0]._mbaId).DEtreEgalA(4);
		
	});
	
	Ca('test que MbaDom.getId() retourne un numéro unique pour un ou plusieurs éléments de dom', function(){
		var template = '<div id="root"><span id="toto"></span><div id="tata"></div><div id="tutu"><span id="titi"></span></div></div>';
			
		var mbaDom = new MbaDom(template);
		mbaDom.addMbaId();
		var dom = mbaDom.getDom();

		OnAttend(mbaDom.getId()).DEtreEgalA('0');
		OnAttend(mbaDom.find('#root').getId()).DEtreEgalA('0');
		OnAttend(mbaDom.find('#tata').getId()).DEtreEgalA('2');
		OnAttend(mbaDom.find('#toto, #tutu').getId()).DEtreEgalA('1-3');
		OnAttend(mbaDom.find('#tutu, #toto').getId()).DEtreEgalA('1-3');
		OnAttend(mbaDom.find('#titi, #toto, #root').getId()).DEtreEgalA('0-1-4');
		OnAttend(mbaDom.find('#toto, #root, #titi').getId()).DEtreEgalA('0-1-4');
	});
	
	Ca('teste que render() remplit le bon élément du template avec la bonne'
			+ ' valeur du modèle', function() {
		var template = '<div id="toto"></div><span id="tata"></span>';
		var dom = $.parseHTML(template);

		var model = {};
		model.totoProp = 'je suis la valeur de toto';
		model.tataProp = 'je suis la valeur de tata';

		var binding = {};
		binding.totoProp = '#toto';
		binding.tataProp = '#tata';

		dom = $mamba(model, dom, binding);
		
		OnAttend(dom[0].textContent)
				.DEtreEgalA('je suis la valeur de toto');
		OnAttend(dom[1].textContent)
				.DEtreEgalA('je suis la valeur de tata');
	});

	Ca('teste que render() peut remplir plusieurs éléments du template '
			+ 'avec la même valeur du modèle', function() {
		var template = '<div id="toto"></div><span id="tata"></span>';
		var dom = $.parseHTML(template);

		var model = {};
		model.totoProp = 'je suis la valeur de toto';

		var binding = {};
		binding.totoProp = '#toto, #tata';

		dom = $mamba(model, dom, binding);

		var toto = findInTemplate(dom, '#toto')[0];
		OnAttend(toto.textContent).DEtreEgalA('je suis la valeur de toto');
		var tata = findInTemplate(dom, '#tata')[0];
		OnAttend(tata.textContent).DEtreEgalA('je suis la valeur de toto');
	});

	Ca('teste que render() peut prendre un dom en entrée ou'
			+ ' sa représentation texte', function() {
		var template = '<div id="toto"></div><span id="tata"></span>';

		var model = {};
		model.totoProp = 'je suis la valeur de toto';
		model.tataProp = 'je suis la valeur de tata';

		var binding = {};
		binding.totoProp = '#toto';
		binding.tataProp = '#tata';

		var dom = $mamba(model, template, binding);

		OnAttend(findInTemplate(dom, '#toto')[0].textContent)
				.DEtreEgalA('je suis la valeur de toto');
		OnAttend(findInTemplate(dom, '#tata')[0].textContent)
				.DEtreEgalA('je suis la valeur de tata');
	});

	Ca(	'teste que render() avec un modèle de type tableau va dupliquer les '
				+ 'éléments du template autant de fois que de valeurs dans le tableau',
		function() {
			var template = '<div id="toto"></div><span id="tata"></span>';

			var model = [ {}, {} ];
			model[0].totoProp = 'je suis la première valeur de toto';
			model[0].tataProp = 'je suis la première valeur de tata';

			model[1].totoProp = 'je suis la seconde valeur de toto';
			model[1].tataProp = 'je suis la seconde valeur de tata';

			var binding = {};
			binding.totoProp = '#toto';
			binding.tataProp = '#tata';

			var dom = $mamba(model, template, binding);

			OnAttend(dom[0].textContent)
					.DEtreEgalA('je suis la première valeur de toto');
			OnAttend(dom[1].textContent)
					.DEtreEgalA('je suis la seconde valeur de toto');
			OnAttend(dom[2].textContent)
					.DEtreEgalA('je suis la première valeur de tata');
			OnAttend(dom[3].textContent)
					.DEtreEgalA('je suis la seconde valeur de tata');

		});

	Ca('teste que render() sur un modèle de type tableau et un binding '
			+ 'avec \'r00t\' simple défini', function() {
		var template = '<div id="root">' + '<div id="toto"></div>'
				+ '<span id="tata"></span>' + '</div>';

		var model = [ {}, {} ];
		model[0].totoProp = 'je suis la première valeur de toto';
		model[0].tataProp = 'je suis la première valeur de tata';

		model[1].totoProp = 'je suis la seconde valeur de toto';
		model[1].tataProp = 'je suis la seconde valeur de tata';

		var binding = {};
		binding.r00t = '#root';
		binding.totoProp = '#toto';
		binding.tataProp = '#tata';

		var dom = $mamba(model, template, binding);

		var domChildrens = $(dom[0]).children().get();
		domChildrens = domChildrens.concat($(dom[1]).children().get());

		OnAttend(domChildrens[0].textContent)
				.DEtreEgalA('je suis la première valeur de toto');
		OnAttend(domChildrens[1].textContent)
				.DEtreEgalA('je suis la première valeur de tata');
		OnAttend(domChildrens[2].textContent)
				.DEtreEgalA('je suis la seconde valeur de toto');
		OnAttend(domChildrens[3].textContent)
				.DEtreEgalA('je suis la seconde valeur de tata');

		OnAttend(dom.length).DEtreEgalA(2);
		var toto1 = findInTemplate(dom[0], "#toto")[0];
		var tata1 = findInTemplate(dom[0], "#tata")[0];
		var toto2 = findInTemplate(dom[1], "#toto")[0];
		var tata2 = findInTemplate(dom[1], "#tata")[0];

		OnAttend(toto1.textContent)
				.DEtreEgalA('je suis la première valeur de toto');
		OnAttend(tata1.textContent)
				.DEtreEgalA('je suis la première valeur de tata');
		OnAttend(toto2.textContent)
				.DEtreEgalA('je suis la seconde valeur de toto');
		OnAttend(tata2.textContent)
				.DEtreEgalA('je suis la seconde valeur de tata');

	});

	Ca('teste que render() sur un modèle de type tableau et un binding '
			+ 'avec \'r00t\' complex défini', function() {
		var template = '<div id="toto"></div><span id="tata"></span>';

		var model = [ {}, {} ];
		model[0].totoProp = 'je suis la première valeur de toto';
		model[0].tataProp = 'je suis la première valeur de tata';

		model[1].totoProp = 'je suis la seconde valeur de toto';
		model[1].tataProp = 'je suis la seconde valeur de tata';

		var binding = {};
		binding.r00t = '#toto, #tata';
		binding.totoProp = '#toto';
		binding.tataProp = '#tata';

		var dom = $mamba(model, template, binding);

		OnAttend(dom.length).DEtreEgalA(4);
		OnAttend(dom[0].textContent)
				.DEtreEgalA('je suis la première valeur de toto');
		OnAttend(dom[1].textContent)
				.DEtreEgalA('je suis la première valeur de tata');
		OnAttend(dom[2].textContent)
				.DEtreEgalA('je suis la seconde valeur de toto');
		OnAttend(dom[3].textContent)
				.DEtreEgalA('je suis la seconde valeur de tata');
	});

	Ca('teste que render() suit la hierarchie des objets du modèle avec '
			+ 'subBinding sans '+MBA_CST.ROOT, function() {
		var template = 
			'<div id="toto"></div>'
			+ '<div id="titi"></div>'
			+ '<span id="tata"></span>' 
			+ '<div id="tutu"></div>';

		var model = 
			{"totoProp" : "je suis la valeur de toto",
			 "tataProp" : "je suis la valeur de tata",
			 "subProp" : {"titiProp" : "je suis la valeur de titi",
					      "tutuProp" : "je suis la valeur de tutu"}};

		var binding = 
			{"r00t" : "#toto, #titi, #tata, #tutu",
			 "totoProp" : "#toto",
			 "tataProp" : "#tata",
			 "subProp" : {"titiProp" : "#titi",
					      "tutuProp" : "#tutu"}};

		var dom = $mamba(model, template, binding);

		OnAttend(dom.length).DEtreEgalA(4);
		OnAttend(dom[0].textContent).DEtreEgalA('je suis la valeur de toto');
		OnAttend(dom[1].textContent).DEtreEgalA('je suis la valeur de titi');
		OnAttend(dom[2].textContent).DEtreEgalA('je suis la valeur de tata');
		OnAttend(dom[3].textContent).DEtreEgalA('je suis la valeur de tutu');

	});

	Ca(	'teste que render() suit la hierarchie des objets du modèle avec '
				+ 'un sous-modèle tableau et subBinding sans '+MBA_CST.ROOT,
		function() {
			var template = '<div< id="root">' + '<div id="toto"></div>'
					+ '<div id="titi"></div>' + '<span id="tata"></span>'
					+ '<div id="tutu"></div>' + '</div>';

			var model = {};
			model.totoProp = 'je suis la valeur de toto';
			model.tataProp = 'je suis la valeur de tata';
			model.subProp = [ {
				'titiProp' : 'titi1',
				'tutuProp' : 'tutu1'
			}, {
				'titiProp' : 'titi2',
				'tutuProp' : 'tutu2'
			} ];

			var binding = {};
			binding.r00t = '#root';
			binding.totoProp = '#toto';
			binding.tataProp = '#tata';
			binding.subProp = {
				'titiProp' : '#titi',
				'tutuProp' : '#tutu'
			};

			var dom = $mamba(model, template, binding);

			OnAttend(dom[0].children.length).DEtreEgalA(6);
			OnAttend(dom[0].children[0].textContent)
					.DEtreEgalA('je suis la valeur de toto');
			OnAttend(dom[0].children[1].textContent).DEtreEgalA('titi1');
			OnAttend(dom[0].children[2].textContent).DEtreEgalA('titi2');
			OnAttend(dom[0].children[3].textContent)
					.DEtreEgalA('je suis la valeur de tata');
			OnAttend(dom[0].children[4].textContent).DEtreEgalA('tutu1');
			OnAttend(dom[0].children[5].textContent).DEtreEgalA('tutu2');

		});

	Ca('teste que render() suit la hierarchie des objets du modèle avec '
			+ 'subBinding avec '+MBA_CST.ROOT, function() {
		var template = '<div id="toto"></div>' + '<div id="titi"></div>'
				+ '<span id="tata"></span>';

		var model = {};
		model.totoProp = 'je suis la valeur de toto';
		model.tataProp = 'je suis la valeur de tata';
		model.tutuProp = {
			'titiProp' : 'je suis la valeur de titi'
		};

		var binding = {};
		binding.r00t = '#toto, #titi, #tata';
		binding.totoProp = '#toto';
		binding.tataProp = '#tata';
		binding.tutuProp = {
			'r00t' : '#titi',
			'titiProp' : '#titi'
		};

		var dom = $mamba(model, template, binding);

		OnAttend(dom.length).DEtreEgalA(3);
		OnAttend(dom[0].textContent).DEtreEgalA('je suis la valeur de toto');
		OnAttend(dom[1].textContent).DEtreEgalA('je suis la valeur de titi');
		OnAttend(dom[2].textContent).DEtreEgalA('je suis la valeur de tata');

	});

	Ca(	'teste que render() suit la hierarchie des objets du modèle avec '
				+ 'un sous-modèle tableau et subBinding avec '+MBA_CST.ROOT,
		function() {
			var template = '<div id="toto"></div>' + '<div id="titi"></div>'
					+ '<span id="tata"></span>';

			var model = {};
			model.totoProp = 'je suis la valeur de toto';
			model.tataProp = 'je suis la valeur de tata';
			model.tutuProp = [ {
				'titiProp' : 'titi1'
			}, {
				'titiProp' : 'titi2'
			} ];

			var binding = {};
			binding.r00t = '#toto, #titi, #tata';
			binding.totoProp = '#toto';
			binding.tataProp = '#tata';
			binding.tutuProp = {
				'r00t' : '#titi',
				'titiProp' : '#titi'
			};

			var dom = $mamba(model, template, binding);

			OnAttend(dom.length).DEtreEgalA(4);
			OnAttend(dom[0].textContent)
					.DEtreEgalA('je suis la valeur de toto');
			OnAttend(dom[1].textContent).DEtreEgalA('titi1');
			OnAttend(dom[2].textContent).DEtreEgalA('titi2');
			OnAttend(dom[3].textContent)
					.DEtreEgalA('je suis la valeur de tata');

		});
		
	Ca(	'teste que la syntaxe <selecteur>@<attribut> positionne la valeur de '
	   	+'l\'attribut avec la valeur du modèle',
		function() {
			var template = '<div id="toto"></div>';
			
			var model = {
				"color" : "blue"
			};
			var binding = {
				"color" : "#toto@color"
			};

			var dom = $mamba(model, template, binding);

			OnAttend(dom[0].attributes['color'].value).DEtreEgalA('blue');
		});

	Ca(	'teste que la syntaxe <selecteur>@class ajoute la valeur du modèle aux classes existantes',
		function() {
			var template = '<div id="toto" class="tata"></div>';
			
			var model = {
				"color" : "blue"
			};
			var binding = {
				"color" : "#toto@class"
			};

			var dom = $mamba(model, template, binding);

			OnAttend($(dom[0]).hasClass('tata')).DEtreVrai();
			OnAttend($(dom[0]).hasClass('blue')).DEtreVrai();
		});
	
	Ca(	'teste que la syntaxe <selecteur>@<attribut> marche avec des selecteurs multiples',
		function() {
			var template = '<div id="toto"></div><div id="tata"></div>';
			
			var model = {
				"color" : "blue"
			};
			var binding = {
				"color" : "#toto@color, #tata@class"
			};

			var dom = $mamba(model, template, binding);

			OnAttend(dom[0].attributes['color'].value).DEtreEgalA('blue');
			OnAttend($(dom[1]).hasClass('blue')).DEtreVrai();
		});
	
	Ca(	'teste que la syntaxe <selecteur>?+@<attribut> ajoute un attribut si la valeur '
	   	+'du modèle est vrai et le supprime si la valeur du modèle est fausse',
		function() {
			var template = '<input type="text"/>';
			
			var model = [{"inactive" : true},
			             {"inactive" : false}];
			var binding = {"inactive" : "input?+@disabled"};

			var dom = $mamba(model, template, binding);

			OnAttend(dom[0].attributes['disabled']).DeNePasEtreNull();
			OnAttend(dom[1].attributes['disabled']).DEtreNull();
			
			template = '<input type="text" disabled/>';
			dom = $mamba(model, template, binding);
			
			OnAttend(dom[0].attributes['disabled']).DeNePasEtreNull();
			OnAttend(dom[1].attributes['disabled']).DEtreNull();
		});

	Ca(	'teste que la syntaxe <selecteur>?-@<attribut> supprime un attribut si la valeur '
	   	+'du modèle est vrai et l\'ajoute si la valeur du modèle est fausse',
		function() {
			var template = '<input type="text"/>';
			
			var model = [{"active" : true},
			             {"active" : false}];
			var binding = {"active" : "input?-@disabled"};

			var dom = $mamba(model, template, binding);

			OnAttend(dom[0].attributes['disabled']).DEtreNull();
			OnAttend(dom[1].attributes['disabled']).DeNePasEtreNull();
			
			template = '<input type="text" disabled/>';
			dom = $mamba(model, template, binding);
			
			OnAttend(dom[0].attributes['disabled']).DEtreNull();
			OnAttend(dom[1].attributes['disabled']).DeNePasEtreNull();
		});
	
	Ca( 'teste plusieurs propriétés du modèle dans un même élément sans \'r00t\' défini.',
	    function(){
		var template = '<input type="text"/>';
		var model = [{"active" : true, "nom" : "toto"},
			         {"active" : false, "nom" : "tutu"}];
		var binding = {"active" : "input?-@disabled",
				       "nom"    : "input@value"};
		
		var dom = $mamba(model, template, binding);
		
		OnAttend(dom.length).DEtreEgalA(2);
		OnAttend($(dom[0]).val()).DEtreEgalA('toto');
		OnAttend(dom[0].attributes['disabled']).DEtreNull();
		OnAttend($(dom[1]).val()).DEtreEgalA('tutu');
		OnAttend(dom[1].attributes['disabled']).DeNePasEtreNull();
		
	});
	
	Ca(	'teste le modèle ne contient pas une propriété de la directive \'textContent\'',
		function() {
			var template = '<div class="name"></div><div class="opt"></div>';
			
			var model = [{"name" : "toto",
				          "opt"  : "option"},
				          {"name" : "tutu"}];
			
			var binding = {"r00t" : ".name, .opt",
					       "name" : ".name",
					       "opt"  : ".opt" };

			var dom = $mamba(model, template, binding);

			OnAttend(dom.length).DEtreEgalA(3);
			OnAttend(dom[0].textContent).DEtreEgalA('toto');
			OnAttend(dom[1].textContent).DEtreEgalA('option');
			OnAttend(dom[2].textContent).DEtreEgalA('tutu');
		});

	Ca(	'teste le modèle ne contient pas une propriété de la directive \'attribut\'',
		function() {
			var template = '<div class="person"></div>';
			
			var model = [{"name" : "toto",
				          "opt"  : "option"},
				          {"name" : "tutu"}];
			
			var binding = {"name" : ".person",
					       "opt"  : ".person@opt" };

			var dom = $mamba(model, template, binding);

			OnAttend(dom[0].textContent).DEtreEgalA('toto');
			OnAttend($(dom[0]).attr('opt')).DEtreEgalA('option');
			OnAttend(dom[1].textContent).DEtreEgalA('tutu');
			OnAttend($(dom[1]).attr('opt')).DEtreNull();
		});
	
	Ca(	'teste le modèle ne contient pas une propriété de la directive \'attribut\' valeur par défaut',
		function() {
			var template = '<div class="person" opt="pouet"></div>';
			
			var model = [{"name" : "toto",
				          "opt"  : "option"},
				          {"name" : "tutu"}];
			
			var binding = {"name" : ".person",
					       "opt"  : ".person@opt" };

			var dom = $mamba(model, template, binding);

			OnAttend(dom[0].textContent).DEtreEgalA('toto');
			OnAttend($(dom[0]).attr('opt')).DEtreEgalA('option');
			OnAttend(dom[1].textContent).DEtreEgalA('tutu');
			OnAttend($(dom[1]).attr('opt')).DEtreEgalA('pouet');
		});

	Ca(	'teste quand le modèle ne contient pas une propriété de la directive \'ajout/suppr attribut\'',
		function() {
			var template = '<div class="person" disabled="pouet"></div>';
			
			var model = [{"name" : "toto",
				          "ok"  : false},
				          {"name" : "tutu"}];
			
			var binding = {"name" : ".person",
					       "ok"  : ".person?-@disabled" };

			var dom = $mamba(model, template, binding);

			OnAttend(dom[0].textContent).DEtreEgalA('toto');
			OnAttend(dom[0].attributes['disabled']).DeNePasEtreNull();
			OnAttend(dom[1].textContent).DEtreEgalA('tutu');
			OnAttend(dom[1].attributes['disabled'].value).DEtreEgalA('pouet');
		});

	Ca(	'teste quand le modèle ne contient pas un sous-modèle de la directive avec \'r00t\'',
		function() {
			var template = 
				'<div class="person">'
				+'  <span class="name"></span>'
				+'  <span class="animal">exemple</span>'
				+'</div>';
			
			var model = [{"name" : "toto",
				          "animal"  : {"name" : "felix"}},
				          {"name" : "tutu"}];
						
			var binding = {"r00t" : ".person",
				       		"name" : ".name", 
				       		"animal"  : {"r00t" : ".animal",
				       			         "name" : ".animal"}};
		 
			var dom = $mamba(model, template, binding);
		
			OnAttend(findInTemplate(dom, ".animal").length).DEtreEgalA(1);
			totoAnimal = findInTemplate(dom, ".animal")[0];
			OnAttend(totoAnimal.textContent).DEtreEgalA('felix');
		});
	
	Ca(	'teste quand le modèle ne contient pas un sous-modèle de la directive sans \'r00t\'',
		function() {
			var template = 
				'<div class="person">'
				+'  <span class="name"></span>'
				+'  <span class="animal">exemple</span>'
				+'</div>';
			
			var model = [{"name" : "toto",
				          "animal"  : {"name" : "felix"}},
				          {"name" : "tutu"}];
			
			var binding = {"r00t" : ".person",
					       "name" : ".name", 
					       "animal"  : {"name" : ".animal"}};
			 
			var dom = $mamba(model, template, binding);
			
			OnAttend(findInTemplate(dom, ".person").length).DEtreEgalA(2);
			OnAttend(findInTemplate(dom, ".animal").length).DEtreEgalA(1);
			var totoAnimal = findInTemplate(dom, ".animal")[0];
			var tutuAnimal = findInTemplate(dom, ".animal")[1];
			OnAttend(totoAnimal.textContent).DEtreEgalA('felix');
			OnAttend(tutuAnimal).DEtreNull();
		});
	
	//TODO ranger ceci
	function getResource(name, ressource){
		var result;
		$.ajax({url : '../html/'+name+'/'+ressource,
	        async : false})
	        .always(function(data){
	        	result = data.responseText;
	        });	
		return result;
	}
	
	function getTest(name){
		var template = getResource(name, 'template.html');
		var model = $.parseJSON(getResource(name, 'model.txt'));
		var binding = $.parseJSON(getResource(name, 'binding.txt'));

		return $mamba(model, template, binding);
	}
	
	Ca(	'teste le BIG TEST',
		function() {
			var dom = getTest('big_test');
			
			var expected = getResource('big_test', 'result.html');
			
			//OnAttend(_.isEqual(dom, expected)).DEtreVrai(); ne fonctionne pas, retourne toujours vrai
			//TODO :  écrire une fonction de comparaison de dom qui compare textContent et les attributs
			OnAttend(domToString(dom)).DEtreEgalA(expected);
		});

	Ca(	'teste si deux directives sur des selecteurs représentant un parent et un enfant, '
	   	+'peut importe l\'ordre',
		function() {
			var template = '<select><option/></select>';
			var model = {"hs" : true, "options" : ["toto", "tutu", "tata", "titi"]};
			var directive = {"hs" : "select?+@disabled",
					         "options" : "option"};
			
			var dom = $mamba(model, template, directive);
			
			var select = dom[0];
			OnAttend(select.options.length).DEtreEgalA(4);
			OnAttend(select.attributes['disabled']).DeNePasEtreNull();
		});
	
	Ca(	'teste le hack pour les select',
		function() {
			var template = '<select><option/></select>';
			var model = {"selection" : "tata", "options" : ["toto", "tutu", "tata", "titi"]};
			var directive = {"selection" : "select@value",
					         "options" : "option"};
			
			var dom = $mamba(model, template, directive);
			
			var select = dom[0];
			OnAttend(select.options.length).DEtreEgalA(4);
			OnAttend(select.value).DEtreEgalA('tata');
			OnAttend(select.attributes['value']).DEtreNull();
		});
	
	Ca(	'teste Mamba.setTemplate()',
		function() {
			var template1 = '<select id="la_selection"><option id="les_options"/></select>';
			var template2 = '<input type="text" id="la_selection"></input><div id="les_options"></div>';
			
			var model = {"selection" : "tata", "options" : ["toto", "tutu", "tata", "titi"]};
			var directive = {"selection" : "#la_selection@value",
					         "options" : "#les_options"};
			
			var mamba = new Mamba(model, template1, directive);
			var dom = mamba.render();
			
			var select = dom[0];
			OnAttend(select.options.length).DEtreEgalA(4);
			OnAttend(select.value).DEtreEgalA('tata');
			OnAttend(select.attributes['value']).DEtreNull();
			
			mamba.setTemplate(template2);
			dom = mamba.render(model);
			var input = dom[0];
			OnAttend(input.value).DEtreEgalA('tata');
			OnAttend(dom.length).DEtreEgalA(5);
			OnAttend(dom[1].textContent).DEtreEgalA('toto');
			OnAttend(dom[2].textContent).DEtreEgalA('tutu');
			OnAttend(dom[3].textContent).DEtreEgalA('tata');
			OnAttend(dom[4].textContent).DEtreEgalA('titi');
		});
	
	Ca(	'teste Mamba.setDirective()',
		function() {
			var template = '<div></div><span></span>';
			
			var model = {"nom" : "toto", "prenom" : "alfred"};
			var directive1 = {"nom" : "div",
					          "prenom" : "span"};
			var directive2 = {"nom" : "span",
			          		  "prenom" : "div"};
			
			var mamba = new Mamba(model, template, directive1);
			var dom = mamba.render();
			
			var div = dom[0];
			var span = dom[1];
			OnAttend(div.textContent).DEtreEgalA('toto');
			OnAttend(span.textContent).DEtreEgalA('alfred');
			
			mamba.setDirective(directive2);
			dom = mamba.render(model);
			div = dom[0];
			span = dom[1];
			OnAttend(div.textContent).DEtreEgalA('alfred');
			OnAttend(span.textContent).DEtreEgalA('toto');
		});
	
	Ca(	'teste Mamba.populate()',
		function() {
			var template = '<div></div><span></span>';
			
			var model1 = {"nom" : "toto", "prenom" : "alfred"};
			var model2 = {"nom" : "tutu", "prenom" : "bob"};
			var directive = {"nom" : "div",
					          "prenom" : "span"};
			
			$('body').append($('<div id="testPopulate"></div>'));
			                 
			var mamba = new Mamba(model1, template, directive);
			var dom = mamba.render();
			$('#testPopulate').append($(dom));
			
			var div = dom[0];
			var span = dom[1];
			OnAttend(dom.length).DEtreEgalA(2);
			OnAttend(div.textContent).DEtreEgalA('toto');
			OnAttend(span.textContent).DEtreEgalA('alfred');
			
			mamba.setModel(model2);
			mamba.populate();

			dom = $('#testPopulate').children().get();

			div = dom[0];
			span = dom[1];
			OnAttend(dom.length).DEtreEgalA(2);
			OnAttend(div.textContent).DEtreEgalA('tutu');
			OnAttend(span.textContent).DEtreEgalA('bob');
			
			$('#testPopulate').remove();
		});
	
	Ca(	'teste quatre directives avec/sans root pour un select.',
		function() {
			var template = '<select id="la_selection"><option id="les_options"/></select>';
			
			var model = {"options" : [{"value": 0, "text": "toto", "selected": false}, 
			                          {"value": 1, "text": "tutu", "selected": false}, 
			                          {"value": 2, "text": "tata", "selected": true}, 
			                          {"value": 3, "text": "titi", "selected": false}]};
			
			var directive1 = {"r00t"    : "#la_selection",
					 		  "options" :
					 		  		{"r00t"    : "#les_options",
					 			  	 "value"   : "#les_options@value",
					 			  	 "text"    : "#les_options",
					 			  	 "selected": "#les_options?+@selected"}};
			
			var directive2 = {"r00t"    : "#la_selection",
			 		          "options" :
			 		  				{"value"   : "#les_options@value",
			 		        	  	 "text"    : "#les_options",
			 		        	  	 "selected": "#les_options?+@selected"}};
			
			var directive3 = {"options" :
			 		  		  		{"r00t"    : "#les_options",
			 		  			  	 "value"   : "#les_options@value",
			 		  			  	 "text"    : "#les_options",
			 		  			  	 "selected": "#les_options?+@selected"}};
			
			var directive4 = {"options" :
			 		  		  		{"value"   : "#les_options@value",
			 		  			  	 "text"    : "#les_options",
			 		  			  	 "selected": "#les_options?+@selected"}};
			                 
			var allIsInPlace = function(dom){			
				var select = dom[0];
				var options = $(select).children().get();
				
				OnAttend(select.id).DEtreEgalA('la_selection');
				OnAttend(options.length).DEtreEgalA(4);
				OnAttend(options[0].getAttribute('value')).DEtreEgalA('0');
				OnAttend(options[1].getAttribute('value')).DEtreEgalA('1');
				OnAttend(options[2].getAttribute('value')).DEtreEgalA('2');
				OnAttend(options[3].getAttribute('value')).DEtreEgalA('3');
				OnAttend(options[0].getAttribute('selected')).DEtreNull();
				OnAttend(options[1].getAttribute('selected')).DEtreNull();
				OnAttend(options[2].getAttribute('selected')).DEtreEgalA('selected');
				OnAttend(options[3].getAttribute('selected')).DEtreNull();
			};
			
			var mamba = new Mamba(model, template, directive1);
			var dom = mamba.render();		
			allIsInPlace(dom);
			
			mamba.setDirective(directive2);
			dom = mamba.render();
			allIsInPlace(dom);
			
			mamba.setDirective(directive3);
			dom = mamba.render();
			allIsInPlace(dom);
			
			mamba.setDirective(directive4);
			dom = mamba.render();
			allIsInPlace(dom);
	});
	
	Ca(	'teste que render ajoute une fonction populate() au model.',
		function() {
			var template = '<select><option/></select>';
			
			var model = {"options" : ["ouvrir", "fermer", "annuler"]};
			
			var directive = {"options" : "option"};
			
			var mamba = new Mamba(model, template, directive);
			var dom = mamba.render();		
			
			var options = $(dom[0]).children().get();
			OnAttend(options.length).DEtreEgalA(3);
			OnAttend(model).DePosséder(MBA_CST.MAMBA);
			OnAttend(model).DePosséder(MBA_CST.POPULATE);
	});
	
	Ca(	'teste model.populate().',
		function() {
			var template = '<select><option/></select>';
			
			var model = {"options" : ["ouvrir", "fermer", "annuler"]};
			
			var directive = {"options" : "option"};
			
			var mamba = new Mamba(model, template, directive);
			var dom = mamba.render();		
			
			$('body').append($('<div id="testPopulate"></div>'));
			$('#testPopulate').append(dom);
			
			var options = $(dom[0]).children().get();
			OnAttend(options.length).DEtreEgalA(3);
			OnAttend(options[0].textContent).DEtreEgalA('ouvrir');
			OnAttend(options[1].textContent).DEtreEgalA('fermer');
			OnAttend(options[2].textContent).DEtreEgalA('annuler');
			
			model.options = ["accepter", "annuler", "refuser", "retarder"];
			model.populate();
			
			options = $('#testPopulate select').children().get();
			OnAttend(options.length).DEtreEgalA(4);
			OnAttend(options[0].textContent).DEtreEgalA('accepter');
			OnAttend(options[1].textContent).DEtreEgalA('annuler');
			OnAttend(options[2].textContent).DEtreEgalA('refuser');
			OnAttend(options[3].textContent).DEtreEgalA('retarder');
			
			$('#testPopulate').remove();
	});
	

		Ca(	'teste la création de MbaDirective à partir d\'une directive récursive', function(){
		var directive = {"nom" : "#nom",
				   "enfant" : {"prenom" : "#prenom"}};
	
		directive.enfant.parent = directive;

		var mbaDirective = new MbaDirective(directive);
		
		var parent = mbaDirective;
		var enfant = mbaDirective.getProp('enfant');
		var enfantParent = enfant.getProp('parent');
		var enfantParentEnfant = enfantParent.getProp('enfant');
		OnAttend(parent instanceof MbaDirective).DEtreVrai();
		OnAttend(enfant instanceof MbaDirective).DEtreVrai();
		OnAttend(enfantParent instanceof MbaDirective).DEtreVrai();
		OnAttend(enfantParentEnfant instanceof MbaDirective).DEtreVrai();
		
		OnAttend(parent).DeNePasEtre(enfant);
		OnAttend(enfantParent).DeNePasEtre(enfant);
		OnAttend(parent).DEtre(enfantParent);
		OnAttend(enfant).DEtre(enfantParentEnfant);
	});
	
	Ca('teste MbaDirective ne modifie pas la directive', function(){
		var directive = {"nom" : "#nom",
				   "enfant" : {"prenom" : "#prenom"}};
	
		var mbaDirective = new MbaDirective(directive);
		
		var parent = mbaDirective;
		var enfant = mbaDirective.getProp('enfant');
		
		OnAttend(directive).DeNePasPosséder(MBA_CST.DIRECTIVE);
		OnAttend(directive.enfant).DeNePasPosséder(MBA_CST.DIRECTIVE);
	});
	
	Ca('teste MbaDom.removeParents() sur template pour récursivité', function(){
		var template = 
			'    <li class="dossier">'
			+'        <div class="nom"></div>'
			+'        <ul>'
			+'            <li class="dossier"></li>'
			+'        </ul>'
			+'    </li>';
		
		var mbaDom = new MbaDom(template);
		var dossier = mbaDom.find('.dossier');
		
		OnAttend(dossier.getDom().length).DEtreEgalA(2);
		OnAttend(getDeep(dossier.getDom()[0])).DEtreEgalA(0);
		OnAttend(getDeep(dossier.getDom()[1])).DEtreEgalA(2);
		
		dossier = dossier.removeParents();
		
		OnAttend(dossier.getDom().length).DEtreEgalA(1);
		OnAttend(getDeep(dossier.getDom()[0])).DEtreEgalA(2);
	});
	
	Ca('teste MbaDom.removeParents() sur template sans parent/enfant', function(){
		var template = 
			'    <li class="dossier">'
			+'        <div class="nom"></div>'
			+'   </li>'
			+'   <ul>'
			+'        <li class="dossier"></li>'
			+'   </ul>';
		
		var mbaDom = new MbaDom(template);
		var dossier = mbaDom.find('.dossier');
		
		OnAttend(dossier.getDom().length).DEtreEgalA(2);
		OnAttend(getDeep(dossier.getDom()[0])).DEtreEgalA(0);
		OnAttend(getDeep(dossier.getDom()[1])).DEtreEgalA(1);
		
		dossier = dossier.removeParents();
		
		OnAttend(dossier.getDom().length).DEtreEgalA(2);
		OnAttend(getDeep(dossier.getDom()[0])).DEtreEgalA(0);
		OnAttend(getDeep(dossier.getDom()[1])).DEtreEgalA(1);
	});
	
	
	Ca('teste MbaDom.removeChildren() sur template pour récursivité', function(){
		var template = 
			'    <li class="dossier">'
			+'        <div class="nom"></div>'
			+'        <ul>'
			+'            <li class="dossier"></li>'
			+'        </ul>'
			+'    </li>';
		
		var mbaDom = new MbaDom(template);
		var dossier = mbaDom.find('.dossier');
		
		OnAttend(dossier.getDom().length).DEtreEgalA(2);
		OnAttend(getDeep(dossier.getDom()[0])).DEtreEgalA(0);
		OnAttend(getDeep(dossier.getDom()[1])).DEtreEgalA(2);
		
		dossier = dossier.removeChildren();
		
		OnAttend(dossier.getDom().length).DEtreEgalA(1);
		OnAttend(getDeep(dossier.getDom()[0])).DEtreEgalA(0);
	});
	
	Ca('teste MbaDom.removeChildren() sur template sans parent/enfant', function(){
		var template = 
			'    <li class="dossier">'
			+'        <div class="nom"></div>'
			+'   </li>'
			+'   <ul>'
			+'        <li class="dossier"></li>'
			+'   </ul>';
		
		var mbaDom = new MbaDom(template);
		var dossier = mbaDom.find('.dossier');
		
		OnAttend(dossier.getDom().length).DEtreEgalA(2);
		OnAttend(getDeep(dossier.getDom()[0])).DEtreEgalA(0);
		OnAttend(getDeep(dossier.getDom()[1])).DEtreEgalA(1);
		
		dossier = dossier.removeChildren();
		
		OnAttend(dossier.getDom().length).DEtreEgalA(2);
		OnAttend(getDeep(dossier.getDom()[0])).DEtreEgalA(0);
		OnAttend(getDeep(dossier.getDom()[1])).DEtreEgalA(1);
	});
	
	Ca('teste un model récursif avec profondeur finie, template non récursif et directive non récursive', function(){
		
		var template = 
			' <ul>'
			+'	<li id="parent">'
		    +'		<span id="parent-nom"></span>'
		    +'		<ul>'
		    +'			<li id="enfant">'
		    +'				<span id="enfant-nom"></span>'
		    +'				<ul>'
		    +'					<li id="petit-enfant">'
		    +'						<span id="petit-enfant-nom"></span>'
		    +'					</li>'
		    +'				</ul>'
		    +'			</li>'
		    +'		</ul>'
			+'	</li>'
			+'</ul>';
		
		var model = 
			{"nom" : "nom du parent",
			 "enfant" : {"nom" : "nom de l'enfant",
		             	 "enfant" : {"nom" : "nom du petit enfant"}}};
		var directive = 
			{"r00t"   : "#parent",
			 "nom"    : "#parent-nom",
			 "enfant" : {"r00t"   : "#enfant",
			             "nom"    : "#enfant-nom",
			             "enfant" : {"r00t" : "#petit-enfant",
				                     "nom"  : "#petit-enfant-nom"}}};
		var mamba = new Mamba(model, template, directive);
		var dom = mamba.render();
		
		var parent = $(dom[0]).children().get(0);
		var enfant = $(dom[0]).children().children().children().get(0);
		var petit_enfant = $(dom[0]).children().children().children().children().children().get(0);
		
		OnAttend($(parent).children().get(0).textContent).DEtreEgalA('nom du parent');
		OnAttend($(enfant).children().get(0).textContent).DEtreEgalA('nom de l\'enfant');
		OnAttend($(petit_enfant).children().get(0).textContent).DEtreEgalA('nom du petit enfant');
	});
	
	Ca('teste un modèle tableau avec un template dont la partie répétée n\'est pas la racine du template.', function(){
	
		var model =  [{"name" : "toto"},
		              {"name" : "anthony"}];
		
		var template = 
			'<table>'
			+'  <thead>'
			+'    <tr>'
			+'      <th>Nom</th>'
			+'    </tr'
			+'  </thead>'
			+'  <tbody>'
			+'    <tr id="person">'
			+'      <td id="name_"></td>'
			+'    </tr>'
			+'  </tbody>'
			+'</table>';
		
		var directive =	{"r00t" : "#person",
						 "name" : "#name_"};
		
		var mamba = new Mamba(model, template, directive);
		var dom = mamba.render();
		var persons = $(dom).find('td').get();
		
		OnAttend(dom.length).DEtreEgalA(1);
		OnAttend(dom[0].nodeName).DEtreEgalA('TABLE');
		OnAttend(persons.length).DEtreEgalA(2);
		OnAttend(persons[0].textContent).DEtreEgalA('toto');
		OnAttend(persons[1].textContent).DEtreEgalA('anthony');
	});
	
	//TODO tester des structure récursives sur une ou deux directives et avec un model tableau ou non
	Ca(	'teste les arbres avec Mamba.',
		function() {
			var template = 
				'    <ul><li class="dossier">'
				+'        <span class="nom"></span>'
				+'        <ul>'
				+'            <li class="dossier"></li>'
				+'        </ul>'
				+'    </li></ul>';

			var model =  {"nom"      : "racine",
						  "dossiers" : [{"nom"      : "toto", 
                                         "dossiers" : [{"nom" : "subtoto1"}, 
                                                       {"nom" : "subtoto2"}, 
                                                       {"nom" : "subtoto3"}]},
                                        {"nom"      : "tata", 
                                         "dossiers" : [{"nom" : "subtata1"}]},
                                        {"nom" : "tutu"}]};
			
			var directive = {"r00t" : ".dossier",
					         "nom" : ".nom"};
			directive.dossiers = directive;
			
			var mamba = new Mamba(model, template, directive);
			
			OnAttend(mamba.subMambas[0].directive).DEtre(mamba.directive);
			
			var dom = mamba.render();
			
			var dossiers = $(dom).find('.dossier span').get();
			OnAttend(dossiers[0].textContent).DEtreEgalA('racine');
			OnAttend(dossiers[1].textContent).DEtreEgalA('toto');
			OnAttend(dossiers[2].textContent).DEtreEgalA('subtoto1');
			OnAttend(dossiers[3].textContent).DEtreEgalA('subtoto2');
			OnAttend(dossiers[4].textContent).DEtreEgalA('subtoto3');
			OnAttend(dossiers[5].textContent).DEtreEgalA('tata');
			OnAttend(dossiers[6].textContent).DEtreEgalA('subtata1');
			OnAttend(dossiers[7].textContent).DEtreEgalA('tutu');
	});
	
	Ca(	'teste les arbres avec model tableau.',
		function() {
			var template = 
				'    <ul><li class="dossier">'
				+'        <span class="nom"></span>'
				+'        <ul>'
				+'            <li class="dossier"></li>'
				+'        </ul>'
				+'    </li></ul>';

			var model =  [{"nom"      : "toto", 
                          "dossiers" : [{"nom" : "subtoto1"}, 
                                        {"nom" : "subtoto2"}, 
                                        {"nom" : "subtoto3"}]},
                          {"nom"      : "tata", 
                           "dossiers" : [{"nom" : "subtata1"}]},
                          {"nom" : "tutu"}];
			
			var directive = {"r00t" : ".dossier",
					         "nom" : ".nom"};
			directive.dossiers = directive;
			
			var mamba = new Mamba(model, template, directive);
			
			OnAttend(mamba.subMambas[0].directive).DEtre(mamba.directive);
			
			var dom = mamba.render();
			
			var dossiers = $(dom).find('.dossier span').get();
			OnAttend(dossiers[0].textContent).DEtreEgalA('toto');
			OnAttend(dossiers[1].textContent).DEtreEgalA('subtoto1');
			OnAttend(dossiers[2].textContent).DEtreEgalA('subtoto2');
			OnAttend(dossiers[3].textContent).DEtreEgalA('subtoto3');
			OnAttend(dossiers[4].textContent).DEtreEgalA('tata');
			OnAttend(dossiers[5].textContent).DEtreEgalA('subtata1');
			OnAttend(dossiers[6].textContent).DEtreEgalA('tutu');
	});
	
	Ca('teste MbaChainAccessor.getModelValue() avec un seul accesseur', function(){
		
		var model = {"name" : "toto"};
		
		var fieldAccessor = new MbaFieldAccessor("name");
		var chainAccessor = new MbaChainAccessor();
		chainAccessor.chainAccessor(fieldAccessor);
		
		OnAttend(chainAccessor.getModelValue(model)).DEtreEgalA("toto");
	});
	
	Ca('teste MbaChainAccessor.getModelValue() avec deux accesseurs', function(){
		
		var model = {"adresse" : {"pays" : "france"}};
		
		var chainAccessor = new MbaChainAccessor();
		chainAccessor.chainAccessor(new MbaFieldAccessor("pays"));
		chainAccessor.chainAccessor(new MbaFieldAccessor("adresse"));
		
		OnAttend(chainAccessor.getModelValue(model)).DEtreEgalA("france");
	});
	
	Ca('teste MbaChainAccessor.getModelValue() avec deux accesseurs et un modèle sans sous-modèle', function(){
		
		var model = {"adresse" : null};
		
		var chainAccessor = new MbaChainAccessor();
		chainAccessor.chainAccessor(new MbaFieldAccessor("pays"));
		chainAccessor.chainAccessor(new MbaFieldAccessor("adresse"));
		
		OnAttend(chainAccessor.getModelValue(model)).DEtreEgalA(null);
	});
	
	Ca('teste MbaChainAccessor.getModelValue() avec un seul accesseur sur un modèle tableau', function(){
		
		var model = [{"name" : "toto"}, {"name" : "tutu"}];
		
		var fieldAccessor = new MbaFieldAccessor("name");
		var chainAccessor = new MbaChainAccessor();
		chainAccessor.chainAccessor(fieldAccessor);
		
		OnAttend(chainAccessor.getModelValue(model).length).DEtreEgalA(2);
		OnAttend(chainAccessor.getModelValue(model)[0]).DEtreEgalA("toto");
		OnAttend(chainAccessor.getModelValue(model)[1]).DEtreEgalA("tutu");
	});
	
	Ca('teste MbaChainAccessor.getModelValue() avec un deux accesseurs sur des modèle et sous-modèle tableau', function(){
		
		var model = [{"children" : [{"name" : "toto"}, {"name" : "titi"}]},
		             {"children" : [{"name" : "tata"}, {"name" : "tutu"}]}];
		
		var chainAccessor = new MbaChainAccessor();
		chainAccessor.chainAccessor(new MbaFieldAccessor("name"));
		chainAccessor.chainAccessor(new MbaFieldAccessor("children"));
		
		OnAttend(chainAccessor.getModelValue(model).length).DEtreEgalA(4);
		OnAttend(chainAccessor.getModelValue(model)[0]).DEtreEgalA("toto");
		OnAttend(chainAccessor.getModelValue(model)[1]).DEtreEgalA("titi");
		OnAttend(chainAccessor.getModelValue(model)[2]).DEtreEgalA("tata");
		OnAttend(chainAccessor.getModelValue(model)[3]).DEtreEgalA("tutu");
	});
	
	Ca('teste MbaChainAccessor.chainAccessor() avec un autre MbaChainAccessor en paramètre', function(){
		
		var model = {"child" : [{"children" : [{"name" : "toto"}, {"name" : "titi"}]},
		             {"children" : [{"name" : "tata"}, {"name" : "tutu"}]}]};
		
		var chainAccessor1 = new MbaChainAccessor();
		var chainAccessor2 = new MbaChainAccessor();
		chainAccessor2.chainAccessor(new MbaFieldAccessor("name"));
		chainAccessor2.chainAccessor(new MbaFieldAccessor("children"));
		
		chainAccessor1.chainAccessor(chainAccessor2);
		chainAccessor1.chainAccessor(new MbaFieldAccessor("child"));
		
		OnAttend(chainAccessor1.getAccessors().length).DEtreEgalA(3);
		OnAttend(chainAccessor1.getModelValue(model).length).DEtreEgalA(4);
		OnAttend(chainAccessor1.getModelValue(model)[0]).DEtreEgalA("toto");
		OnAttend(chainAccessor1.getModelValue(model)[1]).DEtreEgalA("titi");
		OnAttend(chainAccessor1.getModelValue(model)[2]).DEtreEgalA("tata");
		OnAttend(chainAccessor1.getModelValue(model)[3]).DEtreEgalA("tutu");
	});
	
	Ca('teste MbaDirective.getMergedBindings()', function(){
		
		var directive = {"r00t" : ".person",
		                 "name" : ".name", 
		                 "animal"  : {"name" : ".animal"}};
		
		var model = {"name" : "toto", "animal" : {"name" : "tobby"}};
		
		var mbaDirective = new MbaDirective(directive, null);
		
		var bindings = mbaDirective.getMergedBindings(); 
		OnAttend(bindings.length).DEtreEgalA(2);
		OnAttend(bindings[0].getSelector()).DEtreEgalA(".name");
		OnAttend(bindings[0].getTransf().length).DEtreEgalA(1);
		
		OnAttend(bindings[1].getSelector()).DEtreEgalA(".animal");
		OnAttend(bindings[1].getTransf().length).DEtreEgalA(1);
		
		
		var nameAccessor = bindings[0].getTransf()[0].accessor;
		var animalNameAccessor = bindings[1].getTransf()[0].accessor;
		
		OnAttend(nameAccessor instanceof MbaProxyAccessor).DEtreVrai();
		OnAttend(animalNameAccessor instanceof MbaChainAccessor).DEtreVrai();
		
		OnAttend(nameAccessor.getModelValue(model)).DEtreEgalA("toto");
		OnAttend(animalNameAccessor.getModelValue(model)).DEtreEgalA("tobby");
		
	});
	
	Ca('teste la syntaxe {...} pour définir une fonction spécifique', function(){
		
		var template = '<div></div>';
		var model = {"name" : "toto"};
		var directive = {"name" : "div{function(dom, value){dom.textContent = value; dom.id = value;}}"};
		
		var mamba = new Mamba(model, template, directive);
		var dom = mamba.render();
		
		OnAttend(dom[0].id).DEtreEgalA('toto');
		OnAttend(dom[0].textContent).DEtreEgalA('toto');
	});
	
	Ca('teste le getter et le setter du MbaProxyAccessor sur une propriété.',
	   function(){
		
		var getterSetter = 'name';
		var model = {"name" : "toto"};
		
		var accessor = new MbaProxyAccessor(getterSetter);
		
		OnAttend(accessor.getModelValue(model)).DEtreEgalA('toto');
		accessor.setModelValue(model, "tutu");
		OnAttend(accessor.getModelValue(model)).DEtreEgalA('tutu');
	});
	
	Ca('teste le getter et le setter du MbaProxyAccessor sur une fonction qui fait getter et setter.',
	   function(){
		
		var getterSetter = 'name';
		var model = {"_name" : "toto",
				     "name" : function(){
				    	 if(arguments.length > 0)
				    		 this._name = arguments[0]; 
				    	 else 
				    		 return this._name;}};
		
		var accessor = new MbaProxyAccessor(getterSetter);
		
		OnAttend(accessor.getModelValue(model)).DEtreEgalA('toto');
		accessor.setModelValue(model, "tutu");
		OnAttend(accessor.getModelValue(model)).DEtreEgalA('tutu');
	});
	
	Ca('teste le getter et le setter du MbaProxyAccessor sur deux fonctions (un getter et un setter).',
	   function(){
		
		var getterSetter = 'getName, setName';
		var model = {"_name" : "toto",
				     "getName" : function(){
				    		 return this._name;
				     },
				     "setName" : function(value){
				    	 this._name = value;
				     }};
		
		var accessor = new MbaProxyAccessor(getterSetter);
		
		OnAttend(accessor.getModelValue(model)).DEtreEgalA('toto');
		accessor.setModelValue(model, "tutu");
		OnAttend(accessor.getModelValue(model)).DEtreEgalA('tutu');
	});
		
	Ca('teste un modèle avec des fonctions qui font office de getter et setter en même temps pour accéder aux valeurs.',
	   function(){
		
		var template = '<div></div>';
		
		var model = {"_name" : "toto",
					 "name" : function(){
						 if(arguments.length==0) 
							 return this._name; 
						 else 
							 this._name = arguments[0];}};
		
		var directive = {"name" : "div"};
		
		var mamba = new Mamba(model, template, directive);
		var dom = mamba.render();
		
		OnAttend(dom[0].textContent).DEtreEgalA('toto');
	});
	
	//TODO tester ensuite le cas ou on utilise la 'mise à plat' et des fonctions getter/setter ex "getAdresse.getTown, setAdresse.setTown ?"
	//C'est moche en fait, interdire la mise a plat avec des fonctions getter/setter différentes ?
	Ca('teste un modèle avec des fonctions getter et setter différentes pour accéder aux valeurs.',
	   function(){
		
		var template = '<div></div>';
		
		var model = {"_name" : "toto",
					 "getName" :function(){return this._name;},
				     "setName" : function(value){this._name = value;}};
		
		var directive = {"getName, setName" : "div"};
		
		var mamba = new Mamba(model, template, directive);
		var dom = mamba.render();
		
		OnAttend(dom[0].textContent).DEtreEgalA('toto');
	});

	Ca('teste que MbaDom.concat() insère les nouveaux éléments à la suite des autres si les éléments existants ont un parent.', 
	   function(){
		var mbaDom = new MbaDom('<span></span>');
		
		OnAttend(mbaDom.belongAnotherDom()).DEtreFaux();
		var parent = $('<div id="parent"><br/></div>');
		parent.prepend(mbaDom.getDom());
		
		OnAttend(mbaDom.belongAnotherDom()).DEtreVrai();
		OnAttend(parent.children().length).DEtreEgalA(2);
		
		mbaDom.concat(new MbaDom('<span></span>'));
		
		OnAttend(parent.children().length).DEtreEgalA(3);
		OnAttend(parent.children().get(0).nodeName).DEtreEgalA('SPAN');
		OnAttend(parent.children().get(1).nodeName).DEtreEgalA('SPAN');
		OnAttend(parent.children().get(2).nodeName).DEtreEgalA('BR');
	});
	
	Ca('teste que MbaDom.keepNthFirst() supprime les éléments en trop du dom si ils ont un parent.', 
	   function(){
		var mbaDom = new MbaDom('<div></div><span></span>');
		
		OnAttend(mbaDom.belongAnotherDom()).DEtreFaux();
		
		var parent = $('<div id="parent"></div>');
		parent.append(mbaDom.getDom());
		
		OnAttend(mbaDom.belongAnotherDom()).DEtreVrai();
		OnAttend(parent.children().length).DEtreEgalA(2);
		
		mbaDom.keepNthFirst(1);
		
		OnAttend(parent.children().length).DEtreEgalA(1);
		OnAttend(parent.children().get(0).nodeName).DEtreEgalA('DIV');
	});
	
	Ca('teste que MbaTransf.update() sur un template avec élément et un modèle avec un élément', function(){
		var model = {"name" : "toto"};
		var accessor = new MbaFieldAccessor('name');
		var transf = new MbaTransf(DOM_TRANSF.text, accessor);
		
		var template = new MbaDom('<div></div>');
		var renderedDom = transf.render(template, model, 0);
		var parent = $('<div id="parent"></div>');
		parent.append(renderedDom.getDom());
		
		var firstElement = parent.children().get(0);
		OnAttend(firstElement.textContent).DEtreEgalA('toto');
		
		model.name = 'tutu';
		transf.update(renderedDom, model, template, 0);
		
		var firstElementUpdated = parent.children().get(0);
		OnAttend(firstElementUpdated.textContent).DEtreEgalA('tutu');
		OnAttend(firstElement).DEtre(firstElementUpdated);
	});
	
	Ca('teste que MbaTransf.update() sur un template avec élément et un modèle tableau', function(){
		var model = {"names" : ["toto", "tata"]};
		var accessor = new MbaFieldAccessor('names');
		var transf = new MbaTransf(DOM_TRANSF.text, accessor);
		
		var template = new MbaDom('<div></div>');
		var renderedDom = transf.render(template, model, 0);
		var parent = $('<div id="parent"></div>');
		parent.append(renderedDom.getDom());
		
		var firstElement = parent.children().get(0);
		var secondElement = parent.children().get(1);
		OnAttend(firstElement.textContent).DEtreEgalA('toto');
		OnAttend(secondElement.textContent).DEtreEgalA('tata');
		
		model.names[0] = 'tutu';
		model.names[1] = 'titi';
		transf.update(renderedDom, model, template, 0);
		
		var firstElementUpdated = parent.children().get(0);
		var secondElementUpdated = parent.children().get(1);
		OnAttend(firstElementUpdated.textContent).DEtreEgalA('tutu');
		OnAttend(secondElementUpdated.textContent).DEtreEgalA('titi');
		OnAttend(firstElement).DEtre(firstElementUpdated);
		OnAttend(secondElement).DEtre(secondElementUpdated);
	});
	
	Ca('teste que MbaTransf.update() sur un template avec plusieurs éléments et un modèle tableau', function(){
		var model = {"names" : ["toto", "tata"]};
		var accessor = new MbaFieldAccessor('names');
		var transf = new MbaTransf(DOM_TRANSF.text, accessor);
		
		var template = new MbaDom('<div></div><div></div>');
		var renderedDom = transf.render(template, model, 0);
		var parent = $('<div id="parent"></div>');
		parent.append(renderedDom.getDom());
		
		var firstElement = parent.children().get(0);
		var firstElementBis = parent.children().get(1);
		var secondElement = parent.children().get(2);
		var secondElementBis = parent.children().get(3);
		
		OnAttend(firstElement.textContent).DEtreEgalA('toto');
		OnAttend(firstElementBis.textContent).DEtreEgalA('toto');
		OnAttend(secondElement.textContent).DEtreEgalA('tata');
		OnAttend(secondElementBis.textContent).DEtreEgalA('tata');
		
		model.names[0] = 'tutu';
		model.names[1] = 'titi';
		transf.update(renderedDom, model, template, 0);
		
		var firstElementUpdated = parent.children().get(0);
		var firstElementBisUpdated = parent.children().get(1);
		var secondElementUpdated = parent.children().get(2);
		var secondElementBisUpdated = parent.children().get(3);
		
		OnAttend(firstElementUpdated.textContent).DEtreEgalA('tutu');
		OnAttend(firstElementBisUpdated.textContent).DEtreEgalA('tutu');
		OnAttend(secondElementUpdated.textContent).DEtreEgalA('titi');
		OnAttend(secondElementBisUpdated.textContent).DEtreEgalA('titi');
		
		OnAttend(firstElement).DEtre(firstElementUpdated);
		OnAttend(firstElementBis).DEtre(firstElementBisUpdated);
		OnAttend(secondElement).DEtre(secondElementUpdated);
		OnAttend(secondElementBis).DEtre(secondElementBisUpdated);
	});
	
	Ca('teste que MbaTransf.update() peut ajouter des éléments si la taille du tableau du modèle augmente', function(){
		var model = {"names" : ["toto"]};
		var accessor = new MbaFieldAccessor('names');
		var transf = new MbaTransf(DOM_TRANSF.text, accessor);
		
		var template = new MbaDom('<div></div>');
		var renderedDom = transf.render(template, model, 0);
		var parent = $('<div id="parent"></div>');
		parent.append(renderedDom.getDom());
		
		var firstElement = parent.children().get(0);
		OnAttend(renderedDom.getDom().length).DEtreEgalA(1);
		OnAttend(firstElement.textContent).DEtreEgalA('toto');
		
		model.names[0] = 'tutu';
		model.names[1] = 'titi';
		transf.update(renderedDom, model, template, 0);
		
		OnAttend(renderedDom.getDom().length).DEtreEgalA(2);
		var firstElementUpdated = parent.children().get(0);
		var secondElementUpdated = parent.children().get(1);
		OnAttend(firstElementUpdated.textContent).DEtreEgalA('tutu');
		OnAttend(secondElementUpdated.textContent).DEtreEgalA('titi');
		OnAttend(firstElement).DEtre(firstElementUpdated);
	});
	
	Ca('teste que MbaTransf.update() peut retirer des éléments si la taille du tableau du modèle diminue', function(){
		var model = {"names" : ["toto", "tata"]};
		var accessor = new MbaFieldAccessor('names');
		var transf = new MbaTransf(DOM_TRANSF.text, accessor);
		
		var template = new MbaDom('<div></div>');
		var renderedDom = transf.render(template, model, 0);
		var parent = $('<div id="parent"></div>');
		parent.append(renderedDom.getDom());
		
		OnAttend(renderedDom.getDom().length).DEtreEgalA(2);
		var firstElement = parent.children().get(0);
		var secondElement = parent.children().get(1);
		OnAttend(firstElement.textContent).DEtreEgalA('toto');
		OnAttend(secondElement.textContent).DEtreEgalA('tata');
		
		model.names = ['tutu'];
		transf.update(renderedDom, model, template, 0);
		
		OnAttend(renderedDom.getDom().length).DEtreEgalA(1);
		var firstElementUpdated = parent.children().get(0);
		OnAttend(firstElementUpdated.textContent).DEtreEgalA('tutu');
		OnAttend(firstElement).DEtre(firstElementUpdated);
	});
	
	Ca('teste que MbaBinding.renderNoRoot() mémorise les éléments de dom rendus', function(){
		var model = [{"name" : "toto", 
			          "job" : "student"}, 
			         {"name" : "tata", 
			          "job" : "boss"}];
		var directive = {"name" : "div",
			             "job" : "div@class"};
		var template = "<div></div>";
			
		var mamba = new Mamba(model, template, directive);
	
		OnAttend(mamba.bindings.length).DEtreEgalA(1);
		
		var binding = mamba.bindings[0];
		
		var renderedDom = binding.renderNoRoot(model, new MbaDom(template));
		OnAttend(binding.getRenderedDoms(0).toString()+binding.getRenderedDoms(1).toString()).DEtreEgalA(renderedDom.toString());
	});
	
	Ca('teste que MbaBinding.renderWithRoot() mémorise les éléments de dom rendus', function(){
		var model = [{"name" : "toto", 
			          "job" : "student"}, 
			         {"name" : "tata", 
			          "job" : "boss"}];
		var directive = {"name" : "div",
			             "job" : "div@class"};
		var template = "<div></div>";
			
		var mamba = new Mamba(model, template, directive);
	
		OnAttend(mamba.bindings.length).DEtreEgalA(1);
		
		var binding = mamba.bindings[0];
		
		var renderedDom1 = binding.renderWithRoot(model[0], new MbaDom(template), 0);
		var renderedDom2 = binding.renderWithRoot(model[1], new MbaDom(template), 1);
		OnAttend(binding.getRenderedDoms(0).toString()).DEtreEgalA(renderedDom1.toString());
		OnAttend(binding.getRenderedDoms(1).toString()).DEtreEgalA(renderedDom2.toString());
	});

	Ca('teste que MbaBinding.updateNoRoot() met à jour les valeurs si la taille du modèle ne change pas', function(){
		var model = [{"name" : "toto", 
			          "job" : "student"}, 
			         {"name" : "tata", 
			          "job" : "boss"}];
		var directive = {"name" : "div",
			             "job" : "div@class"};
		var template = "<div></div>";
			
		var mamba = new Mamba(model, template, directive);
	
		OnAttend(mamba.bindings.length).DEtreEgalA(1);
		
		var binding = mamba.bindings[0];
		
		var renderedDom = binding.renderNoRoot(model, new MbaDom(template));
		var parent = $('<div id="parent"></div>');
		parent.append(renderedDom.getDom());
		
		OnAttend(parent.children().length).DEtreEgalA(2);
		var div1 = parent.children().get(0);
		var div2 = parent.children().get(1);
		OnAttend(div1.textContent).DEtreEgalA('toto');
		OnAttend(div1.attributes['class'].value).DEtreEgalA('student');
		OnAttend(div2.textContent).DEtreEgalA('tata');
		OnAttend(div2.attributes['class'].value).DEtreEgalA('boss');
		
		
		model = [{"name" : "titi", 
	          	  "job" : "craftman"}, 
	          	 {"name" : "tutu", 
	              "job" : "dancer"}];
		
		binding.updateNoRoot(model, new MbaDom(template));
		
		OnAttend(parent.children().length).DEtreEgalA(2);
		var div1Updated = parent.children().get(0);
		var div2Updated = parent.children().get(1);
		OnAttend(div1.textContent).DEtreEgalA('titi');
		OnAttend(div1.attributes['class'].value).DEtreEgalA('craftman');
		OnAttend(div2.textContent).DEtreEgalA('tutu');
		OnAttend(div2.attributes['class'].value).DEtreEgalA('dancer');
		
		OnAttend(div1).DEtre(div1Updated);
		OnAttend(div2).DEtre(div2Updated);
	});
	
	Ca('teste que MbaBinding.updateNoRoot() met à jour les valeurs si la taille du modèle diminue', function(){
			var model = [{"name" : "toto",
						  "job" : "student"},
						 {"name" : "tata",
				          "job" : "boss"}];
			var directive = {"name" : "div",
							 "job" : "div@class"};
			var template = "<div></div>";

			var mamba = new Mamba(model, template, directive);

			OnAttend(mamba.bindings.length).DEtreEgalA(1);

			var binding = mamba.bindings[0];

			var renderedDom = binding.renderNoRoot(model, new MbaDom(template));
			var parent = $('<div id="parent"></div>');
			parent.append(renderedDom.getDom());

			OnAttend(parent.children().length).DEtreEgalA(2);
			var div1 = parent.children().get(0);
			var div2 = parent.children().get(1);
			OnAttend(div1.textContent).DEtreEgalA('toto');
			OnAttend(div1.attributes['class'].value).DEtreEgalA('student');
			OnAttend(div2.textContent).DEtreEgalA('tata');
			OnAttend(div2.attributes['class'].value).DEtreEgalA('boss');

			model = [{"name" : "titi",
			          "job" : "engineer"}];

			binding.updateNoRoot(model, new MbaDom(template));

			OnAttend(parent.children().length).DEtreEgalA(1);
			var div1Updated = parent.children().get(0);
			OnAttend(div1.textContent).DEtreEgalA('titi');
			OnAttend(div1.attributes['class'].value).DEtreEgalA('engineer');
			
			OnAttend(div1).DEtre(div1Updated);
	});
	
	Ca('teste que MbaBinding.updateNoRoot() met à jour les valeurs si la taille du modèle augmente', function(){
		var model = [{"name" : "toto",
					  "job" : "student"}];
		var directive = {"name" : "div",
						 "job" : "div@class"};
		var template = "<div></div>";
		var mamba = new Mamba(model, template, directive);
		
		OnAttend(mamba.bindings.length).DEtreEgalA(1);
		
		var binding = mamba.bindings[0];
		var renderedDom = binding.renderNoRoot(model, new MbaDom(template));
		var parent = $('<div id="parent"></div>');
		parent.append(renderedDom.getDom());
		
		OnAttend(parent.children().length).DEtreEgalA(1);
		var div1 = parent.children().get(0);
		OnAttend(div1.textContent).DEtreEgalA('toto');
		OnAttend(div1.attributes['class'].value).DEtreEgalA('student');
		
		model = [ {"name" : "titi",
				   "job" : "engineer"},
				  {"name" : "tata",
					"job" : "boss"} ];

		binding.updateNoRoot(model, new MbaDom(template));
		
		OnAttend(parent.children().length).DEtreEgalA(2);
		var div1Updated = parent.children().get(0);
		var div2 = parent.children().get(1);
		OnAttend(div1.textContent).DEtreEgalA('titi');
		OnAttend(div1.attributes['class'].value).DEtreEgalA('engineer');
		OnAttend(div2.textContent).DEtreEgalA('tata');
		OnAttend(div2.attributes['class'].value).DEtreEgalA('boss');
		OnAttend(div1).DEtre(div1Updated);
	});
	
	Ca('teste Mbamba.updateNoRoot() met à jour les valeurs pour deux bindings différents',
	   function(){
		var model = [{"schoolName" : "harvard",
			     	  "students" : ["toto", "tutu"]},
			     	 {"schoolName" : "polytechnique",
			     	  "students" : ["titi"]}];
		
		var directive = {"schoolName" : ".school",
				 	     "students" : ".student"};
		
		var template = '<div>Schools : </div>'
					  +'<div class="school"></div>'
					  +'<br/>'
					  +'<div>Students : </div>'
					  +'<div class="student"></div>';
		
		var mamba = new Mamba(model, template, directive);
		
		OnAttend(mamba.bindings.length).DEtreEgalA(2);
		
		var renderedDom = mamba.render();
		
		var parent = $('<div id="parent"></div>');
		parent.append(renderedDom);
		
		OnAttend(parent.children().length).DEtreEgalA(8);
		var school1 = parent.children().get(1);
		var school2 = parent.children().get(2);
		var student1 = parent.children().get(5);
		var student2 = parent.children().get(6);
		var student3 = parent.children().get(7);
		OnAttend(school1.textContent).DEtreEgalA('harvard');
		OnAttend(school2.textContent).DEtreEgalA('polytechnique');
		OnAttend(student1.textContent).DEtreEgalA('toto');
		OnAttend(student2.textContent).DEtreEgalA('tutu');
		OnAttend(student3.textContent).DEtreEgalA('titi');
		
		model = [{"schoolName" : "bordeaux1",
	     	  	  "students" : ["toto", "tata"]},
		     	 {"schoolName" : "polytech",
		     	  "students" : ["titi", "tutu"]}];

		mamba.updateRootOrNot(model);
		
		OnAttend(parent.children().length).DEtreEgalA(9);
		var school1Updated = parent.children().get(1);
		var school2Updated = parent.children().get(2);
		var student1Updated = parent.children().get(5);
		var student2Updated = parent.children().get(6);
		var student3Updated = parent.children().get(7);
		var student4 = parent.children().get(8);
		OnAttend(school1Updated.textContent).DEtreEgalA('bordeaux1');
		OnAttend(school2Updated.textContent).DEtreEgalA('polytech');
		OnAttend(student1Updated.textContent).DEtreEgalA('toto');
		OnAttend(student2Updated.textContent).DEtreEgalA('tata');
		OnAttend(student3Updated.textContent).DEtreEgalA('titi');
		OnAttend(student4.textContent).DEtreEgalA('tutu');		
	});
	
	Ca('teste Mbamba.updateNoRoot() met à jour les sub mambas',
	   function(){
		var model = {"schoolName" : "harvard",
				  	  "students" : [{"name" : "toto", "age" : 18}, 
				  	                {"name" : "tutu", "age" : 19}]};
		
		var directive = {"schoolName" : ".school",
				  		 "students" : {"name" : ".student_name",
				  			 		   "age" : ".student_age"}};
		
		var template = '<div>Schools : </div>           '
			  		   +'<div class="school"></div>      '
			  		   +'<div>Students name : </div>     '
			  		   +'<div class="student_name"></div>'
			  		   +'<div>Students age : </div>     '
			  		   +'<div class="student_age"></div>';
		
		var mamba = new Mamba(model, template, directive);		
		var renderedDom = mamba.render();
		
		var parent = $('<div id="parent"></div>');
		parent.append(renderedDom);
		
		OnAttend(parent.children().length).DEtreEgalA(8);
		var school = parent.children().get(1);
		var student1Name = parent.children().get(3);
		var student2Name = parent.children().get(4);
		var student1Age = parent.children().get(6);
		var student2Age = parent.children().get(7);
		
		OnAttend(school.textContent).DEtreEgalA('harvard');
		OnAttend(student1Name.textContent).DEtreEgalA('toto');
		OnAttend(student1Age.textContent).DEtreEgalA(18);
		OnAttend(student2Name.textContent).DEtreEgalA('tutu');
		OnAttend(student2Age.textContent).DEtreEgalA(19);
		
		model.schoolName = "bordeaux1";
		model.students[0].age = 17;
		model.students.push({"name" : "tata", "age" : 12});

		mamba.updateRootOrNot(model);
		
		OnAttend(parent.children().length).DEtreEgalA(10);
		var schoolUpdated = parent.children().get(1);
		var student1NameUpdated = parent.children().get(3);
		var student2NameUpdated = parent.children().get(4);
		var student3Name = parent.children().get(5);
		var student1AgeUpdated = parent.children().get(7);
		var student2AgeUpdated = parent.children().get(8);
		var student3Age = parent.children().get(9);
		
		OnAttend(schoolUpdated.textContent).DEtreEgalA('bordeaux1');
		OnAttend(student1NameUpdated.textContent).DEtreEgalA('toto');
		OnAttend(student1AgeUpdated.textContent).DEtreEgalA(17);
		OnAttend(student2NameUpdated.textContent).DEtreEgalA('tutu');
		OnAttend(student2AgeUpdated.textContent).DEtreEgalA(19);
		OnAttend(student3Name.textContent).DEtreEgalA('tata');
		OnAttend(student3Age.textContent).DEtreEgalA(12);
		
	});
	
	Ca('teste Mbamba.updateNoRoot() met à jour un sub mamba avec un sous-modèle qui n\'était pas dans le modèle au render',
	   function(){
		var model = {"schoolName" : "harvard",
				  	  "students" : null};
		
		var directive = {"schoolName" : ".school",
				  		 "students" : {"name" : ".student_name",
				  			 		   "age" : ".student_age"}};
		
		var template = '<div>Schools : </div>           '
					  +'<div class="school"></div>      '
					  +'<div>Students name : </div>     '
					  +'<div class="student_name"></div>'
					  +'<div>Students age : </div>     '
					  +'<div class="student_age"></div>';
		
		var mamba = new Mamba(model, template, directive);		
		var renderedDom = mamba.render();
		
		var parent = $('<div id="parent"></div>');
		parent.append(renderedDom);
		
		OnAttend(parent.children().length).DEtreEgalA(4);
		var school = parent.children().get(1);
		OnAttend(school.textContent).DEtreEgalA('harvard');		
		
		model.schoolName = "bordeaux1";
		model.students = [{"name" : "tata", "age" : 12}, {"name" : "toto", "age" : 22}];

		mamba.updateRootOrNot(model);
		
		OnAttend(parent.children().length).DEtreEgalA(8);
		var schoolUpdated = parent.children().get(1);
		var student1Name = parent.children().get(3);
		var student2Name = parent.children().get(4);
		
		var student1Age = parent.children().get(6);
		var student2Age = parent.children().get(7);
		
		OnAttend(schoolUpdated.textContent).DEtreEgalA('bordeaux1');
		OnAttend(student1Name.textContent).DEtreEgalA('tata');
		OnAttend(student1Age.textContent).DEtreEgalA(12);
		OnAttend(student2Name.textContent).DEtreEgalA('toto');
		OnAttend(student2Age.textContent).DEtreEgalA(22);
		
		parent.remove();
	});
	
	Ca('teste MbaDom.insertAtIndex() sur un MbaDom qui n\'est pas inséré dans le dom (pas de parent)',
	   function(){
		
		var dom = new MbaDom('<div id="toto"></div><div id="tata"></div>');
		var domToInsert = new MbaDom('<div id="tutu"></div><div id="titi"></div>');
		
		dom.insertAtIndex(domToInsert, 0);
		
		OnAttend(dom.getDom().length).DEtreEgalA(4);
		OnAttend(dom.getDom(0).id).DEtreEgalA('tutu');
		OnAttend(dom.getDom(1).id).DEtreEgalA('titi');
		OnAttend(dom.getDom(2).id).DEtreEgalA('toto');
		OnAttend(dom.getDom(3).id).DEtreEgalA('tata');
	});
	
	Ca('teste MbaDom.insertAtIndex(0) sur un MbaDom qui est inséré dans le dom',
	   function(){
		
		var dom = new MbaDom('<div id="toto"></div><div id="tata"></div>');
		var parent = $('<div id="parent"></div>');
		parent.append(dom.getDom());
		
		var domToInsert = new MbaDom('<div id="tutu"></div><div id="titi"></div>');
		
		dom.insertAtIndex(domToInsert, 0);
				
		OnAttend(parent.children().length).DEtreEgalA(4);
		OnAttend(parent.children().get(0).id).DEtreEgalA('tutu');
		OnAttend(parent.children().get(1).id).DEtreEgalA('titi');
		OnAttend(parent.children().get(2).id).DEtreEgalA('toto');
		OnAttend(parent.children().get(3).id).DEtreEgalA('tata');
	});
	
	Ca('teste MbaDom.insertAtIndex(n) sur un MbaDom qui est inséré dans le dom',
	   function(){
		
		var dom = new MbaDom('<div id="toto"></div><div id="tata"></div>');
		var parent = $('<div id="parent"></div>');
		parent.append(dom.getDom());
		
		var domToInsert = new MbaDom('<div id="tutu"></div><div id="titi"></div>');
		
		dom.insertAtIndex(domToInsert, 2);
		
		OnAttend(parent.children().length).DEtreEgalA(4);
		OnAttend(parent.children().get(0).id).DEtreEgalA('toto');
		OnAttend(parent.children().get(1).id).DEtreEgalA('tata');
		OnAttend(parent.children().get(2).id).DEtreEgalA('tutu');
		OnAttend(parent.children().get(3).id).DEtreEgalA('titi');
	});
	
	Ca('teste Mbamba.updateWithRoot() met à jour le dom avec les valeurs du modèle taille fixe',
	   function(){
		var model = {"name" : "squarepants",
				  	 "firstName" : "spongebob"};
		
		var directive = {"r00t" : ".root",
						 "name" : ".name",
				  		 "firstName" : ".first_name"};
		
		var template = '<span class="root">name : </span>           '
					  +'<span class="root name"></span>     '
					  +'<br class="root"/>                          '
					  +'<span class="root">first name : </span>     '
					  +'<span class="root first_name"></span>'
					  +'<br class="root"/>                          ';
		
		var mamba = new Mamba(model, template, directive);		
		var renderedDom = mamba.render();
		
		var parent = $('<div id="parent"></div>');
		parent.append(renderedDom);
		
		OnAttend(parent.children().length).DEtreEgalA(6);
		var name = parent.children().get(1);
		var firstName = parent.children().get(4);
		
		OnAttend(name.textContent).DEtreEgalA('squarepants');
		OnAttend(firstName.textContent).DEtreEgalA('spongebob');
		OnAttend(mamba.renderedDom.getDom().length).DEtreEgalA(6);
		OnAttend(mamba.renderedDom.getDom(1)).DEtre(name);
		OnAttend(mamba.renderedDom.getDom(4)).DEtre(firstName);
		
		model = [{"name" : "sponge",
				  "firstName" : "bob"}];

		mamba.updateRootOrNot(model);
		
		OnAttend(parent.children().length).DEtreEgalA(6);
		var name1 = parent.children().get(1);
		var firstName1 = parent.children().get(4);
			
		OnAttend(name1.textContent).DEtreEgalA('sponge');
		OnAttend(firstName1.textContent).DEtreEgalA('bob');
		OnAttend(mamba.renderedDom.getDom().length).DEtreEgalA(6);
		OnAttend(mamba.renderedDom.getDom(1)).DEtre(name1);
		OnAttend(mamba.renderedDom.getDom(4)).DEtre(firstName1);
		
		parent.remove();
	});
	
	Ca('teste Mbamba.updateWithRoot() met à jour le dom avec les valeur du modèle ajout d\'éléments dans le modèle',
	   function(){
		var model = {"name" : "squarepants",
				  	 "firstName" : "spongebob"};
		
		var directive = {"r00t" : ".root",
						 "name" : ".name",
				  		 "firstName" : ".first_name"};
		
		var template = '<span class="root">name : </span>           '
					  +'<span class="root name"></span>     '
					  +'<br class="root"/>                          '
					  +'<span class="root">first name : </span>     '
					  +'<span class="root first_name"></span>'
					  +'<br class="root"/>                          ';
		
		var mamba = new Mamba(model, template, directive);		
		var renderedDom = mamba.render();
		
		var parent = $('<div id="parent"></div>');
		parent.append(renderedDom);
		
		$(document.body).append(parent);
		
		OnAttend(parent.children().length).DEtreEgalA(6);
		var name = parent.children().get(1);
		var firstName = parent.children().get(4);
		
		OnAttend(name.textContent).DEtreEgalA('squarepants');
		OnAttend(firstName.textContent).DEtreEgalA('spongebob');
		OnAttend(mamba.renderedDom.getDom().length).DEtreEgalA(6);
		OnAttend(mamba.renderedDom.getDom(1)).DEtre(name);
		OnAttend(mamba.renderedDom.getDom(4)).DEtre(firstName);
		
		model = [{"name" : "sponge",
				  "firstName" : "bob"}, 
				 {"name" : "star",
				  "firstName" : "patrick"}];

		mamba.updateRootOrNot(model);
		
		OnAttend(parent.children().length).DEtreEgalA(12);
		var name1 = parent.children().get(1);
		var firstName1 = parent.children().get(4);
		var name2 = parent.children().get(7);
		var firstName2 = parent.children().get(10);
		
		OnAttend(name1.textContent).DEtreEgalA('sponge');
		OnAttend(firstName1.textContent).DEtreEgalA('bob');
		OnAttend(name2.textContent).DEtreEgalA('star');
		OnAttend(firstName2.textContent).DEtreEgalA('patrick');
		OnAttend(mamba.renderedDom.getDom().length).DEtreEgalA(12);
		OnAttend(mamba.renderedDom.getDom(1)).DEtre(name1);
		OnAttend(mamba.renderedDom.getDom(4)).DEtre(firstName1);
		OnAttend(mamba.renderedDom.getDom(7)).DEtre(name2);
		OnAttend(mamba.renderedDom.getDom(10)).DEtre(firstName2);
		
		parent.remove();
	});
	
	Ca('teste Mbamba.updateWithRoot() met à jour le dom avec les valeur du modèle suppression d\'éléments dans le modèle',
	   function(){
		var model = [{"name" : "sponge",
			  		  "firstName" : "bob"}, 
			  		 {"name" : "star",
			  		  "firstName" : "patrick"}];		
		
		var directive = {"r00t" : ".root",
						 "name" : ".name",
				  		 "firstName" : ".first_name"};
		
		var template = '<span class="root">name : </span>           '
					  +'<span class="root name"></span>     '
					  +'<br class="root"/>                          '
					  +'<span class="root">first name : </span>     '
					  +'<span class="root first_name"></span>'
					  +'<br class="root"/>                          ';
		
		var mamba = new Mamba(model, template, directive);		
		var renderedDom = mamba.render();
		
		var parent = $('<div id="parent"></div>');
		parent.append(renderedDom);
		
		$(document.body).append(parent);
		
		OnAttend(parent.children().length).DEtreEgalA(12);
		var name1 = parent.children().get(1);
		var firstName1 = parent.children().get(4);
		var name2 = parent.children().get(7);
		var firstName2 = parent.children().get(10);
		
		OnAttend(name1.textContent).DEtreEgalA('sponge');
		OnAttend(firstName1.textContent).DEtreEgalA('bob');
		OnAttend(name2.textContent).DEtreEgalA('star');
		OnAttend(firstName2.textContent).DEtreEgalA('patrick');
		OnAttend(mamba.renderedDom.getDom().length).DEtreEgalA(12);
		OnAttend(mamba.renderedDom.getDom(1)).DEtre(name1);
		OnAttend(mamba.renderedDom.getDom(4)).DEtre(firstName1);
		OnAttend(mamba.renderedDom.getDom(7)).DEtre(name2);
		OnAttend(mamba.renderedDom.getDom(10)).DEtre(firstName2);
		
		
		model = {"name" : "squarepants",
			  	 "firstName" : "spongebob"};

		mamba.updateRootOrNot(model);
		
		OnAttend(parent.children().length).DEtreEgalA(6);
		var name = parent.children().get(1);
		var firstName = parent.children().get(4);
		
		OnAttend(name.textContent).DEtreEgalA('squarepants');
		OnAttend(firstName.textContent).DEtreEgalA('spongebob');
		OnAttend(mamba.renderedDom.getDom().length).DEtreEgalA(6);
		OnAttend(mamba.renderedDom.getDom(1)).DEtre(name);
		OnAttend(mamba.renderedDom.getDom(4)).DEtre(firstName);
		
		parent.remove();
	});
	
	//tester ajout, suppr et aussi quand submambas est null au début
	Ca('teste mamba.updateWithRoot() met à jour les subMambas, ajout', function(){
		var model = {"label" : "options",
				 	 "options" : [{"lib" : "option 1", "value" : 1}]};
			
		var template = '<div>'
					  +'<span></span>'
					  +'<select><option/></select>'      
					  +'</div>';
		
		var directive =  {"r00t" : "div",
				 		  "label" : "span",
				 		  "options" : {"lib" : "option",
				 			  		   "value" : "option@value"}};
		
		var mamba = new Mamba(model, template, directive);
		var renderedDom = mamba.render();
		
		var parent = $('<div id="parent"></div>');
		parent.append(renderedDom);
		
		$(document.body).append(parent);
		
		var label = $(parent.children().get(0)).children().get(0);
		var select = $($(parent.children().get(0)).children().get(1));
		var option1 = select.children().get(0);
		OnAttend(label.textContent).DEtreEgalA('options');
		OnAttend(select.children().length).DEtreEgalA(1);
		OnAttend(option1.textContent).DEtreEgalA('option 1');
		OnAttend(option1.value).DEtreEgalA('1');
		
		model.label = 'choices';
		model.options.push({"lib" : "option 2", "value" : 2});
		
		mamba.updateRootOrNot(model);
		
		label = $(parent.children().get(0)).children().get(0);
		select = $($(parent.children().get(0)).children().get(1));
		option1 = select.children().get(0);
		option2 = select.children().get(1);
		OnAttend(label.textContent).DEtreEgalA('choices');
		OnAttend(select.children().length).DEtreEgalA(2);
		OnAttend(option1.textContent).DEtreEgalA('option 1');
		OnAttend(option1.value).DEtreEgalA('1');
		OnAttend(option2.textContent).DEtreEgalA('option 2');
		OnAttend(option2.value).DEtreEgalA('2');
		
		parent.remove();
	});

/*	Ca('teste mamba.updateWithRoot() met à jour les subMambas, avec subMamba null au render', function(){
		var model = {"label" : "no options"}
			
		var template = '<div>'
					  +'<span></span>'
					  +'<select><option/></select>'      
					  +'</div>';
		
		var directive =  {"r00t" : "div",
				 		  "label" : "span",
				 		  "options" : {"lib" : "option",
				 			  		   "value" : "option@value"}};
		
		var mamba = new Mamba(model, template, directive);
		var renderedDom = mamba.render();
		
		var parent = $('<div id="parent"></div>');
		parent.append(renderedDom);
		
		$(document.body).append(parent);
		
		var label = $(parent.children().get(0)).children().get(0);
		var select = $($(parent.children().get(0)).children().get(1));

		OnAttend(label.textContent).DEtreEgalA('no options');
		OnAttend(select.children().length).DEtreEgalA(0);
		
		model = {"label" : "options",
			 	 "options" : [{"lib" : "option 1", "value" : 1}]};
		
		mamba.updateRootOrNot(model);
		
		label = $(parent.children().get(0)).children().get(0);
		select = $($(parent.children().get(0)).children().get(1));
		var option1 = select.children().get(0);
		OnAttend(label.textContent).DEtreEgalA('options');
		OnAttend(select.children().length).DEtreEgalA(1);
		OnAttend(option1.textContent).DEtreEgalA('option 1');
		OnAttend(option1.value).DEtreEgalA('1');
		
		parent.remove();
	});*/
	
	var checkNode = function(node, instanceType, parent, nbChildren){
		checkType(instanceType, 'function');
		checkType(parent, MbaNode);
		checkType(nbChildren, 'number');
		
		OnAttend(node instanceof instanceType).DEtreVrai();
		OnAttend(node.getParent()).DEtreEgalA(parent);
		OnAttend(node.getChildren().length).DEtreEgalA(nbChildren);
	}; 
	
	Ca('teste la création d\'un MbaTemplate, template contenant un élément racine, directive sans r00t, sans subDirective', 
	   function(){
		var spanLabelHtml = '<span id="label"></span>';//TODO doit marcher avec '<span id="label">name</span>'; une fois les textNode correctement gérés
	   	var spanNameHtml = '<span id="name"></span>';
	   	var spanAgeHtml = '<span id="age"></span>';
	   	var template = '<div>'
	   						+spanLabelHtml
	   						+spanNameHtml
	   						+spanAgeHtml
	   				  +'</div>';
		var directive = {"name" : "#name", "age" : "#age"};
		var mbaTemplate = new MbaTemplate(template, directive);
		
		OnAttend(mbaTemplate.getChildren().length).DEtreEgalA(1);
		
		var mambaNode = mbaTemplate.getChild(0);
		checkNode(mambaNode, MbaNodeMamba, mbaTemplate, 1);
		var divNode = mambaNode.getChild(0);
		checkNode(divNode, MbaNodeHtmlElement, mambaNode, 3);
		var spanLabelNode = divNode.getChild(0);
		checkNode(spanLabelNode, MbaNodeHtmlElement, divNode, 0);
		var spanNameNode = divNode.getChild(1);
		checkNode(spanNameNode, MbaNodeBinding, divNode, 0);
		var spanAgeNode = divNode.getChild(2);
		checkNode(spanAgeNode, MbaNodeBinding, divNode, 0);
	});
	
	Ca('teste la construction d\'un MbaTemplate, template contenant plusieurs éléments racine, directive sans r00t,'
	   +' sans subDirective', 
	   function(){
		   	var spanLabelHtml = '<span id="label"></span>';//TODO doit marcher avec '<span id="label">name</span>'; une fois les textNode correctement gérés
		   	var spanNameHtml = '<span id="name"></span>';
		   	var spanAgeHtml = '<span id="age"></span>';
		   	var divRoot1Html = '<div id="root1">'
		   							+spanLabelHtml
		   							+spanNameHtml
		   							+spanAgeHtml
		   					  +'</div>';
		   	var divRoot2Html = '<div id="root2"></div>';
		   	
			var template = divRoot1Html + divRoot2Html;
			var directive = {"name" : "#name", "age" : "#age"};
			var mbaTemplate = new MbaTemplate(template, directive);

			OnAttend(mbaTemplate.getChildren().length).DEtreEgalA(1);

			var mambaNode = mbaTemplate.getChild(0);
			checkNode(mambaNode, MbaNodeMamba, mbaTemplate, 2);
			var divRoot1Node = mambaNode.getChild(0);
			checkNode(divRoot1Node, MbaNodeHtmlElement, mambaNode, 3);
			var divRoot2Node = mambaNode.getChild(1);
			checkNode(divRoot2Node, MbaNodeHtmlElement, mambaNode, 0);
			var spanLabelNode = divRoot1Node.getChild(0);
			checkNode(spanLabelNode, MbaNodeHtmlElement, divRoot1Node, 0);
			var spanNameNode = divRoot1Node.getChild(1);
			checkNode(spanNameNode, MbaNodeBinding, divRoot1Node, 0);
			var spanAgeNode = divRoot1Node.getChild(2);
			checkNode(spanAgeNode, MbaNodeBinding, divRoot1Node, 0);
	});
	
	/*
	var directive2 = {"r00t"    : "#la_selection",
	 		          "options" :
	 		  				{"value"   : "#les_options@value",
	 		        	  	 "text"    : "#les_options",
	 		        	  	 "selected": "#les_options?+@selected"}};
	
	var directive3 = {"options" :
	 		  		  		{"r00t"    : "#les_options",
	 		  			  	 "value"   : "#les_options@value",
	 		  			  	 "text"    : "#les_options",
	 		  			  	 "selected": "#les_options?+@selected"}};
	
	var directive4 = {"options" :
	 		  		  		{"value"   : "#les_options@value",
	 		  			  	 "text"    : "#les_options",
	 		  			  	 "selected": "#les_options?+@selected"}};
	 		  			  	 */
	function checkForSelectOptionsCases(directive){
		var optionHtml = '<option id="les_options"></option>';
		var selectHtml = '<select id="la_selection">'+optionHtml+'</select>';
		var template = selectHtml;			
		
		var mbaTemplate = new MbaTemplate(template, directive);
		OnAttend(mbaTemplate.getChildren().length).DEtreEgalA(1);
		
		var selectMambaNode = mbaTemplate.getChild(0);
		checkNode(selectMambaNode, MbaNodeMamba, mbaTemplate, 1);
		var selectNode = selectMambaNode.getChild(0);
		checkNode(selectNode, MbaNodeHtmlElement, selectMambaNode, 1);
		var optionMambaNode = selectNode.getChild(0);
		checkNode(optionMambaNode, MbaNodeMamba, selectNode, 1);
		var optionBindingNode = optionMambaNode.getChild(0);
		checkNode(optionBindingNode, MbaNodeBinding, optionMambaNode, 0);			
	}
	
	Ca(	'teste la construction d\'un MbaTemplate, mamba racine et subMamba avec r00t.',
		function() {	
			var directive = {"r00t"    : "#la_selection",
					 		 "options" :
					 		  		{"r00t"    : "#les_options",
					 			  	 "value"   : "#les_options@value",
					 			  	 "text"    : "#les_options"}};
			checkForSelectOptionsCases(directive);
	});
	
	Ca(	'teste la construction d\'un MbaTemplate, mamba racine avec r00t et subMamba sans r00t.',
		function() {	
			var directive = {"r00t"    : "#la_selection",
					 		 "options" :
					 		  		{"value"   : "#les_options@value",
					 			  	 "text"    : "#les_options"}};
			checkForSelectOptionsCases(directive);
	});
	
	Ca(	'teste la construction d\'un MbaTemplate, mamba racine sans r00t et subMamba avec r00t.',
		function() {	
			var directive = {"options" :
					 		  		{"r00t"	   : "#les_options",
									 "value"   : "#les_options@value",
					 			  	 "text"    : "#les_options"}};
			checkForSelectOptionsCases(directive);
	});
	
	Ca(	'teste la construction d\'un MbaTemplate, mamba racine et subMamba sans r00t.',
		function() {	
			var directive = {"options" :
					 		  		{"value"   : "#les_options@value",
					 			  	 "text"    : "#les_options"}};
			checkForSelectOptionsCases(directive);
	});
	
	Ca('teste qu\'une directive peut contenir un tableau de directives', function(){
		var template = '<span class="label"></span><span class="value"></span>';
		var model = {"options" : 
						[{"label" : "toto", "value" : "01"}, 
						 {"label" : "titi", "value" : "02"}, 
						 {"label" : "tutu", "value" : "03"}]};
		var directive = {"options" : 
							[{"label" : ".label"}, 
							 {"value" : ".value"}]};
		
		var mamba = new Mamba(model, template, directive);
		var dom = mamba.render();
		
		OnAttend(dom[0].textContent).DEtreEgalA('toto');
		OnAttend(dom[1].textContent).DEtreEgalA('titi');
		OnAttend(dom[2].textContent).DEtreEgalA('tutu');
		OnAttend(dom[3].textContent).DEtreEgalA('01');
		OnAttend(dom[4].textContent).DEtreEgalA('02');
		OnAttend(dom[5].textContent).DEtreEgalA('03');
	});
		
	Ca('teste l\'ajout d\'un élément à l\'index 0 dans un MbaDom vide lève une exception', function(){
		var root = new MbaDom();
		var domToAppend = new MbaDom('<span>toto</span>')
		
		try{
			root.insertChildAtIndex(domToAppend, 0);
		}
		catch(e){
			return;
		}
		OnAttend(false).DEtreVrai()
	});
	
	Ca('teste l\'ajout d\'un élément à l\'index 0 dans un MbaDom sans enfant', function(){
		var root = new MbaDom('<div id="root"></div>');
		var domToAppend =  new MbaDom('<span>toto</span>')
		
		root.insertChildAtIndex(domToAppend, 0);
		OnAttend(root.toString()).DEtreEgalA('<div id="root"><span>toto</span></div>');
	});
	
	Ca('teste l\'ajout d\'un élément à l\'index 0 dans un MbaDom avec enfant', function(){
		var root = new MbaDom('<div id="root">titi</div>');
		var domToAppend =  new MbaDom('<span>toto</span>')
		
		root.insertChildAtIndex(domToAppend, 0);
		OnAttend(root.toString()).DEtreEgalA('<div id="root"><span>toto</span>titi</div>');
	});
	
	Ca('teste l\'ajout de plusieurs éléments à l\'index 0 dans un MbaDom sans enfant', function(){
		var root = new MbaDom('<div id="root"></div>');
		var domToAppend =  new MbaDom('<span>toto</span><span>titi</span>')
		
		root.insertChildAtIndex(domToAppend, 0);
		OnAttend(root.toString()).DEtreEgalA('<div id="root"><span>toto</span><span>titi</span></div>');
	});
	
	Ca('teste l\'ajout de plusieurs éléments à l\'index 1 dans un MbaDom avec enfant', function(){
		var root = new MbaDom('<div id="root">tutu</div>');
		var domToAppend =  new MbaDom('<span>toto</span><span>titi</span>')
		
		root.insertChildAtIndex(domToAppend, 1);
		OnAttend(root.toString()).DEtreEgalA('<div id="root">tutu<span>toto</span><span>titi</span></div>');
	});
	
	Ca('teste que l\'ajout sur un MbaDom représentant plusieurs éléments lève une exception', function(){
		var root = new MbaDom('<div id="root"></div><div id="rootBis"></div>');
		var domToAppend =  new MbaDom('<span>toto</span>')
		
		try{
			root.insertChildAtIndex(domToAppend, 0);
		}catch(e){
			return;
		}
		OnAttend(false).DEtreVrai();
	});
	
	Ca('teste l\'ajout d\'un élément dans un MbaNodeHtmlElement vide', function(){
		var root = new MbaDom('<div id="root"></div>');
		var rootNode = new MbaNodeHtmlElement(null, root);
		
		var domToAppend =  new MbaDom('<span>toto</span>')
		var childNode = new MbaNode(rootNode, new MbaDom());
		
		childNode.appendDomIntoParent(domToAppend);
		
		OnAttend(rootNode.getRenderedDom().toString()).DEtreEgalA('<div id="root"><span>toto</span></div>');
	});
	
	Ca('teste l\'ajout d\'un élément dans un MbaNodeHtmlElement non vide', function(){
		var root = new MbaDom('<div id="root"></div>');
		var rootNode = new MbaNodeHtmlElement(null, root);
		
		var domToAppend1 = new MbaDom('<span>toto</span>')
		var domToAppend2 = new MbaDom('<span>titi</span>');
		var childNode = new MbaNode(rootNode, new MbaDom());
		
		childNode.appendDomIntoParent(domToAppend1);
		childNode.appendDomIntoParent(domToAppend2);
		
		OnAttend(rootNode.getRenderedDom().toString()).DEtreEgalA('<div id="root"><span>toto</span><span>titi</span></div>');
	});
	
	Ca('teste l\'ajout d\'un élément dans un MbaNodeHtmlElement contenant plusieurs MbaNode', function(){
		var root = new MbaDom('<div id="root"></div>');
		var rootNode = new MbaNodeHtmlElement(null, root);
		
		var domToAppend1 = new MbaDom('<span>toto</span>')
		var domToAppend2 = new MbaDom('<span>titi</span>');
		var childNode1 = new MbaNode(rootNode, new MbaDom());
		
		childNode1.appendDomIntoParent(domToAppend1);
		childNode1.appendDomIntoParent(domToAppend2);
		
		var domToAppend3 = new MbaDom('<span>tutu</span>')
		var childNode2 = new MbaNode(rootNode, new MbaDom());
		
		childNode2.appendDomIntoParent(domToAppend3);
		
		OnAttend(rootNode.getRenderedDom().toString()).DEtreEgalA('<div id="root"><span>toto</span><span>titi</span><span>tutu</span></div>');
	});

	Ca('teste la suppression des éléments enfants entre deux index dans un MbaDom', function(){
		var root = new MbaDom('<div id="root"></div>');
				
		root.appendChild(new MbaDom('<span>toto</span>'));
		root.appendChild(new MbaDom('<span>titi</span>'));
		root.appendChild(new MbaDom('<span>tata</span>'));
		root.appendChild(new MbaDom('<span>tutu</span>'));
		
		var removedDom = root.removeChildrenBetween(1, 2);
		
		OnAttend(root.toString()).DEtreEgalA('<div id="root"><span>toto</span><span>tutu</span></div>');
		OnAttend(removedDom.toString()).DEtreEgalA('<span>titi</span><span>tata</span>');
	});
	
	Ca('teste la suppression des éléments après l\'index dans un MbaNodeHtmlElement non vide', function(){
		var root = new MbaDom('<div id="root"></div>');
		var rootNode = new MbaNodeHtmlElement(null, root);
		var childHtml = '<span>toto</span><span>titi</span><span>tutu</span>';
		var childNode = new MbaNode(rootNode, new MbaDom(childHtml));
		
		OnAttend(rootNode.getRenderedDom().toString()).DEtreEgalA('<div id="root">'+childHtml+'</div>');
		
		childNode.removeDomIntoParentFromIndex(1);		
		OnAttend(rootNode.getRenderedDom().toString()).DEtreEgalA('<div id="root"><span>toto</span></div>');
		OnAttend(childNode.getRenderedDom().toString()).DEtreEgalA('<span>toto</span>');
	});
		
	Ca('teste la suppression des éléments après l\'index dans un MbaNodeHtmlElement contenant plusieurs MbaNode', function(){
		var rootHtml = '<div id="root"></div>';
		var beforeHtml = '<span>before</span>';
		var afterHtml = '<span>toto</span><span>titi</span><span>tutu</span>';
		var root = new MbaDom(rootHtml);
		var rootNode = new MbaNodeHtmlElement(null, root);
		var childNode1 = new MbaNode(rootNode, new MbaDom(beforeHtml));		
		var childNode2 = new MbaNode(rootNode, new MbaDom(afterHtml));
		OnAttend(rootNode.getRenderedDom().toString()).DEtreEgalA('<div id="root">'+beforeHtml+afterHtml+'</div>');
		
		childNode2.removeDomIntoParentFromIndex(1);
		OnAttend(rootNode.getRenderedDom().toString()).DEtreEgalA('<div id="root"><span>before</span><span>toto</span></div>');
		OnAttend(childNode1.getRenderedDom().toString()).DEtreEgalA('<span>before</span>');
		OnAttend(childNode2.getRenderedDom().toString()).DEtreEgalA('<span>toto</span>');
	});
	//TODO : à faire fonctionner quand les sous-directives tableau seront supportées
	//ici on a le cas particulier où on la directive est elle-mêmes un tableau
	/*Ca('teste qu\'une directive peut contenir un tableau de directives', function(){
		var template = '<span class="label"></span><span class="value"></span>';
		var model = [{"label" : "toto", "value" : "01"}, {"label" : "titi", "value" : "02"}, {"label" : "tutu", "value" : "03"}];
		var directive = [{"label" : ".label"}, {"value" : ".value"}];
		
		var mamba = new MambaTemplate(template, directive);
		var dom = mamba.render();
		
		OnAttend(dom[0].textContent).DEtreEgalA('toto');
		OnAttend(dom[1].textContent).DEtreEgalA('titi');
		OnAttend(dom[2].textContent).DEtreEgalA('tutu');
		OnAttend(dom[3].textContent).DEtreEgalA('01');
		OnAttend(dom[4].textContent).DEtreEgalA('02');
		OnAttend(dom[5].textContent).DEtreEgalA('03');
		
		console.log(dom);
	});*/
	
	Ca('teste qu\'à la création d\'un MbaNode, renderedDom = baseDom', function(){
		var dom = new MbaDom('<div id="toto"></div>');
		var node = new MbaNode(null, dom);
		
		OnAttend(node.getBaseDom().toString()).DEtreEgalA(dom.toString());
		OnAttend(node.getBaseDom().toString()).DEtreEgalA(node.getRenderedDom().toString());
	});
	
	Ca('teste qu\'à la création d\'un MbaNodeHtmlElement, renderedDom = baseDom', function(){
		var dom = new MbaDom('<div id="toto"></div>');
		var node = new MbaNodeHtmlElement(null, dom);
		
		OnAttend(node.getBaseDom().toString()).DEtreEgalA(dom.toString());
		OnAttend(node.getBaseDom().toString()).DEtreEgalA(node.getRenderedDom().toString());
	});
	
	Ca('teste qu\'à la création d\'un MbaNodeBinding, renderedDom = baseDom', function(){
		var dom = new MbaDom('<div id="toto"></div>');
		var node = new MbaNodeBinding(null, dom, new MbaBinding(''));
		
		OnAttend(node.getBaseDom().toString()).DEtreEgalA(dom.toString());
		OnAttend(node.getBaseDom().toString()).DEtreEgalA(node.getRenderedDom().toString());
	});
	
	Ca('teste qu\'à la création d\'un MbaNodeMamba sans enfants, renderedDom est vide, baseDom est égal '
	   +'au r00t de la directive dans le template', function(){
		var template = '<div id="root"></div>';
		var dom = new MbaDom('<span>'+template+'</span>');
		var node = new MbaNodeMamba(null, dom, new Mamba(null, template, {r00t: "#root"}));
		
		OnAttend(node.getBaseDom().toString()).DEtreEgalA(template.toString());
		OnAttend(node.getRenderedDom().toString()).DEtreEgalA('');
	});
	
	Ca('teste qu\'à la création d\'un MbaNodeMamba avec enfants, renderedDom est égal '
	   +'à la concaténation des renderedDom des enfants', function(){
		var template = '<div id="root"></div>';
		var dom = new MbaDom(template);
		var mamba = new Mamba(null, template, {r00t: "#root"});
		var node = new MbaNodeMamba(new MbaNode(null, new MbaDom('<div></div>')), dom, mamba);

		var child1 = new MbaNode(node, new MbaDom('<span>toto</span>'));
		var child2 = new MbaNode(node, new MbaDom('<span>titi</span>'));
		
		OnAttend(node.getRenderedDom().toString()).DEtreEgalA('<span>toto</span><span>titi</span>');
	});
	
	Ca('teste qu\'à la création d\'un MbaNode ce dernier est ajouté aux enfants du parent',
	   function(){
		var template = '<div id="root"></div>';
		var dom = new MbaDom(template);
		var root = new MbaNodeHtmlElement(null, dom);

		var child = new MbaNode(root, new MbaDom());
		
		OnAttend(child.getParent()).DEtre(root);
		OnAttend(root.getChildren()[0]).DEtre(child);
	});
	
	Ca('teste qu\'à la création d\'un MbaNode les éléments du baseDom sont ajoutés au parent si ils n\'ont pas de parent',
	   function(){
		var template = '<div id="root"></div>';
		var dom = new MbaDom(template);
		var root = new MbaNodeHtmlElement(null, dom);

		var child = new MbaNode(root, new MbaDom('<span>toto</span><span>toto</span>'));
		
		OnAttend(root.getRenderedDom().toString()).DEtreEgalA('<div id="root"><span>toto</span><span>toto</span></div>');
	});
	
	Ca('teste qu\'à la création d\'un MbaTemplate renderedDom est égal à la concaténation des renderedDom des enfants',
	   function(){
		var directive = {r00t: "#root"};
		var template = '<div id="root"><span>toto</span><span>titi</span></div>';
		var mbaTemplate = new MbaTemplate(template, directive);
		
		OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(template);
	});
	
	Ca('teste la suppression de tous les éléments d\'un MbaNode non vide', function(){
		var root = new MbaDom('<div id="root"></div>');
		var rootNode = new MbaNode(null, root);
		var childHtml = '<span>toto</span><span>titi</span><span>tutu</span>';
		var childNode = new MbaNode(rootNode, new MbaDom(childHtml));
		
		OnAttend(rootNode.getRenderedDom().toString()).DEtreEgalA('<div id="root">'+childHtml+'</div>');
		
		childNode.removeDomIntoParent();		
		OnAttend(rootNode.getRenderedDom().toString()).DEtreEgalA('<div id="root"></div>');
	});
	
	Ca('teste qu\'a la création d\'un MbaNodeMamba l\'ajout des éléments de dom est délégué au parent', function(){
		var template = '<div id="root"></div>';
		var root = new MbaDom(template);
		var rootNode = new MbaNode(null, root);
		var subRootHtml = '<div>subRoot</div>';
		var subRootNode = new MbaNode(rootNode, new MbaDom(subRootHtml));
		var mambaNode = new MbaNodeMamba(rootNode, root, new Mamba(null, template, {r00t : "#root"}));
		var child1Html = '<span>toto</span><span>titi</span>';
		var child1Node = new MbaNode(mambaNode, new MbaDom(child1Html));
		var child2Html = '<span>tutu</span>';
		var child2Node = new MbaNode(mambaNode, new MbaDom(child2Html));
		
		OnAttend(rootNode.getRenderedDom().toString()).DEtreEgalA('<div id="root">'+subRootHtml+child1Html+child2Html+'</div>');
	});
	
	Ca('teste que la suppression d\'élements dans un MbaNodeMamba est déléguée au parent', function(){
		var template = '<div id="root"></div>';
		var root = new MbaDom(template);
		var rootNode = new MbaNode(null, root);
		var subRootHtml = '<div>subRoot</div>';
		var subRootNode = new MbaNode(rootNode, new MbaDom(subRootHtml));
		var mambaNode = new MbaNodeMamba(rootNode, root, new Mamba(null, template, {r00t : "#root"}));
		var child1Html = '<span>toto</span><span>titi</span>';
		var child1Node = new MbaNode(mambaNode, new MbaDom(child1Html));
		var child2Html = '<span>tutu</span>';
		var child2Node = new MbaNode(mambaNode, new MbaDom(child2Html));
		
		OnAttend(rootNode.getRenderedDom().toString()).DEtreEgalA('<div id="root">'+subRootHtml+child1Html+child2Html+'</div>');
		
		child1Node.removeDomIntoParentFromIndex(1);		
		OnAttend(rootNode.getRenderedDom().toString()).DEtreEgalA('<div id="root">'+subRootHtml+'<span>toto</span>'+child2Html+'</div>');
	});
	
	Ca('teste l\'ajout dans un MbaNode avec un MbaTemplate parent', function(){
		var template = '<span>toto</span><span>titi</span>';
		var mbaTemplate = new MbaTemplate(template, null);
		
		OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(template);
		var totoChild = mbaTemplate.getChild(0);
		
		totoChild.appendDomIntoParent(new MbaDom('<div>tutu</div>'));
		OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA('<span>toto</span><div>tutu</div><span>titi</span>');		
	});
	
	Ca('teste l\'ajout dans un MbaNodeMmaba avec un MbaTemplate parent', function(){
		var template = '<span>toto</span><div id="root1" class="root"></div><span>titi</span>';
		var mbaTemplate = new MbaTemplate(template, {'r00t': '.root'});
		
		var root1Child = mbaTemplate.getChild(1).getChild(0);
		root1Child.appendDomIntoParent(new MbaDom('<div id="root2" class="root">'));
		
		OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA('<span>toto</span><div id="root1" class="root"></div><div id="root2" class="root"></div><span>titi</span>');
	});
	
	Ca('teste la suppression d\'éléments entre deux index dans un MbaDom', function(){
		var mbaDom = new MbaDom('<div id="1"></div><div id="2"></div><div id="3"></div><div id="4"></div>');
		var removedDom = mbaDom.removeRangeInclude(1,2);
		
		OnAttend(mbaDom.toString()).DEtreEgalA('<div id="1"></div><div id="4"></div>');
		OnAttend(removedDom.toString()).DEtreEgalA('<div id="2"></div><div id="3"></div>');
	});
	
	Ca('teste que MbaDom.removeRangeInclude lève une exception si les indexs sont hors limite', function(){
		var mbaDom = new MbaDom('<div id="1"></div><div id="2"></div><div id="3"></div><div id="4"></div>');
		try{
			mbaDom.removeRangeInclude(1,4);
		}catch(e){
			OnAttend(e.code).DEtreEgalA(2);
			return;
		}
		OnAttend(true).DEtreFaux();
	});
	
	Ca('teste la suppression dans un MbaNode avec un MbaTemplate parent', function(){
		var template = '<span>toto</span><span>titi</span>';
		var mbaTemplate = new MbaTemplate(template, null);
		var totoChild = mbaTemplate.getChild(0);		
		totoChild.appendDomIntoParent(new MbaDom('<div>tutu</div>'));
		OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA('<span>toto</span><div>tutu</div><span>titi</span>');
		
		totoChild.removeDomIntoParentFromIndex(0);
		OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA('<span>titi</span>');
	});
	
	Ca('teste la suppression dans un MbaNodeMamba avec un MbaTemplate parent', function(){
		var template = '<span>toto</span><div id="root1" class="root"></div><div id="root2" class="root"></div><span>titi</span>';
		var mbaTemplate = new MbaTemplate(template, {'r00t': '.root'});
		
		var root1Child = mbaTemplate.getChild(1).getChild(0);
		root1Child.removeDomIntoParentFromIndex(0);
		
		OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA('<span>toto</span><div id="root2" class="root"></div><span>titi</span>');
	});

	
	Ca('teste le render pour un MbaNodeHtmlElement avec un modèle null',
	   function(){
		var model = null;
		var directive = {r00t: "#root"};
		var template = '<div id="root"></div>';
		var mbaTemplate = new MbaTemplate(template, directive);
		
		OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(template);
		mbaTemplate.render(model);
		
		OnAttend(mbaTemplate.getRenderedDom().isEmpty()).DEtreVrai();
	});
	
	Ca('teste le render pour un MbaNodeBinding avec un modèle null',
	   function(){
		var model = null;
		var directive = {r00t: "#root", "text" : "#root"};
		var template = '<div id="root"></div>';
		var mbaTemplate = new MbaTemplate(template, directive);
		
		OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(template);
		mbaTemplate.render(model);
		
		OnAttend(mbaTemplate.getRenderedDom().isEmpty()).DEtreVrai();
	});
	
	function createMinimalMbaTemplateWithSimpleModel(){
		var model = {text: "toto"};
		var directive = {r00t: "#root", "text" : "#root"};
		var template = '<div id="root"></div>';
		var mbaTemplate = new MbaTemplate(template, directive);
		mbaTemplate.render(null);
		mbaTemplate.render(model);
		return mbaTemplate;
	}
	
	Ca('teste le render pour un MbaTemplate minimal avec un modèle simple',
	   function(){
		var mbaTemplate = createMinimalMbaTemplateWithSimpleModel();
		
		OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA('<div id="root">toto</div>');
		var root = mbaTemplate.getRenderedDom().getDom(0);
		OnAttend(root.id).DEtreEgalA('root');
		OnAttend(root.textContent).DEtreEgalA('toto');
	});
	
	Ca('teste le render pour un MbaTemplate minimal avec un modèle simple quand le modèle change',
	   function(){
		var mbaTemplate = createMinimalMbaTemplateWithSimpleModel();		
		
		OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA('<div id="root">toto</div>');
		var root = mbaTemplate.getRenderedDom().getDom(0);
		OnAttend(root.id).DEtreEgalA('root');
		OnAttend(root.textContent).DEtreEgalA('toto');
		
		mbaTemplate.render({text: "titi"});
		
		OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA('<div id="root">titi</div>');
		OnAttend(root.id).DEtreEgalA('root');
		OnAttend(root.textContent).DEtreEgalA('titi');
	});
	
	Ca('teste que deux renders successifs pour un MbaTemplate minimal avec un modèle simple conservent l\'élément de dom.',
	   function(){
		var mbaTemplate = createMinimalMbaTemplateWithSimpleModel();
		
		var toto1 = mbaTemplate.getRenderedDom().getDom(0);
		mbaTemplate.render();
		var toto2 = mbaTemplate.getRenderedDom().getDom(0);		
		OnAttend(toto2).DEtre(toto1);
	})
	
	function createMinimalMbaTemplateWithArrayModel(){
		var model = [{text: "toto"}, {text: "titi"}];
		var directive = {r00t: "#root", "text" : "#root"};
		var template = '<div id="root"></div>';
		var mbaTemplate = new MbaTemplate(template, directive);
		mbaTemplate.render(null);
		mbaTemplate.render(model);
		return mbaTemplate;
	}
	
	Ca('teste le render pour un MbaTemplate minimal avec un modèle tableau',
	   function(){
		var mbaTemplate = createMinimalMbaTemplateWithArrayModel();
		
		OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA('<div id="root">toto</div><div id="root">titi</div>');
		var renderedDom = mbaTemplate.getRenderedDom();
		var toto = getDomElementWithPath(renderedDom, 0);
		OnAttend(toto.id).DEtreEgalA('root');
		OnAttend(toto.textContent).DEtreEgalA('toto');
		var titi = getDomElementWithPath(renderedDom, 1);
		OnAttend(titi.id).DEtreEgalA('root');
		OnAttend(titi.textContent).DEtreEgalA('titi');
	});
	
	Ca('teste le render pour un MbaTemplate minimal avec un modèle tableau quand le modèle change',
	   function(){
		var mbaTemplate = createMinimalMbaTemplateWithArrayModel();
		
		OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA('<div id="root">toto</div><div id="root">titi</div>');
		mbaTemplate.render([{text: "tata"}, {text: "tutu"}]);
		OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA('<div id="root">tata</div><div id="root">tutu</div>');
	});
	
	Ca('teste le render pour un MbaTemplate minimal avec un modèle tableau quand on supprime des éléments du modèle',
	   function(){
		var mbaTemplate = createMinimalMbaTemplateWithArrayModel();
		
		OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA('<div id="root">toto</div><div id="root">titi</div>');
		mbaTemplate.render([{text: "tata"}]);
		OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA('<div id="root">tata</div>');
	});
	
	Ca('teste que deux renders successifs pour un MbaTemplate minimal avec un tableau conservent les éléments de dom.',
	   function(){
		var mbaTemplate = createMinimalMbaTemplateWithArrayModel();
		var renderedDom = mbaTemplate.getRenderedDom();
		
		var toto1 = getDomElementWithPath(renderedDom, 0);
		var titi1 = getDomElementWithPath(renderedDom, 1);
		model= [{text: "tutu"}, {text: "tata"}];
		mbaTemplate.render(model);
		var toto2 = getDomElementWithPath(renderedDom, 0);
		var titi2 = getDomElementWithPath(renderedDom, 1);
		
		OnAttend(toto1).DEtreEgalA(toto2);
		OnAttend(titi1).DEtreEgalA(titi2);
	});
	
	Ca('teste le render pour un MbaTemplate minimal avec un modèle tableau quand on ajoute des éléments du modèle',
	   function(){
		var mbaTemplate = createMinimalMbaTemplateWithArrayModel();
		
		OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA('<div id="root">toto</div><div id="root">titi</div>');
		mbaTemplate.render([{text: "tata"}, {text: "toto"}, {text: "titi"}]);
		OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA('<div id="root">tata</div><div id="root">toto</div><div id="root">titi</div>');
	});
	
	/*
	 Commenté le temps de gérer la cas particulier des modelValue tableau cf commentaire dans MbaTransf 'prévoir ce cas plus tard.'
	 function createMinimalMbaTemplateWithValueModelArray(){
		var model = {text: ["toto", "tata"]};
		var directive = {r00t: "#root", "text" : "#root"};
		var template = '<div id="root"></div>';
		var mbaTemplate = new MbaTemplate(template, directive);
		mbaTemplate.render(null);
		mbaTemplate.render(model);
		return mbaTemplate;
	}
	
	Ca('teste le render pour un MbaTemplate minimal avec un modèle simple et valeur tableau',
	   function(){
		var mbaTemplate = createMinimalMbaTemplateWithValueModelArray();
		
		OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA('<div id="root">toto</div><div id="root">tata</div>');
	});
	
	Ca('teste le render pour un MbaTemplate minimal avec un modèle simple quand le modèle change',
	   function(){
		var mbaTemplate = createMinimalMbaTemplateWithValueModelArray();		
		
		OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA('<div id="root">toto</div><div id="root">tata</div>');
		mbaTemplate.render({text: ["titi", "tutu"]});
		OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA('<div id="root">titi</div><div id="root">tutu</div>');
	});
	
	Ca('teste que deux renders successifs pour un MbaTemplate minimal avec un modèle simple conservent l\'élément de dom.',
	   function(){
		var mbaTemplate = createMinimalMbaTemplateWithSimpleModel();
		//TODO test à finir d'écrire
		var toto1 = mbaTemplate.getRenderedDom().getDom(0);
		mbaTemplate.render();
		var toto2 = mbaTemplate.getRenderedDom().getDom(0);		
		OnAttend(toto2).DEtre(toto1);
	});*/
	
	function createOneLevelTemplateSeveralModelProperties(){
		var model = {name: "toto", job: "student"};
		var directive = {r00t: "#root", name : "#the_name", job: "#the_job"};
		var template = '<div id="root"><div id="the_name"></div><div id="the_job"></div></div>';
		var mbaTemplate = new MbaTemplate(template, directive);
		mbaTemplate.render(null);
		mbaTemplate.render(model);
		return mbaTemplate;
	}
	
	Ca('teste que render attribut la bonne valeur du modèle au bon élément du template',
	   function(){
		var mbaTemplate = createOneLevelTemplateSeveralModelProperties();
		var renderedDom = mbaTemplate.getRenderedDom();
		OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA('<div id="root"><div id="the_name">toto</div><div id="the_job">student</div></div>');
		var theName = getDomElementWithPath(renderedDom, 0, 0);
		OnAttend(theName.id).DEtreEgalA('the_name');
		OnAttend(theName.textContent).DEtreEgalA('toto');
		var theJob = getDomElementWithPath(renderedDom, 0, 1)
		OnAttend(theJob.id).DEtreEgalA('the_job');
		OnAttend(theJob.textContent).DEtreEgalA('student');
	});

	function createOneLevelTemplateSeveralModelPropertiesMultiTarget(){
		var model = {name: "toto", job: "student"};
		var directive = {r00t: "#root", name : "#the_name", job: "#the_job@class, #job_span"};
		var template = '<div id="root"><div id="the_name"></div><div id="the_job"><span id="job_span">job</span></div></div>';
		var mbaTemplate = new MbaTemplate(template, directive);
		mbaTemplate.checkImTheParentOfMyChildren();
		mbaTemplate.render(null);
		mbaTemplate.render(model);
		return mbaTemplate;
	}
	
	Ca('teste que render attribut la bonne valeur du modèle aux bons éléments du template',
	   function(){
		var mbaTemplate = createOneLevelTemplateSeveralModelPropertiesMultiTarget();
		var renderedDom = mbaTemplate.getRenderedDom();
		
		OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA('<div id="root"><div id="the_name">toto</div><div class="student" id="the_job"><span id="job_span">student</span></div></div>');
		var theName = getDomElementWithPath(renderedDom, 0, 0);
		OnAttend(theName.id).DEtreEgalA('the_name');
		OnAttend(theName.textContent).DEtreEgalA('toto');
		var theJob = getDomElementWithPath(renderedDom, 0, 1)
		OnAttend(theJob.id).DEtreEgalA('the_job');
		OnAttend(theJob.textContent).DEtreEgalA('student');
	});

	function createSeveralLevelTemplateSeveralModelProperties(){
		var model = {name: "toto", job: "student", animal: {name: "tobby", age: 3}};
		var directive = {r00t: "#root", name : "#the_name", job: "#the_job@class, #the_job > span", animal: {name: "#animal_name", age: "#animal_age"}};
		var template = '<div id="root"><span><div id="the_name"></div></span><div id="the_job"><span>job</span></div><span><div id="animal_name"></div><div id="animal_age"></div></span></div>';
		var mbaTemplate = new MbaTemplate(template, directive);
		mbaTemplate.render(null);
		mbaTemplate.render(model);
		//mbaTemplate.debug();
		return mbaTemplate;
	}
	
 	Ca('teste que render attribut la bonne valeur du modèle au bon élément du template avec directives sur plusieurs niveaux',
	   function(){
		var mbaTemplate = createSeveralLevelTemplateSeveralModelProperties();
		var renderedDom = mbaTemplate.getRenderedDom();
		
		OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA('<div id="root"><span><div id="the_name">toto</div></span><div class="student" id="the_job"><span>student</span></div><span><div id="animal_name">tobby</div><div id="animal_age">3</div></span></div>');
		var theName = getDomElementWithPath(renderedDom, 0, 0, 0); 
		OnAttend(theName.id).DEtreEgalA('the_name');
		OnAttend(theName.textContent).DEtreEgalA('toto');
		var theJob = getDomElementWithPath(renderedDom, 0, 1)
		OnAttend(theJob.id).DEtreEgalA('the_job');
		OnAttend(theJob.attributes['class'].value).DEtreEgalA('student');
		OnAttend(theJob.innerHTML).DEtreEgalA('<span>student</span>');
		var animalName = getDomElementWithPath(renderedDom, 0, 2, 0);
		OnAttend(animalName.textContent).DEtreEgalA('tobby');
		var animalAge = getDomElementWithPath(renderedDom, 0, 2, 1);
		OnAttend(animalAge.textContent).DEtreEgalA('3');
	});
 	
 	Ca('lève une exception si le selecteur de la directive ne correspond à aucun élément du template', function(){
		var directive = {r00t: "#root", name : "#the_name > span"};
		var template = '<div id="root"><div>student name : <span id="the_name"></span></div></div>';
		try{
			var mbaTemplate = new MbaTemplate(template, directive);
		}catch(e){
			OnAttend(e.code).DEtreEgalA(0);
			return;
		}
		
		OnAttend(false).DEtreVrai();
 	});
 	
	Ca('teste un render avec un template minimal contenant un TextNode', function(){
		var model = {name: "toto"};
		var directive = {r00t: "#root", name : "#the_name"};
		var template = '<div id="root">student name : <span id="the_name"></span></div>';
		var mbaTemplate = new MbaTemplate(template, directive);
		//mbaTemplate.debug();
		mbaTemplate.render(null);
		mbaTemplate.render(model);
		OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA('<div id="root">student name : <span id="the_name">toto</span></div>');
	});
 	
 	Ca('teste un render avec un template contenant des TextNode', function(){
		var model = {name: "toto"};
		var directive = {r00t: "#root", name : "#the_name"};
		var template = '<div id="root"><div>student name : <span id="the_name"></span>--</div></div>';
		var mbaTemplate = new MbaTemplate(template, directive);
		//mbaTemplate.debug();
		mbaTemplate.render(null);
		mbaTemplate.render(model);
		OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA('<div id="root"><div>student name : <span id="the_name">toto</span>--</div></div>');
	});
 	
 	Ca('teste que MbaDom.addMbaId ajoute une propriété _mbaId aux éléments de dom ainsi qu\'aux textNode', function(){
 		var mbaDom = new MbaDom('<div id="root">toto<div id="tutu"></div></div><div id="root2"></div>');
 		mbaDom.addMbaId();
 		
 		var root = mbaDom.getDom(0);
 		var toto = root.childNodes.item(0);
 		var tutu = root.childNodes.item(1);
 		var root2 = mbaDom.getDom(1);
 		
 		OnAttend(root._mbaId).DEtreEgalA(0);
 		OnAttend(toto._mbaId).DEtreEgalA(1);
 		OnAttend(tutu._mbaId).DEtreEgalA(2);
 		OnAttend(root2._mbaId).DEtreEgalA(3);
 	})
 	
    function MbaTransfMock(){    
    }
    MbaTransfMock.prototype = new MbaTransf2();
    MbaTransfMock.prototype.constructor = MbaTransfMock();
    
 	Ca('teste que MbaBindingText.getAnchor() retourne le seul textNode de l\'ancre', function(){
 		var template = new MbaDom('<div id="toto">tutu</div>');
 		var binding = new MbaBindingText('#toto', new DefaultAnchorProvider(), new MbaTransfMock());
 		
 		var anchor = binding.getAnchor(template);
 		
 		OnAttend(anchor.getDom(0).textContent).DEtreEgalA('tutu');
 	});
 	
 	Ca('teste que MbaBindingText.getAnchor() créé et insère un textNode dans l\'ancre s\'il n\'y en a pas', function(){
 		var template = new MbaDom('<div id="toto"></div>');
 		var binding = new MbaBindingText('#toto', new DefaultAnchorProvider(), new MbaTransfMock());
 		
 		var anchor = binding.getAnchor(template);
 		var createdTextNode = template.find('#toto').getDom(0).childNodes[0];
 		
 		OnAttend(isATextNode(createdTextNode)).DEtreVrai();
 		OnAttend(anchor.getDom(0).textContent).DEtreEgalA('');
 	});
 	
 	Ca('teste que MbaBindingText.getAnchor() lève une exception si l\'ancre contient un enfant non textNode', function(){
 		var template = new MbaDom('<div id="toto"><div id="child"></div></div>');
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
        var accessor1 = new MbaAccessor2('tutu');
        var accessor2 = new MbaAccessor2('toto');
        var accessor3 = new MbaAccessor2('titi');
        var accessor4 = new MbaAccessor2('tata');
        
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
        var directive = new MbaRootDirective(minimalPrecursorWithRoot);
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
           var mbaDirective = new MbaRootDirective(minimalPrecursorWithRoot);
           OnAttend(mbaDirective.getRootSelector()).DEtreEgalA('#root');
           
           var bindings = mbaDirective.getBindings();
           OnAttend(bindings.length).DEtreEgalA(1);
           OnAttend(bindingsHaveOnlyOneTransformation(bindings)).DEtreVrai();
           OnAttend(bindings[0].getSelector()).DEtreEgalA('#toto');
	});
    
    Ca('teste les accesseurs de la MbaDirective minimale avec root', 
       function(){
           var mbaDirective = new MbaRootDirective(minimalPrecursorWithRoot);
           
           var directiveAccessorChain = mbaDirective.getAccessorChain();
           OnAttend(directiveAccessorChain.match([])).DEtreVrai();
           
           var bindingAccessorChain = mbaDirective.getBindings()[0].getTransformations()[0].getAccessorChain();
           OnAttend(bindingAccessorChain.match(['name'])).DEtreVrai();
	});
    
    var twoDirectivesPrecursorWithRoot = {r00t: '#root', name: '#toto', age: '#tutu'};
    
    Ca('teste la création d\'une MbaDirective avec deux directives avec root', 
       function(){
           var mbaDirective = new MbaRootDirective(twoDirectivesPrecursorWithRoot);
           OnAttend(mbaDirective.getRootSelector()).DEtreEgalA('#root');
           
           var bindings = mbaDirective.getBindings();
           OnAttend(bindings.length).DEtreEgalA(2);
           OnAttend(bindingsHaveOnlyOneTransformation(bindings)).DEtreVrai();
           OnAttend(bindings[0].getSelector()).DEtreEgalA('#toto');
           OnAttend(bindings[1].getSelector()).DEtreEgalA('#tutu');
	});
    
    Ca('teste les accesseurs de la MbaDirective avec deux directives avec root', 
       function(){
           var mbaDirective = new MbaRootDirective(twoDirectivesPrecursorWithRoot);
           
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
           var mbaDirective = new MbaRootDirective(twoSelectorsPrecursorWithRoot);
           OnAttend(mbaDirective.getRootSelector()).DEtreEgalA('#root');
           
           var bindings = mbaDirective.getBindings();
           OnAttend(bindings.length).DEtreEgalA(2);
           OnAttend(bindingsHaveOnlyOneTransformation(bindings)).DEtreVrai();
           OnAttend(bindings[0].getSelector()).DEtreEgalA('#toto');
           OnAttend(bindings[1].getSelector()).DEtreEgalA('#tutu');
	});
    
    Ca('teste les accesseurs de la MbaDirective avec deux selecteurs avec root', 
       function(){
           var mbaDirective = new MbaRootDirective(twoSelectorsPrecursorWithRoot);
           
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
           var mbaDirective = new MbaRootDirective(twoLevelsPrecursorWithRoot);
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
           var mbaDirective = new MbaRootDirective(twoLevelsPrecursorWithRoot);
       
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
           var mbaDirective = new MbaRootDirective(twoLevelsAndSubDirectivesPrecursorWithRoot);
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
           var mbaDirective = new MbaRootDirective(twoLevelsAndSubDirectivesPrecursorWithRoot);
           
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
        var directive = new MbaRootDirective(precursor);
        OnAttend(directive.hasRoot()).DEtreFaux();
    });
    
    Ca('teste la création d\'une MbaDirective minimale sans root', function(){
        var mbaDirective = new MbaRootDirective(minimalPrecursorNoRoot);
        OnAttend(mbaDirective.hasRoot()).DEtreFaux();
           
        var bindings = mbaDirective.getBindings();
        OnAttend(bindings.length).DEtreEgalA(1);
        OnAttend(bindingsHaveOnlyOneTransformation(bindings)).DEtreVrai();
        OnAttend(bindings[0].getSelector()).DEtreEgalA('#toto');
    });
    
    Ca('teste les accesseurs de la MbaDirective minimale sans root', function(){
        var mbaDirective = new MbaRootDirective(minimalPrecursorNoRoot);
        
        var directiveAccessorChain = mbaDirective.getAccessorChain();
        OnAttend(directiveAccessorChain.match([])).DEtreVrai();
           
        var bindingAccessorChain = mbaDirective.getBindings()[0].getTransformations()[0].getAccessorChain();
        OnAttend(bindingAccessorChain.match(['name'])).DEtreVrai();
    });
    
    var twoDirectivesPrecursorNoRoot = {name: '#toto', age: '#tutu'};
    
    Ca('teste la création d\'une MbaDirective avec deux directives sans root', function(){
        var mbaDirective = new MbaRootDirective(twoDirectivesPrecursorNoRoot);
        OnAttend(mbaDirective.hasRoot()).DEtreFaux();
           
        var bindings = mbaDirective.getBindings();
        OnAttend(bindings.length).DEtreEgalA(2);
        OnAttend(bindingsHaveOnlyOneTransformation(bindings)).DEtreVrai();
        OnAttend(bindings[0].getSelector()).DEtreEgalA('#toto');
        OnAttend(bindings[1].getSelector()).DEtreEgalA('#tutu');
    });
    
    Ca('teste les accesseurs de la MbaDirective avec deux directives sans root', function(){
        var mbaDirective = new MbaRootDirective(twoDirectivesPrecursorNoRoot);
       
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
           var mbaDirective = new MbaRootDirective(twoLevelsPrecursorParentNoRoot);
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
           var mbaDirective = new MbaRootDirective(twoLevelsPrecursorParentNoRoot);
           
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
           var mbaDirective = new MbaRootDirective(twoLevelsPrecursorChildNoRoot);
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
           var mbaDirective = new MbaRootDirective(twoLevelsPrecursorChildNoRoot);
           
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
           var mbaDirective = new MbaRootDirective(threeLevelsPrecursorChildNoRoot);
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
           var mbaDirective = new MbaRootDirective(threeLevelsPrecursorChildNoRoot);
           
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
        var mbaDirective = new MbaRootDirective(twoLevelsSubDirectivesPrecursorNoRoot);
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
        var mbaDirective = new MbaRootDirective(twoLevelsSubDirectivesPrecursorNoRoot);
           
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
        var mbaDirective = new MbaRootDirective(severalLevelsParentNoRootChildWithRoot);
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
           var mbaDirective = new MbaRootDirective(threeLevelsPrecursorParentsNoRootChildWithRoot);
           
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
           var mbaDirective = new MbaRootDirective(fourLevelsPrecursorParentsNoRootChildWithRoot);
          
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
        var directive = new MbaRootDirective(precursor);
        OnAttend(directive.hasRoot()).DEtreFaux();
        var bindings = directive.getBindings();
        OnAttend(bindings.length).DEtreEgalA(2);
        OnAttend(bindingsHaveOnlyOneTransformation(bindings)).DEtreVrai();
        OnAttend(bindings[0].getSelector()).DEtreEgalA('#toto');
        OnAttend(bindings[1].getSelector()).DEtreEgalA('#tutu');
    });
        
    var templateTwoLevels = '<div id="root"><div id="toto"></div><div id="sub"><div id="tutu"></div><div id="tata">title</div></div>';
    var directiveTwoLevelsWithRoot = {r00t: '#root', name: '#toto', location: {r00t:'#sub', type: '#tutu', title: '#tata'}};
    
    Ca('teste que le MbaTemplate2.addTextNodeForBindingText ajoute les textNodes nécessaires', function(){
        var template = templateTwoLevels;
        var directive = directiveTwoLevelsWithRoot;
        var mbaTemplate = new MbaTemplate2(template, directive);    
    
        var toto = mbaTemplate.findDom('#toto').getDom(0);
        var tutu = mbaTemplate.findDom('#tutu').getDom(0);
        var tata = mbaTemplate.findDom('#tata').getDom(0);
        
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
        var mbaTemplate = new MbaTemplate2(templateHtml, directivePrecursor); 
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
        var mbaTemplate = new MbaTemplate2(templateHtml, directivePrecursor); 
        var template = mbaTemplate.getTemplate();
        var rootDirective = mbaTemplate.getRootDirective();
        var templateDirective = new MbaTemplateDirective(template, rootDirective);
    
        OnAttend(templateDirective.getRootAnchor().equals(template)).DEtreVrai();
        OnAttend(templateDirective.getTemplateBindings().length).DEtreEgalA(0);
        OnAttend(templateDirective.getSubTemplateDirectives().length).DEtreEgalA(0);
    });
    
    Ca('teste la création d\'un MbaTemplateBinding', function(){
        var template = new MbaDom('<body><div id="toto"></div></body>');
        var binding = new MbaBinding2('#toto', new DefaultAnchorProvider(), new MbaTransfMock());
        var templateBinding = new MbaTemplateBinding(template, binding);
                
        var toto = template.find('#toto');
        OnAttend(templateBinding.getAnchor().equals(toto)).DEtreVrai();
    });
    
    Ca('teste la construction de l\'arborescence de MbaTemplateDirective et MbaTemplateBinding', function(){
        var html = '<div><div id="toto"></div><div id="tutu"></div></div>';
        //TODO : étudier cas particulier var html = '<html><body><div id="toto"></div><div id="tutu"></div></body></html>'; -> les balise body et html ne sont pas prises en compte...
        var directivePrecursor = {name: '#toto', sub: {r00t: '#tutu', job: '#tutu'}};
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
        mbaTemplate.addTextNodeForBindingText();
        
        var htmlRoot = mbaTemplate.getTemplate();
        var toto = mbaTemplate.findDom('#toto');
        var totoTextNode = toto.getChildren();
        var tutu = mbaTemplate.findDom('#tutu');
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
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
        mbaTemplate.addTextNodeForBindingText();
        mbaTemplate.constructTemplateDirective();
        
        var template = mbaTemplate.getTemplate();
        var toto = mbaTemplate.findDom('#toto');
        var totoTextNode = toto.getChildren();
        var tutu = mbaTemplate.findDom('#tutu');
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
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
        mbaTemplate.addTextNodeForBindingText();
        mbaTemplate.constructTemplateDirective();
        
        var template = mbaTemplate.getTemplate();
        var toto = mbaTemplate.findDom('#toto');
        var totoTextNode = toto.getChildren();
        var tutu = mbaTemplate.findDom('#tutu');
        var tutuTextNode = tutu.getChildren();
        var titi = mbaTemplate.findDom('#titi');
        var titiTextNode = titi.getChildren();
        var tata = mbaTemplate.findDom('#tata');
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
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
        mbaTemplate.addTextNodeForBindingText();
        mbaTemplate.constructTemplateDirective();
        
        var template = mbaTemplate.getTemplate();
        var toto = mbaTemplate.findDom('#toto');
        var totoTextNode = toto.getChildren();
        var tutu = mbaTemplate.findDom('#tutu');
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
        var mbaTemplate = new MbaTemplate2(html, {});
        
        var root = mbaTemplate.getTemplate();
        var toto = mbaTemplate.findDom('#toto');
        var tutu = mbaTemplate.findDom('#tutu');
        
        mbaTemplate.constructRootNode();
        
        var rootNode = mbaTemplate.getRootNode();    
        var test = {type: MbaRootNode,
                    dom: root,
                    children: [{type: MbaNodeHtmlElement2,
                                dom: root,
                                children: [{type: MbaNodeHtmlElement2, 
                                            dom: toto},
                                           {type: MbaNodeHtmlElement2,
                                            dom: tutu}]}]};
        
        OnAttend(rootNode.match(test)).DEtreVrai();
    });
    
    Ca('teste l\'intégration des MbaNodeBinding et MbaNodeDirective dans l\'arborescence de MbaNode', function(){
        var html = '<div id="root"><div id="toto"></div><div id="tutu"></div></div>';
        var directivePrecursor = {r00t: '#root', name: '#toto', age: '#tutu'};
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
        
        mbaTemplate.addTextNodeForBindingText();
        mbaTemplate.constructTemplateDirective();
        mbaTemplate.mergeTemplateDirectives();
        mbaTemplate.constructRootNode();        
        
        var template = mbaTemplate.getTemplate();
        var root = mbaTemplate.findDom('#root');
        var toto = mbaTemplate.findDom('#toto');
        var totoTextNode = toto.getChildren();
        var tutu = mbaTemplate.findDom('#tutu');
        var tutuTextNode = tutu.getChildren();
        
        var rootNode = mbaTemplate.getRootNode();    
        var testBefore =
            {type: MbaRootNode,
             dom: template,
             children: [{type: MbaNodeHtmlElement2,
                         dom: root,
                         children: [{type: MbaNodeHtmlElement2, 
                                     dom: toto,
                                     children: [{type: MbaNodeHtmlElement2, dom: totoTextNode}]},
                                    {type: MbaNodeHtmlElement2,
                                     dom: tutu,
                                     children: [{type: MbaNodeHtmlElement2, dom: tutuTextNode}]}]}]};
        OnAttend(rootNode.match(testBefore)).DEtreVrai();
        
        mbaTemplate.integrateMambaAndBindingNodes();
        
        var testAfter = 
            {type: MbaRootNode,
             dom: template,
             children: [{type: MbaNodeDirective,
                         dom: root,
                         children: [{type: MbaNodeHtmlElement2,
                                     dom: root,
                                     children: [{type: MbaNodeHtmlElement2, 
                                                 dom: toto,
                                                 children: [{type: MbaNodeBinding2, 
                                                             dom: totoTextNode}]},
                                                {type: MbaNodeHtmlElement2,
                                                 dom: tutu,
                                                 children: [{type: MbaNodeBinding2, 
                                                             dom: tutuTextNode}]}]}]}]};
        OnAttend(rootNode.match(testAfter)).DEtreVrai();
        
    });
    
    Ca('teste que les MbaNodeBinding et MbaNodeDirective sont inséré au bon endroit dans leur parent', function(){
        var html = '<div id="root"><div id="first"></div><div id="second"></div><div id="third"></div></div>';
        var directivePrecursor = {toto: '#first',
                                  tutus: {r00t: '#second', name: '#second'},
                                  titi: '#third'};
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
        
        mbaTemplate.addTextNodeForBindingText();
        mbaTemplate.constructTemplateDirective();
        mbaTemplate.mergeTemplateDirectives();
        mbaTemplate.constructRootNode();        
        
        var template = mbaTemplate.getTemplate();
        var root = mbaTemplate.findDom('#root');
        var first = mbaTemplate.findDom('#first');
        var firstTextNode = first.getChildren();
        var second = mbaTemplate.findDom('#second');
        var secondTextNode = second.getChildren();
        var third = mbaTemplate.findDom('#third');
        var thirdTextNode = third.getChildren();
        
        var rootNode = mbaTemplate.getRootNode();    
        //rootNode.debug();
        var testBefore =
            {type: MbaRootNode,
             dom: template,
             children: [{type: MbaNodeHtmlElement2,
                         dom: root,
                         children: [{type: MbaNodeHtmlElement2, 
                                     dom: first,
                                     children: [{type: MbaNodeHtmlElement2, dom: firstTextNode}]},
                                    {type: MbaNodeHtmlElement2,
                                     dom: second,
                                     children: [{type: MbaNodeHtmlElement2, dom: secondTextNode}]},
                                    {type: MbaNodeHtmlElement2,
                                     dom: third,
                                     children: [{type: MbaNodeHtmlElement2, dom: thirdTextNode}]}]}]};
        OnAttend(rootNode.match(testBefore)).DEtreVrai();
        
        mbaTemplate.integrateMambaAndBindingNodes();
        //rootNode.debug();
        var testAfter = 
            {type: MbaRootNode,
             dom: template,
             children: [{type: MbaNodeHtmlElement2,
                         dom: root,
                         children: [{type: MbaNodeHtmlElement2, 
                                      dom: first,
                                      children: [{type: MbaNodeBinding2, 
                                                  dom: firstTextNode}]},
                                     {type: MbaNodeDirective,
                                      dom: second,
                                      children: [{type: MbaNodeHtmlElement2,
                                                  dom: second,
                                                  children: [{type: MbaNodeBinding2, 
                                                              dom: secondTextNode}]}]},
                                     {type: MbaNodeHtmlElement2,
                                      dom: third,
                                      children: [{type: MbaNodeBinding2, 
                                                  dom: thirdTextNode}]}]}]};
        OnAttend(rootNode.match(testAfter)).DEtreVrai();
        
    });
        
    
    Ca('teste si il n\'y a pas de root alors pas de MbaNodeDirective', function(){
        var html = '<div id="root"><div id="toto"></div></div><div id="stuff"></div>';
        var directivePrecursor = {name: '#toto'};
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
        
        mbaTemplate.prepareForRender();
        
        var template = mbaTemplate.getTemplate();
        var root = mbaTemplate.findDom('#root');
        var toto = mbaTemplate.findDom('#toto');
        var totoTextNode = toto.getChildren();
        var stuff = mbaTemplate.findDom('#stuff');
        
        var rootNode = mbaTemplate.getRootNode();    
        
        var testAfter = 
            {type: MbaRootNode,
             dom: template,
             children: [{type: MbaNodeHtmlElement2,
                         dom: root,
                         children: [{type: MbaNodeHtmlElement2, 
                                     dom: toto,
                                     children: [{type: MbaNodeBinding2, 
                                                 dom: totoTextNode}]}]},
                        {type: MbaNodeHtmlElement2,
                         dom: stuff}]};
        OnAttend(rootNode.match(testAfter)).DEtreVrai();
    });
     
    function createTemplateBindingForTestTransformationParam(template, anchorSelector, modelProperty, transformation){
        var mbaAccessor = new MbaFieldAccessor2('name');
        var mbaAccessorChain = new MbaAccessorChain().prependAccessor(mbaAccessor);
        var mbaTransf = new MbaTransf2(transformation, mbaAccessorChain);
        var mbaBinding = new MbaBinding2(anchorSelector, new DefaultAnchorProvider(), mbaTransf);
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
    
    Ca('teste que le render pour un MbaTmplateBinding modifie l\'ancre avec la valeur du modèle', function(){
        var template = new MbaDom('<div id="root"><div id="toto"></div></div>');
        var toto = template.find('#toto').getDom(0);
        var model = {name: 'tutu'};
        var templatebinding = createTemplateBindingForTest(template, '#toto', 'name');
        
        //templatebinding.render(model, new MbaRoute(['0']));            
        //OnAttend(toto.innerHTML).DEtreEgalA(model.name);//commenté car déprécié
    });
    
    Ca('teste setTemplate sur un MbaTmplateBinding recalcule l\'ancre, le rendu se fait sur le nouveau template', function(){
        var template = new MbaDom('<div id="root"><div id="toto"></div></div>');
        var toto = template.find('#toto');
        var totoDomElement = toto.getDom(0);
        var model = {name: 'tutu'};
        var templatebinding = createTemplateBindingForTest(new MbaDom(), '#toto', 'name');
        
        OnAttend(templatebinding.getAnchor().isEmpty()).DEtreVrai();
        templatebinding.setTemplate(template);
        //OnAttend(templatebinding.getAnchor().equals(toto)).DEtreVrai();//commenté car déprécié
        
        //templatebinding.render(model, new MbaRoute(['0']));            
        //OnAttend(totoDomElement.innerHTML).DEtreEgalA(model.name);//commenté car déprécié
    });
    
    //TODO gérer le cas où la transformation supprime l'ancre dans le parent
    /*Ca('teste que l\'élément à mettre à jour est réinséré dans son parent avant d\'être mis à jour', function(){
        var template = new MbaDom('<div id="root"><div id="toto"></div></div>');
        var toto = template.find('#toto');
        var totoDomElement = toto.getDom(0);
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
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
        
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
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
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
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
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
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode(); 
        var tutuBefore = mbaTemplate.findInRenderedDom('.name').getDom(0);
        var tataBefore = mbaTemplate.findInRenderedDom('.name').getDom(1);
            
        model.push({name: "titi"});
        mbaTemplate.render(model);
        var tutuAfter = mbaTemplate.findInRenderedDom('.name').getDom(0);
        var tataAfter = mbaTemplate.findInRenderedDom('.name').getDom(1);
        
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
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);        
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode(); 
        var tutuBefore = mbaTemplate.findInRenderedDom('.name').getDom(0);
        var tataBefore = mbaTemplate.findInRenderedDom('.name').getDom(1);
            
        model.pop();
        mbaTemplate.render(model);
        var tutuAfter = mbaTemplate.findInRenderedDom('.name').getDom(0);
        
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
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode(); 
        var tataBefore = mbaTemplate.findInRenderedDom('.name').getDom(1);
        OnAttend(tataBefore).DeNePasEtreNull();
        
        model.pop();
        mbaTemplate.render(model);
        
        model.push({name: "tata"});
        mbaTemplate.render(model);
        //rootNode.debug(true);
        var tataAfter = mbaTemplate.findInRenderedDom('.name').getDom(1);
        
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
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
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
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode(); 
        //rootNode.debug(true);
        
        var htmlRendered = '<div class="name">toto</div><div class="tel">1234</div>';
        OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(htmlRendered);
        OnAttend(rootNode.indexedRenderedDomIsValid()).DEtreVrai();
    });
    
    //TODO à faire marcher quand les MbaNodeBinding2 gèreront les itérations ou déduire les root pour ajouter une mbaNodeDirective
    /*Ca('teste le rendu avec deux niveaux de modèle, sous-modèle tableau, sans root', function(){
        var html = '<div class="name"></div><div class="tel"></div>';
        var directivePrecursor = {name: '.name', tel: {number: '.tel'}};
        var model = {name: "toto", tel: [{number: "1234"}, {number: "5678"}]};
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
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
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
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
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
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
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
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
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
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
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode(); 
        //rootNode.debug(true);
        
        var htmlRendered = 
            '<div id="root"><div id="toto"></div></div><div id="stuff"></div>';
        OnAttend(mbaTemplate.getRenderedDom().toString()).DEtreEgalA(htmlRendered);
        OnAttend(rootNode.indexedRenderedDomIsValid()).DEtreVrai();
    });
    
    Ca('teste le rendu avec une directive minimale avec root, modèle null', function(){
        var html = '<div id="root"><div id="toto">toto</div></div><div id="stuff"></div>';
        var directivePrecursor = {r00t: '#toto', name: '#toto'};
        var model = null;
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
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
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
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
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
                
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
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
                
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
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
                
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
        
        var mbaTemplate = new MbaTemplate2(html, directive);
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode();   
        //rootNode.debug(true);
        var messages = mbaTemplate.getRenderedDom();
        var root = document.createElement('div');
        root.id = 'root';
        
        root.appendChild(document.createElement('span'));
        for(var i=0 ; i<messages.getLength() ; i++){
            root.appendChild(messages.getDom(i));
        }
        
        var mbaRoot = new MbaDom(root);
        OnAttend(mbaRoot.toString()).DEtreEgalA('<div id="root"><span></span><div class="message">tutu</div><div id="stuff"></div></div>');
         
        model.push({text: 'toto'});
        mbaTemplate.render(model);
        //rootNode.debug(true);
    
        OnAttend(mbaRoot.toString()).DEtreEgalA('<div id="root"><span></span><div class="message">tutu</div><div class="message">toto</div><div id="stuff"></div></div>');
    });
    
     Ca('teste que les éléments à la racine sont insérés dans le dom existant au bon endroit', function(){
        var html = '<div class="message"></div><div id="stuff"></div>';
        var directive = {"r00t" : ".message", "text": ".message"};
        var model = [{text: 'tutu'}];
        
        var mbaTemplate = new MbaTemplate2(html, directive);
        mbaTemplate.render(model);
        //mbaTemplate.getRootNode().debug(true);
        var messages = mbaTemplate.getRenderedDom();
        var root = document.createElement('div');
        root.id = 'root';
        
        for(var i=0 ; i<messages.getLength() ; i++){
            root.appendChild(messages.getDom(i));
        }
        
        var mbaRoot = new MbaDom(root);
        OnAttend(mbaRoot.toString()).DEtreEgalA('<div id="root"><div class="message">tutu</div><div id="stuff"></div></div>');
         
        model.push({text: 'toto'});
        mbaTemplate.render(model);
        //mbaTemplate.getRootNode().debug(true);
        OnAttend(mbaRoot.toString()).DEtreEgalA('<div id="root"><div class="message">tutu</div><div class="message">toto</div><div id="stuff"></div></div>');
    });
    
    Ca('teste que les éléments à la racine sont insérés dans le dom existant', function(){
        var html = '<div class="message"></div>';
        var directive = {"r00t" : ".message", "text": ".message"};
        var model = [{text: 'tutu'}];
        
        var mbaTemplate = new MbaTemplate2(html, directive);
        mbaTemplate.render(model);
        //mbaTemplate.getRootNode().debug(true);
        var messages = mbaTemplate.getRenderedDom();
        var root = document.createElement('div');
        root.id = 'root';
        
        for(var i=0 ; i<messages.getLength() ; i++){
            root.appendChild(messages.getDom(i));
        }
        
        var mbaRoot = new MbaDom(root);
        OnAttend(mbaRoot.toString()).DEtreEgalA('<div id="root"><div class="message">tutu</div></div>');
         
        model.push({text: 'toto'});
        mbaTemplate.render(model);
        //mbaTemplate.getRootNode().debug(true);
        OnAttend(mbaRoot.toString()).DEtreEgalA('<div id="root"><div class="message">tutu</div><div class="message">toto</div></div>');
    });
    
    Ca('teste l\'appel d\'une méthode sur un évènement, ancre utilisée pour un binding', function(){
        var html = '<div id="toto"></div>';
        var directive = {"name": "#toto@attr",
                         "/doIt" : "#toto->click"};
        var model = {name: 'tutu', didIt: false, doIt: function(){this.didIt = true;}};
        
        var mbaTemplate = new MbaTemplate2(html, directive);
        mbaTemplate.render(model);
        //mbaTemplate.getRootNode().debug(true);
        var dom = mbaTemplate.getRenderedDom();
        var toto = mbaTemplate.findInRenderedDom('#toto').getDom(0);
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
        
        var mbaTemplate = new MbaTemplate2(html, directive);
        mbaTemplate.render(model);
        var toto = mbaTemplate.findInRenderedDom('#toto').getDom(0);
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
            var mbaTemplate = new MbaTemplate2(html, directive);
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
        
        var mbaTemplate = new MbaTemplate2(html, directive);
        mbaTemplate.render(model);
       // mbaTemplate.getRootNode().debug(true);
        var dom = mbaTemplate.getRenderedDom();
        var toto = mbaTemplate.findInRenderedDom('#toto').getDom(0);
        OnAttend(dom.toString()).DEtreEgalA(html);
        OnAttend(model.sub.didIt).DEtreFaux();
        
        toto.dispatchEvent(new Event('click'));
        OnAttend(model.sub.didIt).DEtreVrai();        
    });
    
    Ca('teste l\'appel d\'une méthode du sous-modèle sur un évènement, directive sans root', function(){
        var html = '<div id="toto"></div>';
        var directive = {"sub" : {"/doIt" : "#toto->click"}};
        var model = {sub: {didIt: false, doIt: function(){this.didIt = true;}}};
        
        var mbaTemplate = new MbaTemplate2(html, directive);
        mbaTemplate.render(model);
       // mbaTemplate.getRootNode().debug(true);
        var dom = mbaTemplate.getRenderedDom();
        var toto = mbaTemplate.findInRenderedDom('#toto').getDom(0);
        OnAttend(dom.toString()).DEtreEgalA(html);
        OnAttend(model.sub.didIt).DEtreFaux();
        
        toto.dispatchEvent(new Event('click'));
        OnAttend(model.sub.didIt).DEtreVrai();        
    });
    
    Ca('teste l\'appel d\'une méthode sur un évènement', function(){
        var html = '<div id="toto"></div>';
        var directive = {"/doIt" : "#toto->click"};
        var model = {didIt: false, doIt: function(){this.didIt = true;}};
        
        var mbaTemplate = new MbaTemplate2(html, directive);
        mbaTemplate.render(model);
        //mbaTemplate.getRootNode().debug(true);
        var dom = mbaTemplate.getRenderedDom();
        var toto = mbaTemplate.findInRenderedDom('#toto').getDom(0);
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
       var accessorChain = new MbaAccessorChain().prependAccessor(new MbaFieldAccessor2('toto'));
        accessorChain.prependAccessor(new MbaFieldAccessor2('titi'));
        accessorChain.prependAccessor(new MbaFieldAccessor2('tata'));
        var model = {tata: [{titi: {toto: 'tutu1'}},
                            {titi: {toto: 'tutu2'}}]};
        
        var inputRoute = [0, 1, 0];
        var modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        var outputRoute = accessorChain.getLastRoute();
        OnAttend(modelValue).DEtreEgalA('tutu2');      
        OnAttend(routesAreEquals(inputRoute, outputRoute)).DEtreVrai();
    });
    

    
    Ca('teste l\'application d\'une route partielle par le MbaAccessorChain', function(){
       var accessorChain = new MbaAccessorChain().prependAccessor(new MbaFieldAccessor2('toto'));
        accessorChain.prependAccessor(new MbaFieldAccessor2('titi'));
        accessorChain.prependAccessor(new MbaFieldAccessor2('tata'));
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
        accessorChain.prependAccessor(new MbaFieldAccessor2('toto'));
        accessorChain.prependAccessor(new MbaFieldAccessor2('titi'));
        accessorChain.prependAccessor(new MbaFieldAccessor2('tata'));
        
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
        accessorChain.prependAccessor(new MbaFieldAccessor2('toto'));
        accessorChain.prependAccessor(new MbaFieldAccessor2('titi'));
        accessorChain.prependAccessor(new MbaFieldAccessor2('tata'));
        
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
        accessorChain.prependAccessor(new MbaFieldAccessor2('toto'));
        accessorChain.prependAccessor(new MbaFieldAccessor2('titi'));
        accessorChain.prependAccessor(new MbaFieldAccessor2('tata'));
        
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
        accessorChain.prependAccessor(new MbaFieldAccessor2('toto'));
        accessorChain.prependAccessor(new MbaFieldAccessor2('titi'));
        accessorChain.prependAccessor(new MbaFieldAccessor2('tata'));
        
        var model = null;
        var inputRoute = [0, 1, 0];
        var modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        var outputRoute = accessorChain.getLastRoute();
        OnAttend(modelValue).DEtreNull();
        OnAttend(routesAreEquals(outputRoute, [])).DEtreVrai();
    });
        
    Ca('teste l\'application d\'une route sur un sous-modèle null par le MbaAccessorChain', function(){
        var accessorChain = new MbaAccessorChain();
        accessorChain.prependAccessor(new MbaFieldAccessor2('toto'));
        accessorChain.prependAccessor(new MbaFieldAccessor2('titi'));
        accessorChain.prependAccessor(new MbaFieldAccessor2('tata'));
        
        var model = {tata: null};
        var inputRoute = [0, 0, 1];
        var modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        var outputRoute = accessorChain.getLastRoute();
        OnAttend(modelValue).DEtreNull();
        OnAttend(routesAreEquals(outputRoute, [0])).DEtreVrai();
    });

    Ca('teste que l\'on peut mettre à jour une valeur du modèle en suivante une route', function(){
        var accessorChain = new MbaAccessorChain();
        accessorChain.prependAccessor(new MbaFieldAccessor2('name'));
        
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
        accessorChain.prependAccessor(new MbaFieldAccessor2('prop'));
        accessorChain.prependAccessor(new MbaFieldAccessor2('sub'));
        
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
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
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
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
        mbaTemplate.render(model);
        //mbaTemplate.getRootNode().debug(true);
        
        var toto = mbaTemplate.findInRenderedDom('#toto').getDom(0);
        toto.setAttribute('attr', 'tata');
        toto.dispatchEvent(new Event('click'));
        
        OnAttend(model.name).DEtreEgalA('tata');
    });
    
    Ca('teste la lecture du dom pour les textNodes passe par l\élément parent', function(){
        var html = '<div id="toto"></div>';
        var directivePrecursor = {name: '#toto->click'};
        var model = {name: "tutu"};
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
        mbaTemplate.render(model);
        
        var toto = mbaTemplate.findInRenderedDom('#toto').getDom(0);
        var totoTextNode = toto.childNodes[0];
        totoTextNode.textContent = 'tata';
        toto.dispatchEvent(new Event('click'));
        
        OnAttend(model.name).DEtreEgalA('tata');
    });
    
     Ca('teste que la lecture du dom sur résiste au changement de référence du modèle', function(){
        var html = '<div id="toto"></div>';
        var directivePrecursor = {name: '#toto@attr->click'};
        var model = {name: "tutu"};
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
        mbaTemplate.render(model);
        var model2 = {name: "toto"};
        mbaTemplate.render(model2);
        
        var toto = mbaTemplate.findInRenderedDom('#toto').getDom(0);
        toto.setAttribute('attr', 'tata');
        toto.dispatchEvent(new Event('click'));
        
        OnAttend(model.name).DEtreEgalA('tutu');
        OnAttend(model2.name).DEtreEgalA('tata');
    });
    
    Ca('teste que lorsque\'on lit le dom pour mettre à jour le modèle on rafraichit tout le dom qui lui correspond', function(){
        var html = '<input type="text"></input><span></span>';
        var directivePrecursor = {name: 'input$value->blur, span'};
        var model = {name: "toto"};
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
        mbaTemplate.render(model);
        
        var input = mbaTemplate.findInRenderedDom('input').getDom(0);
        var span = mbaTemplate.findInRenderedDom('span').getDom(0);
        
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
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode();
        //rootNode.debug(true);
        
        var dom = mbaTemplate.getRenderedDom().getDom();
        var propInput = mbaTemplate.findInRenderedDom('#prop').getDom(0);
        var propSpan = mbaTemplate.findInRenderedDom('#prop_').getDom(0);
        var subPropInput = mbaTemplate.findInRenderedDom('#subprop').getDom(0);
        var subPropSpan = mbaTemplate.findInRenderedDom('#subprop_').getDom(0);
        
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
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode();
        //rootNode.debug(true);
        
        var dom = mbaTemplate.getRenderedDom().getDom();
        var propInput = mbaTemplate.findInRenderedDom('#prop').getDom(0);
        var propSpan = mbaTemplate.findInRenderedDom('#prop_').getDom(0);
        var subPropInput = mbaTemplate.findInRenderedDom('#subprop').getDom(0);
        var subPropSpan = mbaTemplate.findInRenderedDom('#subprop_').getDom(0);
        
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
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode();
        //rootNode.debug(true);
        
        var renderedHtml = 
            '<div id="prop_root"><input id="prop" type="text"><span id="prop_">toto</span><div id="subprop_root"><input id="subprop" type="text"><span id="subprop_">tutu</span></div><div id="subprop_root"><input id="subprop" type="text"><span id="subprop_">titi</span></div></div><div id="prop_root"><input id="prop" type="text"><span id="prop_">bob</span><div id="subprop_root"><input id="subprop" type="text"><span id="subprop_">patrick</span></div><div id="subprop_root"><input id="subprop" type="text"><span id="subprop_">sandy</span></div></div>';
        
        var dom = mbaTemplate.getRenderedDom();
        OnAttend(dom.toString()).DEtreEgalA(renderedHtml);
        
        var totoInput = mbaTemplate.findInRenderedDom('#prop').getDom(0);
        var totoSpan = mbaTemplate.findInRenderedDom('#prop_').getDom(0);
        var bobInput = mbaTemplate.findInRenderedDom('#prop').getDom(1);
        var bobSpan = mbaTemplate.findInRenderedDom('#prop_').getDom(1);
        var tutuInput = mbaTemplate.findInRenderedDom('#subprop').getDom(0);
        var tutuSpan = mbaTemplate.findInRenderedDom('#subprop_').getDom(0);
        var titiInput = mbaTemplate.findInRenderedDom('#subprop').getDom(1);
        var titiSpan = mbaTemplate.findInRenderedDom('#subprop_').getDom(1);
        var patrickInput = mbaTemplate.findInRenderedDom('#subprop').getDom(2);
        var patrickSpan = mbaTemplate.findInRenderedDom('#subprop_').getDom(2);
        var sandyInput = mbaTemplate.findInRenderedDom('#subprop').getDom(3);
        var sandySpan = mbaTemplate.findInRenderedDom('#subprop_').getDom(3);
        
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
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode();
        //rootNode.debug(true);
        
        var renderedHtml = 
            '<input id="prop" type="text"><span id="prop_">toto</span><input id="prop" type="text"><span id="prop_">bob</span><input id="subprop" type="text"><span id="subprop_">tutu</span><input id="subprop" type="text"><span id="subprop_">titi</span><input id="subprop" type="text"><span id="subprop_">patrick</span><input id="subprop" type="text"><span id="subprop_">sandy</span>';
        
        var dom = mbaTemplate.getRenderedDom();
        OnAttend(dom.toString()).DEtreEgalA(renderedHtml);
        
        var totoInput = mbaTemplate.findInRenderedDom('#prop').getDom(0);
        var totoSpan = mbaTemplate.findInRenderedDom('#prop_').getDom(0);
        var bobInput = mbaTemplate.findInRenderedDom('#prop').getDom(1);
        var bobSpan = mbaTemplate.findInRenderedDom('#prop_').getDom(1);
        var tutuInput = mbaTemplate.findInRenderedDom('#subprop').getDom(0);
        var tutuSpan = mbaTemplate.findInRenderedDom('#subprop_').getDom(0);
        var titiInput = mbaTemplate.findInRenderedDom('#subprop').getDom(1);
        var titiSpan = mbaTemplate.findInRenderedDom('#subprop_').getDom(1);
        var patrickInput = mbaTemplate.findInRenderedDom('#subprop').getDom(2);
        var patrickSpan = mbaTemplate.findInRenderedDom('#subprop_').getDom(2);
        var sandyInput = mbaTemplate.findInRenderedDom('#subprop').getDom(3);
        var sandySpan = mbaTemplate.findInRenderedDom('#subprop_').getDom(3);
        
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
        var mbaTemplate = new MbaTemplate2(html, directivePrecursor);
        mbaTemplate.render(model);
        var rootNode = mbaTemplate.getRootNode();
        //rootNode.debug(true);
        
        var renderedHtml = 
            '<div id="prop_root"><input id="prop" type="text"><span id="prop_">toto</span></div><div id="prop_root"><input id="prop" type="text"><span id="prop_">bob</span></div><div id="subprop_root"><input id="subprop" type="text"><span id="subprop_">tutu</span></div><div id="subprop_root"><input id="subprop" type="text"><span id="subprop_">titi</span></div><div id="subprop_root"><input id="subprop" type="text"><span id="subprop_">patrick</span></div><div id="subprop_root"><input id="subprop" type="text"><span id="subprop_">sandy</span></div>';
        
        var dom = mbaTemplate.getRenderedDom();
        OnAttend(dom.toString()).DEtreEgalA(renderedHtml);
        
        var totoInput = mbaTemplate.findInRenderedDom('#prop').getDom(0);
        var totoSpan = mbaTemplate.findInRenderedDom('#prop_').getDom(0);
        var bobInput = mbaTemplate.findInRenderedDom('#prop').getDom(1);
        var bobSpan = mbaTemplate.findInRenderedDom('#prop_').getDom(1);
        var tutuInput = mbaTemplate.findInRenderedDom('#subprop').getDom(0);
        var tutuSpan = mbaTemplate.findInRenderedDom('#subprop_').getDom(0);
        var titiInput = mbaTemplate.findInRenderedDom('#subprop').getDom(1);
        var titiSpan = mbaTemplate.findInRenderedDom('#subprop_').getDom(1);
        var patrickInput = mbaTemplate.findInRenderedDom('#subprop').getDom(2);
        var patrickSpan = mbaTemplate.findInRenderedDom('#subprop_').getDom(2);
        var sandyInput = mbaTemplate.findInRenderedDom('#subprop').getDom(3);
        var sandySpan = mbaTemplate.findInRenderedDom('#subprop_').getDom(3);
        
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
        var mbaTemplate = new MbaTemplate2(html, directive);
        mbaTemplate.render(model);
        
        var dom = mbaTemplate.getRenderedDom();
        var select = mbaTemplate.findInRenderedDom('select').getDom(0);
        var renderedHtml = '<select><option>toto</option><option>tutu</option><option>tata</option><option>titi</option></select>';
        OnAttend(dom.toString()).DEtreEgalA(renderedHtml);   
        OnAttend(select.value).DEtreEgalA('tata');
    });
    
    //TODO : tester et implémenter l'intégration de bindingNode avec ancre de binding qui retourne plusieurs éléments
   
};
	

Test(function() {

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

	Ca('teste domToString sur un element jQuery', function() {
		var domString = '<div id="root"></div>';
		var dom = $(domString);
		OnAttend(domToString(dom)).DEtreEgalA(domString);
	});

	Ca('teste domToString sur un tableau', function() {
		var domString = '<div id="root"></div>';
		var dom = $.parseHTML(domString)[0];
		var domJQuery = $(domString);
		var domArray = [ dom, domJQuery ];
		OnAttend(domToString(domArray)).DEtreEgalA(domString + domString);
	});

	Ca(	'teste l\'initialisation d\'une instance de la classe Model. ',
		function() {
			var modelPrec = {
				'toto' : 'je suis toto'
			};
			var model = new MbaModel(modelPrec);

			OnAttend(modelPrec).DePosséder('getBinding');
			OnAttend(modelPrec).DePosséder('dispatch');
			OnAttend(Object.keys(modelPrec.getBinding()).length).DEtreEgalA(0);
			OnAttend(Object.keys(model.getBinding()).length).DEtreEgalA(0);
		});

	Ca(	'teste l\'initialisation d\'une instance de la classe Dom. ',
		function() {
			var dom = new MbaTemplate('<div id="toto"></div><span id="tata"></span>');

			OnAttend($.isArray(dom.getDom())).DEtreVrai();
			OnAttend(dom.getDom().length).DEtreEgalA(2);
			OnAttend(isDom(dom.getDom())).DEtreVrai();
		});

	Ca('teste MbaTemplate.toString() ', function() {
		var domString = '<div id="toto"></div><span id="tata"></span>';
		var dom = new MbaTemplate(domString);
		var res = dom.toString();
		
		OnAttend(domString).DEtreEgalA(res);
	});

	Ca('teste MbaTemplate.clone() ', function() {
		var dom = new MbaTemplate('<div id="toto"></div><span id="tata"></span>');
		var clone = dom.clone();
				
		OnAttend(clone instanceof MbaTemplate).DEtreVrai();
		OnAttend(clone.getDom().length).DEtreEgalA(dom.getDom().length);
		OnAttend(clone.getDom()[0].id).DEtreEgalA(dom.getDom()[0].id);
		OnAttend(clone.getDom()[1].id).DEtreEgalA(dom.getDom()[1].id);
	});

	Ca('teste MbaTemplate.is() ', function() {
		var dom = new MbaTemplate('<div id="toto"></div><span id="tata"></span>');
		var other = new MbaTemplate('<div id="toto"></div><span id="tata"></span>');
		
		OnAttend(dom.is(dom)).DEtreVrai();
		OnAttend(dom.is(other)).DEtreFaux();
	});

	Ca('teste MbaTemplate.find() ', function() {
		var dom = new MbaTemplate('<div id="toto"></div><span id="tata"></span>');
	
		var toto = dom.find('#toto');
		
		OnAttend(toto instanceof MbaTemplate).DEtreVrai();
		OnAttend(toto.getDom()[0].id).DEtreEgalA('toto');
	});

	Ca('teste MbaTemplate.isEmpty() ', function() {
		var dom = new MbaTemplate('<div id="toto"></div><span id="tata"></span>');
	
		var tutu = dom.find('#tutu');
		var tata = dom.find('#tata');
		
		OnAttend(tutu.isEmpty()).DEtreVrai();
		OnAttend(tata.isEmpty()).DEtreFaux();
	});
	
	Ca('teste MbaTemplate.replace() ', function() {
		var dom = new MbaTemplate('<div id="toto"></div><span id="tata"></span>');
		var toto = dom.find('#toto');
		var tutu = new MbaTemplate('<div id="tutu"></div>');
		
		dom.replace(toto, tutu);
		
		var toto2 = dom.find('#toto');
		var tutu2 = dom.find('#tutu');
		
		OnAttend(toto2.isEmpty()).DEtreVrai();
		OnAttend(tutu2.isEmpty()).DEtreFaux();
		OnAttend(tutu2.getDom()[0].id).DEtreEgalA('tutu');
		OnAttend(dom.getDom()[0].id).DEtreEgalA('tutu');
		OnAttend(dom.getDom()[1].id).DEtreEgalA('tata');
	});

	Ca('teste MbaTemplate.concat() ', function() {
		var dom = new MbaTemplate('<div id="toto"></div><span id="tata"></span>');
		var tutu = new MbaTemplate('<div id="tutu"></div>');
		
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
		var dom = new MbaTemplate('<div id="toto"></div><span id="tata"></span>');
		var directive = new MbaDirective({'toto' : '#toto', 'tutu' : {'tata' : '#tata'}});
		
		OnAttend(directive.isDirective('toto')).DEtreFaux();
		OnAttend(directive.isDirective('tutu')).DEtreVrai();		
	});	
	
	Ca('teste MbaDirective.hasRoot() ', function() {
		var dom = new MbaTemplate('<div id="toto"></div><span id="tata"></span>');
		var directiveNoRoot = new MbaDirective({'toto' : '#toto'});
		var directiveRoot = new MbaDirective({'r00t' : '#toto, #tata', 'toto' : '#toto'});
		
		OnAttend(directiveNoRoot.hasRoot()).DEtreFaux();
		OnAttend(directiveRoot.hasRoot()).DEtreVrai();
	});	

	Ca('teste que findInTemplate() accepte les selecteurs css'
			+ ' et retourne un elément de dom', function() {
		var template = '<div id="toto"></div><span id="tata"></span>';
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
		var domElements = findInTemplate(template, '.tutu');
		OnAttend(domElements).DeNePasEtreNull();
		OnAttend($.isArray(domElements)).DEtreVrai();
		OnAttend(domElements.length).DEtreEgalA(2);
	});

	Ca('teste que findInTemplate() retourne l\'élément voulu même si celui-ci '
			+ 'est à la racine', function() {
		var template = '<div id="root"><div id="toto"></div>';
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

	Ca('teste que render() remplace les selecteurs css du binding'
			+ ' par les éléments dom', function() {
		var template = '<div id="toto"></div><span id="tata"></span>';

		var model = {};
		model.totoProp = 'je suis la valeur de toto';
		model.tataProp = 'je suis la valeur de tata';

		var binding = {};
		binding.totoProp = '#toto';
		binding.tataProp = '#tata';

		OnAttend(isDomElement(binding.totoProp)).DEtreFaux();
		OnAttend(isDomElement(binding.tataProp)).DEtreFaux();

		var dom = $mamba(model, template, binding);

		OnAttend(isDom(model[MBA_CST.BINDING].totoProp[0].dom)).DEtreVrai();
		OnAttend(isDom(model[MBA_CST.BINDING].tataProp[0].dom)).DEtreVrai();
		OnAttend(model[MBA_CST.BINDING].totoProp[0].dom[0]).DEtre(dom[0]);
		OnAttend(model[MBA_CST.BINDING].tataProp[0].dom[0]).DEtre(dom[1]);
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

			OnAttend(dom.length).DEtreEgalA(4);
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
		var template = '<div id="toto"></div>' + '<div id="titi"></div>'
				+ '<span id="tata"></span>' + '<div id="tutu"></div>';

		var model = {};
		model.totoProp = 'je suis la valeur de toto';
		model.tataProp = 'je suis la valeur de tata';
		model.subProp = {
			'titiProp' : 'je suis la valeur de titi',
			'tutuProp' : 'je suis la valeur de tutu',
		};

		var binding = {};
		binding.r00t = '#toto, #titi, #tata, #tutu';
		binding.totoProp = '#toto';
		binding.tataProp = '#tata';
		binding.subProp = {
			'titiProp' : '#titi',
			'tutuProp' : '#tutu'
		};

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

	Ca(	'teste que render() remplit le binding du modèle (de type '
				+ 'tableau avec un binding contenant un selecteur) avec un tabeau',
		function() {
			var template = $.parseHTML('<div id="root">'
					+ '<div class="toto"></div>'
					+ '</div>')[0];
			var model = {
				"toto" : [ "toto1", "toto2" ]
			};
			var binding = {
				"toto" : ".toto"
			};

			var dom = $mamba(model, template, binding);

			OnAttend($.isArray(model[MBA_CST.BINDING].toto)).DEtreVrai();
			OnAttend(model[MBA_CST.BINDING].toto[0].dom[0].textContent).DEtreEgalA('toto1');
			OnAttend(model[MBA_CST.BINDING].toto[1].dom[0].textContent).DEtreEgalA('toto2');
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

			OnAttend(dom[0].textContent).DEtreEgalA('toto');
			OnAttend(dom[1].textContent).DEtreEgalA('option');
			OnAttend(dom[2].textContent).DEtreEgalA('tutu');
			OnAttend(dom[3].textContent).DEtreEgalA('');
		});

	Ca(	'teste le modèle ne contient pas une propriété de la directive \'attribut\'',
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

	Ca(	'teste qaund le modèle ne contient pas une propriété de la directive \'ajout/suppr attribut\'',
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
	
	Ca(	'teste qaund le modèle ne contient pas un sous-modèle de la directive',
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
					       "name" : ".name",//TODO si ici on met.person alors ca fait n'importe quoi, peut etre vérifier si il y a des éléments enfants au dom dans lequels on va modififier textContent à la validation 
					       "animal"  : {"name" : ".animal"}};

			var dom = $mamba(model, template, binding);
			
			var totoAnimal = findInTemplate(dom, ".animal")[0];
			var tutuAnimal = findInTemplate(dom, ".animal")[1];
			OnAttend(totoAnimal.textContent).DEtreEgalA('felix');
			OnAttend(tutuAnimal.textContent).DEtreEgalA('');
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
	
	Ca(	'teste que model.'+MBA_CST.DISPATCH+'() met à jour le dom avec la nouvelle valeur',
		function() {
			var template = '<div id="toto"></div>';
			var model = {"name" : "toto"};
			var directive = {"name" : "#toto"};
			
			var dom = $mamba(model, template, directive);
			
			OnAttend(dom[0].id).DEtreEgalA('toto');
			OnAttend(dom[0].textContent).DEtreEgalA('toto');
			
			model.name = "tutu";
			model[MBA_CST.DISPATCH]();
			
			OnAttend(dom[0].id).DEtreEgalA('toto');
			OnAttend(dom[0].textContent).DEtreEgalA('tutu');
		});
	
	Ca(	'teste que model.'+MBA_CST.DISPATCH+'() conserve les références des eléments de dom',
		function() {
			var template = '<div id="toto"></div>';
			var model = {"name" : "toto"};
			var directive = {"name" : "#toto"};
			
			var dom = $mamba(model, template, directive);
			
			var first = dom[0];
			OnAttend(first.id).DEtreEgalA('toto');
			OnAttend(first.textContent).DEtreEgalA('toto');
			
			model.name = "tutu";
			model[MBA_CST.DISPATCH]();
			
			var second = dom[0];
			OnAttend(second.id).DEtreEgalA('toto');
			OnAttend(second.textContent).DEtreEgalA('tutu');
			
			OnAttend(first).DEtre(second);
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
});

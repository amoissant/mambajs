Test(function() {   

    
    Ca('teste les lecture et écriture d\'un champ par l\'accesseur', function(){
        var accessor = new MbaAccessor('prop');
        var model = {prop: 'toto'};
        OnAttend(accessor.getModelValue(model)).DEtreEgalA('toto');
        accessor.setModelValue(model, 'titi');
        OnAttend(model.prop).DEtreEgalA('titi');
    });
    
    Ca('teste les lecture et écriture d\'un membre non existant par l\'accesseur', function(){
        var accessor = new MbaAccessor('prop');
        var model = {};
        OnAttend(accessor.getModelValue(model)).DEtreEgalA(null);
        accessor.setModelValue(model, 'titi');
        OnAttend(model.prop).DEtreEgalA('titi');
    });
    
    Ca('teste les lecture et écriture d\'un membre getter/setter par l\'accesseur', function(){
        var accessor = new MbaAccessor('prop');
        var model = 
            {_private: 'toto', 
             prop: function(){
                 if(arguments.length>0)
                     this._private = arguments[0];
                 else
                    return this._private;
             }};
        OnAttend(accessor.getModelValue(model)).DEtreEgalA('toto');
        accessor.setModelValue(model, 'titi');
        OnAttend(model.prop()).DEtreEgalA('titi');
    });
    
    Ca('teste les lecture et écriture d\'un membre objet par l\'accesseur', function(){
        var accessor = new MbaAccessor('prop');
        var model = {prop: {name: 'toto'}};
        OnAttend(accessor.getModelValue(model).name).DEtreEgalA('toto');
        accessor.setModelValue(model, {name: 'titi'});
        OnAttend(model.prop.name).DEtreEgalA('titi');
    });
    
    Ca('teste le binding d\'un select avec un tableau d\'entiers', function(){
         var model = {options: [1, 2, 3], selected: 2};
         var template = '<select><option></option></select>';
         var directive = {options: {r00t: 'option', toString: 'option'},
                          selected: 'select$value->change'};
         var root = document.createElement('div');
         root.innerHTML = template;
         var mamba = new Mamba(model, root.childNodes, directive);
         mamba.render();
         
         var select = root.childNodes[0];
         OnAttend(root.innerHTML).DEtreEgalA('<select><option>1</option><option>2</option><option>3</option></select>');
         OnAttend(select.value).DEtreEgalA(2);
         
         select.value = 3;
         select.dispatchEvent(new Event('change'));
         OnAttend(model.selected).DEtreEgalA(3);
    });
    
       Ca('teste le polymorphisme avec des transformations non sur les propriétés des éléments de dom', function(){
         var model = 
             [{name: 'titi'}, 
              {name: 'toto', selected: false},
              {selected: false}];
         var template = '<table><tbody><tr><td><input class="check" type="checkbox"></input></td><td><input class="name" type="text"></input></td></tr></tbody></table>';
         var directive =
             {"r00t" : "tr",
              "name" : ".name$value",
              "selected" : ".check$checked"};
         var root = document.createElement('div');
         root.innerHTML = template;
         var mamba = new Mamba(model, root.childNodes, directive);
         mamba.render();
         mamba.debugNodes();
         
         OnAttend(root.innerHTML).DEtreEgalA('<table><tbody><tr><td></td><td><input class="name" type="text"></td></tr><tr><td><input class="check" type="checkbox"></td><td><input class="name" type="text"></td></tr><tr><td><input class="check" type="checkbox"></td><td></td></tr></tbody></table>');
    });
    
    Ca('teste le polymorphisme avec des transformations de type texte', function(){
         var model = 
             [{first : 'toto'},
              {first : 'tutu', second : 'titi'},
              {second : 'tata'}];
         var template = '<span class="poly"></span><div class="poly"></div>';
         var directive =
             {"r00t" : ".poly",
              "first" : "span",
              "second" : "div"};
         var root = document.createElement('div');
         root.innerHTML = template;
         var mamba = new Mamba(model, root.childNodes, directive);
         mamba.render();
         //mamba.debugNodes();
         
         OnAttend(root.innerHTML).DEtreEgalA('<span class="poly">toto</span><span class="poly">tutu</span><div class="poly">titi</div><div class="poly">tata</div>');
    });
    
    //TODO valider les model, template binding et anchor et lever une erreur si le type ne correspond pas
    //TODO options de debug pour afficher les structure de données, afficher quand le model est set, quand on fait un refresh...
    //TODO optimiser les render récursif en passant le modèle parent, si c'est aussi celui de l'enfant alors on le garde
    //TODO tester que les events sont ignorés si canReadValueFromDom renvoi false
    //TODO comment faire pour que les refFunction et les customFunction puissent lire le dom
    //TODO events pour setter par défaut suivant le type de balise html.
    //     ex : input[type='text']=keyup,click, input[type='checkbox']=click
    //TODO binding par défaut suivant le type de balise html. 
    //     ex : input[type='text']=$value, input[type='checkbox']=$checked
    //TODO : réfléchir à l'intégration des raccourcis claviers
    //TODO avoir une méthode pour obtenir l'élément de dom correspondant à une propriété du modèle getDom(model, 'newItem');
    //-> retourne le dom pour model et en particulier sa propriété 'newItem'. Le second paramètre est optionnel.
    //TODO une fois le binding par défaut implémenté faire marcher ceci : 
    //  <span class="name"></span><input class="name" type="text"></input>, {name: 'toto'}, {"name": ".name"}
    //TODO Mamba api si on appelle refresh avant render alors message d'erreur
    //TODO implementer polymorphisme (si propriété n'existe pas suppr element de dom)
});
	

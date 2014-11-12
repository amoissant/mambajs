Test(function() {   
 
    MBA_DI.bind(DirectiveParser).to(DirectiveParser);
    
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
         mamba.setOptions({debug: false});
         mamba.render();
         
         var select = root.childNodes[0];
         OnAttend(root.innerHTML).DEtreEgalA('<select><option>1</option><option>2</option><option>3</option></select>');
         OnAttend(select.value).DEtreEgalA(2);
         
         select.value = 3;
         select.dispatchEvent(new Event('change'));
         OnAttend(model.selected).DEtreEgalA(3);
    });
    
    Ca('teste le polymorphisme avec des transformations sur les propriétés des éléments de dom', function(){
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
         mamba.setOptions({debug: false});
         mamba.render();
         //mamba.debugNodes();
         
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
        mamba.setOptions({debug: false});
        mamba.render();
        //mamba.debugNodes();
        
        OnAttend(root.innerHTML).DEtreEgalA('<span class="poly">toto</span><span class="poly">tutu</span><div class="poly">titi</div><div class="poly">tata</div>');
    });
    
    Ca('teste un scénario avec polymorphisme', function(){
        var model = 
            {elements: [
                {text : 'toto', 
                 value: function(){return arguments.length==0 ? this.text : this.text=arguments[0];}},
                {choice: 1, 
                 value: function(){return arguments.length==0 ? this.choice : this.choice=arguments[0];},
                 options : [1, 2, 3, 4]},
                {selected : true, value: function(){return arguments.length==0 ? this.selected : this.selected=arguments[0];}}
            ]};

        var template = '<div class="form_element"><span>value : </span><span class="val"></span><br/><input type="text"></input><select><option></option></select><input type="checkbox"></input></div>';

        var directive =
            {"elements" : {"r00t" : ".form_element",
               "text" : "input[type='text']$value->input",
               "options" : {"r00t" : "option", "toString" : "option"},
               "choice" : "select$value->(keyup, click)",
               "selected" : "input[type='checkbox']$checked->(click, keyup)",
               "value" : ".val"}};
 
        var root = document.createElement('div');
        root.innerHTML = template;
        var mamba = new Mamba(model, root.childNodes, directive);
        mamba.setOptions({debug: false});
        mamba.render();
        
        var input = root.childNodes[0].childNodes[3];
        var select = root.childNodes[1].childNodes[3];;
        var checkbox = root.childNodes[2].childNodes[3];;
        
        OnAttend(root.innerHTML).DEtreEgalA('<div class="form_element"><span>value : </span><span class="val">toto</span><br><input type="text"></div><div class="form_element"><span>value : </span><span class="val">1</span><br><select><option>1</option><option>2</option><option>3</option><option>4</option></select></div><div class="form_element"><span>value : </span><span class="val">true</span><br><input type="checkbox"></div>');
        
        OnAttend(input.value).DEtreEgalA('toto');
        OnAttend(select.value).DEtreEgalA('1');
        OnAttend(checkbox.checked).DEtreVrai();
        
        input.value='tutu';
        input.dispatchEvent(new Event('input'));
        
        OnAttend(root.innerHTML).DEtreEgalA('<div class="form_element"><span>value : </span><span class="val">tutu</span><br><input type="text"></div><div class="form_element"><span>value : </span><span class="val">1</span><br><select><option>1</option><option>2</option><option>3</option><option>4</option></select></div><div class="form_element"><span>value : </span><span class="val">true</span><br><input type="checkbox"></div>');
        
        select.value='3';
        select.dispatchEvent(new Event('keyup'));
        
        OnAttend(root.innerHTML).DEtreEgalA('<div class="form_element"><span>value : </span><span class="val">tutu</span><br><input type="text"></div><div class="form_element"><span>value : </span><span class="val">3</span><br><select><option>1</option><option>2</option><option>3</option><option>4</option></select></div><div class="form_element"><span>value : </span><span class="val">true</span><br><input type="checkbox"></div>');
        
        checkbox.checked = false;
        checkbox.dispatchEvent(new Event('keyup'));
        
        OnAttend(root.innerHTML).DEtreEgalA('<div class="form_element"><span>value : </span><span class="val">tutu</span><br><input type="text"></div><div class="form_element"><span>value : </span><span class="val">3</span><br><select><option>1</option><option>2</option><option>3</option><option>4</option></select></div><div class="form_element"><span>value : </span><span class="val">false</span><br><input type="checkbox"></div>');
    });
    
    Ca('teste que l\'on trace les selecteur, binding et event en mode debug (par défaut)', function(){
        var consoleContent = runWithSpyingConsole(function(){
            var mamba = new Mamba({name: 'toto'}, '<div></div>', {name: 'div@name->(click, blur)'});
            mamba.render();
        });
        OnAttend(consoleContent.contains('selector="div"')).DEtreVrai();
        OnAttend(consoleContent.contains('binding="@name"')).DEtreVrai();
        OnAttend(consoleContent.contains('events=[click,blur]')).DEtreVrai();
    });
    
    Ca('teste que l\'on ne trace pas les selecteur, binding et event si on n\'est pas en mode debug', function(){
        var consoleContent = runWithSpyingConsole(function(){
            var mamba = new Mamba({name: 'toto'}, '<div></div>', {name: 'div@name->(click, blur)'});
            mamba.setOptions({debug: false});
            mamba.render();
        });
        OnAttend(consoleContent.contains('selector="div"')).DEtreFaux();
        OnAttend(consoleContent.contains('binding="@name"')).DEtreFaux();
        OnAttend(consoleContent.contains('events=[click,blur]')).DEtreFaux();
    });
    
    Ca('teste que l\'on trace les selecteur, binding, events. Cas malformé 01', function(){
        var consoleContent = runWithSpyingConsole(function(){
            var mamba = new Mamba(null, '', {"selected" : "input[type='checkbox']$checked->(click, keyup"});
            mamba.render();
        });
        OnAttend(consoleContent.contains('selector="input[type=\'checkbox\']"')).DEtreVrai();
        OnAttend(consoleContent.contains('binding="$checked"')).DEtreVrai();
    });
    
    Ca('teste que l\'on trace les selecteur, binding, events. Cas malformé 02', function(){
       var consoleContent = runWithSpyingConsole(function(){
            var mamba = new Mamba(null, '', {"text" : "input[type='text']$value->change'"});
            mamba.render();
       });
        OnAttend(consoleContent.contains('selector="input[type=\'text\']"')).DEtreVrai();
        OnAttend(consoleContent.contains('binding="$value"')).DEtreVrai();
        OnAttend(consoleContent.contains('events=[change\']')).DEtreVrai();
    });
    
  Ca('teste le polymorphisme avec valeur null', function(){
        var model = {options : ['toto', 'titi'], selected: null};
        var html = '<select><option></option></select>';
        var directive = {options : {'r00t' : 'option', 'toString' : 'option'},
                         selected : 'select$value'};
        var root = document.createElement('div');
        root.innerHTML = html;
        var mamba = new Mamba(model, root.childNodes, directive);
        mamba.setOptions({debug: false});
        mamba.render();
        
        OnAttend(root.innerHTML).DEtreEgalA('<select><option>toto</option><option>titi</option></select>');        
    });
    
    Ca('teste le polymorphisme avec valeur undefined', function(){
        var model = {options : ['toto', 'titi'], selected: undefined};
        var html = '<select><option></option></select>';
        var directive = {options : {'r00t' : 'option', 'toString' : 'option'},
                         selected : 'select$value'};
        var root = document.createElement('div');
        root.innerHTML = html;
        var mamba = new Mamba(model, root.childNodes, directive);
        mamba.setOptions({debug: false});
        mamba.render();
        
        OnAttend(root.innerHTML).DEtreEgalA('<select><option>toto</option><option>titi</option></select>');        
    });

    Ca('teste le polymorphisme avec valeur null dans une collection', function(){
        var model = {options : ['toto', null, 'titi'], selected: undefined};
        var html = '<select><option></option></select>';
        var directive = {options : {'r00t' : 'option', 'toString' : 'option'},
                         selected : 'select$value'};
        var root = document.createElement('div');
        root.innerHTML = html;
        var mamba = new Mamba(model, root.childNodes, directive);
        mamba.setOptions({debug: false});
        mamba.render();
        
        OnAttend(root.innerHTML).DEtreEgalA('<select><option>toto</option><option>titi</option></select>');        
    });
      
    Ca('teste que l\'on trace le model utilisé pour le render', function(){
        var consoleContent = runWithSpyingConsole(function(){
            var mamba = new Mamba({text : 'toto'}, '<div></div>', {"text" : "div"});
            mamba.render();
        });
        OnAttend(consoleContent.contains('Render dom for model : ')).DEtreVrai();
    });
    
    Ca('teste que l\'on trace le sous-modèle utilisé pour le refresh', function(){
        var consoleContent = runWithSpyingConsole(function(){
            var model = {sub : {name: 'toto'}};
            var mamba = new Mamba(model, '<div><span></span></div>', {"sub" : {"name" : "span"}});
            mamba.render();
            mamba.refresh(model.sub);
        });
        OnAttend(consoleContent.contains('Refresh dom for model : ')).DEtreVrai();
    });
    
    Ca('teste que l\'on trace le super modèle utilisé pour le refresh', function(){
        var consoleContent = runWithSpyingConsole(function(){
            var mamba = new Mamba({text : 'toto'}, '<div></div>', {"text" : "div"});
            mamba.render();
            mamba.refresh();
        });
        OnAttend(consoleContent.contains('Refresh dom for model : ')).DEtreVrai();
    });    
    
    Ca('teste que l\'on trace un message d\'avertissement si le dom rendu est vide', function(){    
        var consoleContent = runWithSpyingConsole(function(){
            var model = function(){this.text = 'toto';};
            var mamba = new Mamba(new model(), '<div></div>', {"text" : "div"});
            mamba.render(model);//here is the mistake
        });
        OnAttend(consoleContent.contains('The rendered dom is empty, are you missing something ?')).DEtreVrai();
    });
    
     Ca('teste que l\'on trace un message pour desactiver le mode debug ', function(){    
        var consoleContent = runWithSpyingConsole(function(){
            var model = function(){this.text = 'toto';};
            var mamba = new Mamba(new model(), '<div></div>', {"text" : "div"});
            mamba.render(model);//here is the mistake
        });
        OnAttend(consoleContent.contains('The rendered dom is empty, are you missing something ?')).DEtreVrai();
    });
    
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
    
    Ca('teste que l\'on trace le dom rendu', function(){
        var consoleContent = runWithSpyingConsole(function(){
            var mamba = new Mamba({text : 'toto'}, '<div></div>', {"text" : "div"});
            mamba.render();    
        });
        OnAttend(consoleContent.contains('Rendered dom is :')).DEtreVrai();
    });
    
    Ca('teste le message d\'erreur si on veut binder dans un element de dom non vide', function(){
        try{
            var mamba = new Mamba({text : 'toto'}, '<div><br/></div>', {"text" : "div"});
            mamba.render();    
        }catch(e){
            OnAttend(e.message.contains("The elements found with 'div' css selector are not empty.")).DEtreVrai();
            return;
        }
        OnAttend(false).DEtreVrai();
    });
    
    
    //TODO : var mamba = new Mamba({text : 'toto'}, '<div></div>', {"text" : "div'"}); -> détecter que l'erreur viens de la directive :)
    
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
    //TODO : une fois le rendu fait, déclencher tous les setter pour mettre à jour le modèle avec le dom (notament un select qui se positionne sur le premier élément si la valeur que l'on lui set n'existe pas)
});
	

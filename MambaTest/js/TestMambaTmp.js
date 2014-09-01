Test(function() {   
    
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
    
    Ca('teste que l\'api mamba permet de passer des options', function(){
        var model = {name: 'toto'};
        var template = '<div></div>';
        var directive = {'name' : 'div'};
        var options = {genRefresh: false};
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
        mamba.setOptions({genRefresh: false});
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
        mamba.setOptions({genRefresh: true});
        mamba.render();
         
        OnAttend(root.innerHTML).DEtreEgalA('<div class="anime"><div class="name">SpongeBob SquarePants</div><div class="ep_number">01a</div><div class="ep_name">Help Wanted</div><div class="ep_number">01b</div><div class="ep_name">Reef Blower</div></div><div class="anime"><div class="name">Dragon Ball</div><div class="ep_number">01</div><div class="ep_name">Bulma and Son Goku</div><div class="ep_number">02</div><div class="ep_name">What the...?! No Balls!</div></div>');
        
        model.video.animes[0].episodes[0].number = '1A'; 
        model.video.animes[0].episodes[0].refresh();
        //model.refresh();
         
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
        mamba.setOptions({genRefresh: true});
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
    
    //TODO que se passe-t-il si on appellela fonction refresh sur un modèle supprimé de son parent ?

//TODO demo todo list : 
/*
<input id="newItem" type="text"></input><button id="add">ajouter</button><button id="selAll">tous</button>
<div class="itemCont"><input class="item" type="text"></input><input class="check" type="checkbox"></input><button class="del">suppr</button></div> 
    
{items: [],
 newItem: "",
 add: function(){this.items.push({name: this.newItem, selected: false}); this.newItem = '';},
 del: function(item){this.items.splice(this.items.indexOf(item), 1);},
 selectAll: function(){for(var i=0;i<this.items.length;i++){this.items[i].selected=true;}}}

{"newItem": "#newItem$value->blur",
 "items": {"r00t": ".itemCont",
           "name": ".item$value->keyup",
           "selected": ".check$checked->click"},
 "/add": "#add->click",
 "/del": ".del->click",
 "/selectAll": "#selAll->click"}
  
avec binding par defaut : 
 {"newItem": "#newItem",
 "items": {"r00t": ".itemCont",
           "name": ".item",
           "selected": ".check"},
 "/add": "#add",
 "/del": ".del",
 "/selectAll": "#selAll"}
*/
    
    //TODO faire API mamba : 
        // - var mamba = new Mamba(model, template, directive, anchor);
        // - var mamba = new Mamba({model: model, template: template, directive: directive, anchor: anchor});
        //     -> on peut passer tous les arguments ou pas
        //     -> si template n'est pas du texte mais du dom présent dans la page alors le gérer.
        // - mamba.setModel(model); -> setter
        // - mamba.setTemplate(template); -> setter
        // - mamba.setDirective(directive); -> setter
        // - mamba.setAnchor(anchor); -> setter pour l'endroit ou on va insérerle dom rendu, 
        //     -> peut être un sélecteur css, un élément de dom
        // - var dom = mamba.render();
        // - var dom = mamba.render(model); -> raccourcis pour setModel puis render()
        // - mamba.refresh(model); -> rafraichit le dom pour ce model. -> on peut passer un sous-modèle
        // - mamba.setOptions({mode: manual}) -> pas de binding par defaut
    
    //TODO getter/setter accessor, propertyAccessor
    //TODO valider les model, template binding et anchor et lever une erreur si le type ne correspond pas
    //TODO options de debug pour afficher les structure de données, afficher quand le model est set, quand on fait un refresh...
    //TODO optimiser les render récursif en passant le modèle parent, si c'est aussi celui de l'enfant alors on le garde
    //TODO tester que les events sont ignorés si canReadValueFromDom renvoi false
    //TODO comment faire pour que les refFunction et les customFunction puissent lire le dom
    //TODO implémenter directive prop[] : toto pour brancher directivement les éléments d'un tableau
    //TODO events pour setter par défaut suivant le type de balise html.
    //     ex : input[type='text']=keyup,click, input[type='checkbox']=click
    //TODO binding par défaut suivant le type de balise html. 
    //     ex : input[type='text']=$value, input[type='checkbox']=$checked
    //TODO : réfléchir à l'intégration des raccourcis claviers
    //TODO avoir une méthode pour obtenir l'élément de domcorrespondant à une propriété du modèle getDom(model, 'newItem');
    //-> retourne le dom pour model et en particulier sa propriété 'newItem'. Le second paramètre est optionnel.
    //TODO une fois le binding par défaut implémenté faire marcher ceci : 
    //  <span class="name"></span><input class="name" type="text"></input>, {name: 'toto'}, {"name": ".name"}
    //TODO Mamba api si on appelle refresh avant render alors message d'erreur
    
   /*
    Cas à faire marcher (ou pas ya pas de r00t) : render et/ou binding           
          
    cas 4 :
    
<input type="text" id="prop"></input><span id="prop_"></span><br/>
<input type="text" id="subprop"></input><span id="subprop_"></span>  

{"prop": "toto",
 "sub" : [{"prop" : "tutu"}, {"prop" : "titi"}]}

{"prop" : "#prop$value->blur, #prop_",
 "sub" : {"r00t" : "#subprop, #subprop_", 
          "prop" : "#subprop$value->blur, #subprop_"}}
     
    cas 5 : 
    
<input type="text" id="prop"></input><span id="prop_"></span><br/>
<input type="text" id="subprop"></input><span id="subprop_"></span>

{"prop": "toto",
 "sub" : [{"prop" : "tutu"}, {"prop" : "titi"}]}
 
 {"prop" : "#prop$value->blur, #prop_",
 "sub" : {"prop" : "#subprop$value->blur, #subprop_"}}
 
 
    cas 6 :
    
<input type="text" id="prop"></input><span id="prop_"></span><br/>
<input type="text" id="subprop"></input><span id="subprop_"></span>

[{"prop": "toto",
 "sub" : {"prop" : "tutu"}},
{"prop": "tata",
 "sub" : {"prop" : "titi"}}]
 
 {"prop" : "#prop$value->blur, #prop_",
 "sub" : {"prop" : "#subprop$value->blur, #subprop_"}}

   */    
});
	

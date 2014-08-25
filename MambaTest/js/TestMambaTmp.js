Test(function() {   

    //TODO Mamba api si on appelle refresh avant render alors message d'erreur
    //TODO tester d'autres config
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
        var renderedDom = mamba.render();
        
        model.video.animes.pop();
        var renderedDom = mamba.refresh(model.video);
        mamba.debugNodes();
        //mamba.debugDirective();
        
        var expectedHtml = 
            '<div class="anime"><div class="name">SpongeBob SquarePants</div><div class="ep_number">01a</div><div class="ep_name">Help Wanted</div><div class="ep_number">01b</div><div class="ep_name">Reef Blower</div></div>';        
        OnAttend(new MbaDom(renderedDom).toString()).DEtreEgalA(expectedHtml);
    });
    
     Ca('teste l\'api mamba peut rafraichir un sous-modèle, config 03', function(){
      var root = document.createElement('div');
      root.id = 'root';
      var template = '<div></div><span></span>';
      var model = {name : 'toto', adress: {number: 12}};
      var directive = {"name" : "div", "adress" : {"r00t" : "span", "number" : "span"}};
      var mamba = new Mamba(model, template, directive, root);
      
      mamba.render();
      OnAttend(root.innerHTML).DEtreEgalA('<div>toto</div><span>12</span>');
      
      mamba._mbaTemplate._rootNode.debug(true);
      model.name = 'tutu';
      model.adress.number = 27;
      mamba.refresh(model.adress);
      
      OnAttend(root.innerHTML).DEtreEgalA('<div>toto</div><span>27</span>');
    });
    
    Ca('teste l\'api mamba peut rafraichir un sous-modèle, config 02', function(){
      var root = document.createElement('div');
      root.id = 'root';
      var template = '<div></div><span></span>';
      var model = {name : 'toto', adress: {number: 12}};
      var directive = {"name" : "div", "adress" : {"number" : "span"}};
      var mamba = new Mamba(model, template, directive, root);
      
      mamba.render();
      OnAttend(root.innerHTML).DEtreEgalA('<div>toto</div><span>12</span>');
      
      mamba._mbaTemplate._rootNode.debug(true);
      model.name = 'tutu';
      model.adress.number = 27;
      mamba.refresh(model.adress);
      
      OnAttend(root.innerHTML).DEtreEgalA('<div>toto</div><span>27</span>');
    });
        
    Ca('teste l\'api mamba peut rafraichir un sous-modèle, config 01', function(){
      var root = document.createElement('div');
      root.id = 'root';
      var template = '<div></div><span></span>';
      var model = {name : 'toto', adress: [{number: 12}]};
      var directive = {"name" : "div", "adress" : {"r00t" : "span", "number" : "span"}};
      var mamba = new Mamba(model, template, directive, root);
      
      mamba.render();
      OnAttend(root.innerHTML).DEtreEgalA('<div>toto</div><span>12</span>');
      
      mamba._mbaTemplate._rootNode.debug(true);
      model.name = 'tutu';
      model.adress[0].number = 27;
      mamba.refresh(model.adress[0]);
      
      OnAttend(root.innerHTML).DEtreEgalA('<div>toto</div><span>27</span>');
    });
    
    return;
    
    Ca('teste l\'api mamba avec template texte et sans ancre', function(){
        var model = {name: 'toto'};
        var template = '<span></span>';
        var directive = {name: 'span'};
        var mamba = new Mamba(model, template, directive);
        var renderedDom = domToString(mamba.render());
        
        OnAttend(renderedDom).DEtreEgalA('<span>toto</span>');
    });
    
    Ca('teste l\'api mamba avec template texte et ancre dom', function(){
        var model = {name: 'toto'};
        var template = '<span></span>';
        var directive = {name: 'span'}
        var anchor = document.createElement('div');
        var mamba = new Mamba(model, template, directive, anchor);
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
      
      mamba.render();
      OnAttend(root.innerHTML).DEtreEgalA('<div>toto</div><span>12</span>');
      
      model.name = 'tutu';
      mamba.refresh();
      
      OnAttend(root.innerHTML).DEtreEgalA('<div>tutu</div><span>12</span>');
    });


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
 "items": {"r00t": ".itemCont",Ca('teste l\'api mamba pour refaire un rendu complet avec un autre modèle', function(){
        var stringDom = '<span id="toto"></span><div id="tutu"></div>';
        var dom = stringToDom(stringDom);
        
        OnAttend(dom.length).DEtreEgalA(2);
        OnAttend(dom[0].id).DEtreEgalA('toto');
        OnAttend(dom[1].id).DEtreEgalA('tutu');
    });
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
	

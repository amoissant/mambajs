Test(function() {   
    
    function appendInRoot (root, renderedDom){
            var dom = renderedDom.getDom();
            for(var i=0 ; i<dom.length ; i++){
                root.appendChild(dom[i]);
            }  
        }
      
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
        
        var mamba = new MbaTemplate(html, directive);
        mamba.render(model);
      
        //TODO à écrire
      
        //mamba.getRootNode().debug(true);
        /*var renderedDom = mamba.getRenderedDom();
        var input = mamba.findInRenderedDom('input').getDom(0);
        var span = mamba.findInRenderedDom('span').getDom(0);
        var div = mamba.findInRenderedDom('div').getDom(0);
        var root = document.createElement('div');
        appendInRoot(root, renderedDom);
        
        var expectedHtml = 
            '<input type="text"><span></span><div></div>';
        OnAttend(root.innerHTML).DEtreEgalA(expectedHtml);
        
        input.value = 'toto';
        input.dispatchEvent(new Event('keyup'));
        OnAttend(model.text).DEtreEgalA('toto');
        OnAttend(model.normalizedText).DEtreEgalA('TOTO');*/
      
    }); 

    //TODO si un élément de dom bindé a un setter sur un évenement et qu'une action doit se déclencher sur ce même evènement alors
    // il  faut que le setter soit appelé avant l'action.
    // Gérer aussi quand on fait ctrl-A sur un input avec setter.
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
        // - mamba.refresh(model); -> rafraichit le dom pour ce model.
    //TODO optimiser les render récursif en passant le modèle parent, si c'est aussi celui de l'enfant alors on le garde
    //TODO tester que les events sont ignorés si canReadValueFromDom renvoi false
    //TODO comment faire pour que les refFunction et les customFunction puissent lire le dom
    //TODO implémenter directive prop[] : toto pour brancher directivement les élméments d'un tableau
    
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
	

Test(function() {   
    

    
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
	

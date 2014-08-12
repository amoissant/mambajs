Test(function() {   
    
    function appendInRoot (root, renderedDom){
            var dom = renderedDom.getDom();
            for(var i=0 ; i<dom.length ; i++){
                root.appendChild(dom[i]);
            }  
        }
      
//TODO demo todo list : 
/*
<input id="newItem" type="text"></input><button id="add">ajouter</button><button id="selAll">tous</button>
<div class="itemCont"><input class="item" type="text"></input><input class="check" type="checkbox"></input><button class="del">suppr</button></div> 
    
{items: [],
 newItem: "",
 add: function(){this.items.push({name: this.newItem, selected: true});},
 del: function(item){this.items.splice(this.items.indexOf(item), 1);},
 selectAll: function(){for(var i=0;i<this.items.length;i++){this.items[i].selected=true;}}}

{"newItem": "#newItem$value->blur",
 "items": {"r00t": ".itemCont",
           "name": ".item$value->keyup",
           "selected": ".check$checked->click"},
 "/add": "#add->click",
 "/del": ".del->click",
 "/selectAll": "#selAll->click"}
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
	

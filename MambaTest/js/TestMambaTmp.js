Test(function() {   
    
    Ca('teste le scénario 04', function(){
        var html = 
            '<div class="message"></div><input id="button" type="button"></input>';
        var directive =
            {"messages" : {"r00t" : ".message", "text": ".message"},
             "/addMessage" : "#button->click"};
        var model = 
            {messages: [],
             addMessage: function(){this.messages.push({text: 'toto'});}};
        var mbaTemplate = new MbaTemplate2(html, directive);    
        mbaTemplate.render(model);    
        var dom = mbaTemplate.getRenderedDom();
        OnAttend(dom.toString()).DEtreEgalA('<input id="button" type="button">');
        
        var root = document.createElement('div');
        root.appendChild(dom.getDom(0));
        
        var button = mbaTemplate.findInRenderedDom('#button').getDom(0);
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
        var mamba = new MbaTemplate2(html, directive);
        mamba.render(model);
        mamba.getRootNode().debug(true);
        
        model.video.animes.pop();
        mamba.updateDomForModel(model.video);
        mamba.getRootNode().debug(true);
        
        var renderedDom = mamba.getRenderedDom();
        var expectedHtml = 
            '<div class="anime"><div class="name">SpongeBob SquarePants</div><div class="ep_number">01a</div><div class="ep_name">Help Wanted</div><div class="ep_number">01b</div><div class="ep_name">Reef Blower</div></div>';        
        OnAttend(renderedDom.toString()).DEtreEgalA(expectedHtml);
        console.log(renderedDom);
    });
    
    Ca('test que la mise à jour du sous-modèle fonctionne avec un modèle incomplet', function(){
        var data = getHtmlDirectiveAndModelForManualDomUpdate();
        var html = data.html;
        var directive = data.directive;
        var model = data.model;
        model.video.animes[1].episodes = null;
        var mamba = new MbaTemplate2(html, directive);
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
        var mamba = new MbaTemplate2(html, directive);
        mamba.render(model);
        try{
            mamba.updateDomForModel({});
        }
        catch(e){
            OnAttend(e.code).DEtreEgalA(42);
            return;
        }
        OnAttend(false).DEtreVrai();
    });
    
    Ca('test la mise à jour manuelle du dom pour un modèle', function(){
        var data = getHtmlDirectiveAndModelForManualDomUpdate();
        var html = data.html;
        var directive = data.directive;   
        var model = data.model;
        var mamba = new MbaTemplate2(html, directive);
        mamba.render(model);
        //mamba.getRootNode().debug(true);
        var renderedDom = mamba.getRenderedDom();
        var expectedHtml = 
            '<div class="anime"><div class="name">SpongeBob SquarePants</div><div class="ep_number">01a</div><div class="ep_name">Help Wanted</div><div class="ep_number">01b</div><div class="ep_name">Reef Blower</div></div><div class="anime"><div class="name">Dragon Ball</div><div class="ep_number">01</div><div class="ep_name">Bulma and Son Goku</div><div class="ep_number">02</div><div class="ep_name">What the...?! No Balls!</div></div>';        
        OnAttend(renderedDom.toString()).DEtreEgalA(expectedHtml);
        
        var wantedModel = model.video.animes[1].episodes[0];
        wantedModel.name  = 'toto';
        model.video.animes[1].episodes[1].name = 'won\'t be rendered';
        mamba.updateDomForModel(wantedModel);
        //mamba.getRootNode().debug(true);
        
        renderedDom = mamba.getRenderedDom();
        expectedHtml = 
            '<div class="anime"><div class="name">SpongeBob SquarePants</div><div class="ep_number">01a</div><div class="ep_name">Help Wanted</div><div class="ep_number">01b</div><div class="ep_name">Reef Blower</div></div><div class="anime"><div class="name">Dragon Ball</div><div class="ep_number">01</div><div class="ep_name">toto</div><div class="ep_number">02</div><div class="ep_name">What the...?! No Balls!</div></div>';  
        OnAttend(renderedDom.toString()).DEtreEgalA(expectedHtml);
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
        var accessorChain = new MbaAccessorChain().prependAccessor(new MbaFieldAccessor2('toto'));
        accessorChain.prependAccessor(new MbaFieldAccessor2('titi'));
        accessorChain.prependAccessor(new MbaFieldAccessor2('tata'));
        var model = {tata: [{titi: {toto: 'tutu1'}},
                            {titi: {toto: 'tutu2'}}]};
        
        var inputRoute = [0, 1, 0];
        var modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        var lastModel = accessorChain.getLastModel();
        OnAttend(lastModel).DEtreEgalA(model.tata[1].titi);
    });
    
    Ca('teste la récupération du dernier modèle pour une route partielle', function(){
        var accessorChain = new MbaAccessorChain().prependAccessor(new MbaFieldAccessor2('toto'));
        accessorChain.prependAccessor(new MbaFieldAccessor2('titi'));
        accessorChain.prependAccessor(new MbaFieldAccessor2('tata'));
        var model = {tata: [{titi: {toto: 'tutu1'}},
                            {titi: {toto: 'tutu2'}}]};
        
        var inputRoute = [0, 1];
        var modelValue = accessorChain.getModelValueFromRoute(model, new MbaRoute(inputRoute));
        var lastModel = accessorChain.getLastModel();
        OnAttend(lastModel).DEtreEgalA(model.tata[1].titi);
    }); 
    
     Ca('teste la récupération du dernier modèle pour une route avec plusieurs null', function(){
        var accessorChain = new MbaAccessorChain();
        accessorChain.prependAccessor(new MbaFieldAccessor2('toto'));
        accessorChain.prependAccessor(new MbaFieldAccessor2('titi'));
        accessorChain.prependAccessor(new MbaFieldAccessor2('tata'));
        
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
        accessorChain.prependAccessor(new MbaFieldAccessor2('toto'));
        accessorChain.prependAccessor(new MbaFieldAccessor2('titi'));
        accessorChain.prependAccessor(new MbaFieldAccessor2('tata'));
        
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
        accessorChain.prependAccessor(new MbaFieldAccessor2('toto'));
        accessorChain.prependAccessor(new MbaFieldAccessor2('titi'));
        accessorChain.prependAccessor(new MbaFieldAccessor2('tata'));
        
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
        
        var mamba = new MbaTemplate2(html, directive);
        mamba.render(model);
        //mamba.getRootNode().debug(true);
        var dom = mamba.getRenderedDom();
        var expectedHtml = '<input placeholder="taper un message ici" id="message" type="text"><input id="add" value="Ajouter" type="button"><input id="delete" value="Vider" type="button">';
        OnAttend(dom.toString()).DEtreEgalA(expectedHtml);   
        
        var messageInput = mamba.findInRenderedDom('#message').getDom(0);
        var addBtn = mamba.findInRenderedDom('#add').getDom(0);
        var deleteBtn = mamba.findInRenderedDom('#delete').getDom(0);
        
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
    
    //TODO faire méthode MbaTemplate2.appendRenderedDomIn('body');
    //TODO tester demo2 et demo3
    //TODO optimiser les render récursif en passant le modèle parent, si c'est aussi celui de l'enfant alors on le garde
    //TODO tester que les events sont ignorés si canReadValueFromDom renvoi false
    //TODO comment faire pour que les refFunction et les customFunction puissent lire le dom
    //TODO implémenter directive prop[] : toto pour brancher directivement les élméments d'un tableau
    //TODO ne pas etre obligé de référencer le parent pour la suppression d'un élément dans une collections
     /*var directive = 
        {"messages": 
            {"r00t": ".messages", 
             "text": ".messages", 
             "/remove" : ".messages->click"},
         "newMessage": "#message$value->blur",
         "/add": "#addBtn->click", 
         "/empty": "#emptyBtn->click"
         "/remove" : ".messages->click"}; -> ca doit marcher !*/
    //TODO : faire une classe dédiée à la création des selecteurs (utilisés pour AddActionBindingIntoNodesVisitor)
    /* -> gérer quand on a des selecteurs multiples : 
        {"r00t"   : ".ep_number, .ep_name",
         "number" : ".ep_number",
         "name"   : ".ep_name"}
    */

/*
     prop: toto                     -> ajoute la valeur de prop dans le innerHTML 
     prop: toto@attr                -> si prop est non booléenne mets la valeur de prop dans l'attribut
                                    -> si prop est booléenne 
                                        - prop vaut vrai alors on ajoute l'attribut sans valeur (norme HTML)
                                        - prop vaut faux alors on supprime l'attribut (norme HTML)
     prop: toto@class               -> ajoute la valeur de prop dans l'attribut class, si prop boolean alors erreur
     prop: toto@class(star)         -> si prop est booleenne 
                                        - si prop vaut vrai alors on ajoute la classe 'star' à toto
                                        - si prop vaut faux alors on enlève la classe 'star' à toto
                                    -> si prop non booléenne alors erreur
     prop: toto$foo                 -> met la valeur de prop dans la propriété 'foo' du l'élément de dom
     prop: toto$:nom_fonction       -> execute la fonction paramétrée 'nom_fonction' à chaque rendu
     prop: toto${function(){..}}    -> execute la fonction anonyme à chaque rendu
     prop: toto->blur               -> appelle le setter de name seulement quand on perd le focus sur toto
     prop: toto->(mouseover, blur)  -> appelle le setter de name seulement pour les deux évènements mouseover et blur
     prop: toto@class->blur         -> exemple avec attribut et event 
     /doSomething : toto->click     -> appelle la fonction doSomething du modèle quand on click sur toto
    
    - Les evènements permettent de préciser quand mettre à jour le modèle mais ne sont pas applicables pour toutes les fonctions
      de rendu : 
      prop: toto->blur         quand on perd le focus sur toto alors on met à jour prop dans le modèle avec la valeur du dom
      prop: toto@checked->blur quand on perd le focus sur toto alors on met à jour prop dans le modèle avec la valeur du dom 
                               (attention ici on va pas chercher dans les attributs mais dans la fonction checked)
      prop: toto@class->blur   ne veut rien dire, il n'y a rien à mettre à jour.
      
      
    - Principe de base pour les attributs : si une valeur du modèle est bindé sur un attributs alors quand le modèle change
      on met à jour l'attribut dans le dom, sur l'évènement (->event) indiqué, on met à jour la valeur du modèle en fonction du dom.
      
    - Cas particulier pour les input et peut-etre d'autres : 
      Les valeurs pour 'checked', 'selected', 'value' sont disponibles dans les objets js correspondants au éléments de dom mais 
      pas dans les atrributs et leurs valeur. Il faut étendre les fonctions de rendu et de mise à jour du dom pour :
      - Quand on veut faire le rendu, on met à jour le dom avec la valeur du modèle puis on met à jour l'objet js avec la valeur.
      - Quand on veut mettre à jour le modèle à partir du dom, on met à jour le dom en fonction dela valeur dans l'objet js puis
        on met à jour le modèle par rapport au dom.
    
    pour le nom des events, on prend tous les events natifs cf http://www.w3schools.com/tags/ref_eventattributes.asp
    avec le 'on' au début optionel
    
    */
    
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
    
/*
<div class="anime">
    <div class="name"></div>
    <div class="ep_number"></div>
    <div class="ep_name"></div>
</div>

{animes: {name: 'SpongeBob SquarePants', 
          episodes: [{number: '01a', name: 'Help Wanted'},
                     {number: '01b', name: 'Reef Blower'}]}}

{"animes" : 
    {"name" : ".name",
     "episodes" : 
       {"r00t"   : ".ep_number, .ep_name",
        "number" : ".ep_number",
        "name"   : ".ep_name"}}}

var visitor = new GetNodesAndAccessorsVisitor(); mbaTemplate.getRootNode().accept(visitor); visitor.debug();
*/
});
	

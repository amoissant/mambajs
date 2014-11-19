Test(function() {   
 
    MBA_DI.bind(DirectiveValueParser).to(DirectiveValueParser);
    
    function renderIntoRoot(model, html, directive){
        var root = document.createElement('div');
        root.innerHTML = html;
        var mamba = new Mamba(model, root.childNodes, directive);
        mamba.setOptions({debug: false});
        mamba.render(); 
        return root;
    }
    
    function runWithSpyingConsole(somethingToRun){
        var consoleContent = [];
        var consoleLog = console.log;
        var restoreConsoleLog = function(){
            console.log = consoleLog;
        };
        var spyConsoleLog = function(){
            pushAllOld(consoleContent, arguments);
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
    
    
    
    /*<button>v</button>
<div class="option"></div>

{options : [{code: 1, lib: 'toto'}, {code: 2, lib: 'tutu'}, {code:3, lib: 'titi'}],
 visible : false,
 toggle: function(){this.visible = !this.visible;}
}
    
    {"visible" : ".option@class(visible)",
 "options" : {"r00t" : ".option", 
              "code" : ".option@value", 
              "lib" : ".option"},
 "/toggle": "button->click"}
    */
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
    //TODO rendre le message plus explicite quand on a oublié une r00t
    //TODO : refacto MbaNodeBinding.updateDom
    //TODO : refacto IntegrateBindingAndDirectiveNodesVisitor.visitTemplateBinding
});
	

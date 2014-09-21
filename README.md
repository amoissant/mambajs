<img src="logo/mamba-logo-48.png"></img><span>Mamba-js</span>
=======

A javascript library for templating and binding.

    Construction de la directive : 
    - La directive suit la structure du modèle est est composée de binding et/ou de sous-directives. 
    - Pour chaque sous-modèle de type tableau il faut préciser l'élément html à répéter grâce à 'r00t'.
    exemple :
    var model =  
        {"selection" : "tata", 
         "options" : [{"val" : "toto"},
                       {"val" : "tutu"}, 
                       {"val" : "tata"}, 
                       {"val" : "titi"}]};
    var directive = 
        {"selection" : "select$value",
         "options" : {"r00t" : "option", 
                      "val" : "option"}};

    Bindings disponibles : 
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

    Les evènements permettent de préciser quand mettre à jour le modèle exemple : 
    prop: toto->blur         quand on perd le focus sur toto alors on met à jour prop dans le modèle avec la valeur du dom
    prop: toto$checked->blur quand on perd le focus sur toto alors on met à jour prop dans le modèle avec la valeur du dom 
    prop: toto@class->blur   ne fera rien sauf si on a modifié manuallement la classe avant le blur
    
    Pour le nom des events, on prend tous les events natifs cf http://www.w3schools.com/tags/ref_eventattributes.asp
    sans le 'on' au début.


Test(function() {   
    
    Ca('teste que l\'on supprime un élément à la racine de son parent si son modèle est supprimé', function(){
        var html = '<div class="test"></div>';
        var model = [{text: 'toto'}, {text: 'tutu'}];
        var directive = {r00t: '.test', text: '.test'};
        var mamba = new MbaTemplate2(html, directive);
        mamba.render(model);
        var root = document.createElement('div');
        var renderedDom = mamba.getRenderedDom().getDom();
        for(var i=0 ; i<renderedDom.length ; i++){
            root.appendChild(renderedDom[i]);
        }
        OnAttend(root.innerHTML).DEtreEgalA('<div class="test">toto</div><div class="test">tutu</div>');
        
        model.pop();
        mamba.render(model);
        OnAttend(root.innerHTML).DEtreEgalA('<div class="test">toto</div>');
    });
    
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
        //mamba.getRootNode().debug(true);
        
        model.video.animes.pop();
        mamba.updateDomForModel(model.video);
        //mamba.getRootNode().debug(true);
        
        var renderedDom = mamba.getRenderedDom();
        var expectedHtml = 
            '<div class="anime"><div class="name">SpongeBob SquarePants</div><div class="ep_number">01a</div><div class="ep_name">Help Wanted</div><div class="ep_number">01b</div><div class="ep_name">Reef Blower</div></div>';        
        OnAttend(renderedDom.toString()).DEtreEgalA(expectedHtml);
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
    
    //TODO remplacer par la fonction d'api qui insert le renderedDom dans un selecteur ou un élément de dom
    function appendInRoot (root, renderedDom){
            var dom = renderedDom.getDom();
            for(var i=0 ; i<dom.length ; i++){
                root.appendChild(dom[i]);
            }  
        }
    
    Ca('teste le scénario de la demo 02', function(){
        function Message(text, parent){
            this.text = text;
            this._parent = parent;
            this.remove = function(){
                this._parent.remove(this);
            }
        }
    
        function MessageCollection(){
            this.messages = [];
            this.newMessage = '';
            this.add = function(){
                this.messages.push(new Message(this.newMessage, this));
                this.newMessage = '';
            };
            this.remove = function(message){
                var index = this.messages.indexOf(message);
                this.messages.splice(index, 1);
                this.populate();
            };
            this.empty = function(){
                this.messages = [];
            };
            this.populate = function(){
                var event = new CustomEvent('populate');
                event.model = this;
                document.dispatchEvent(event);
            };
        }        
    
        var html = 
            '<div class="messages"></div>'+
            '<input id="message" type="text" placeholder="taper un message ici"></input>'+
            '<input id="addBtn" type="button" value="Ajouter"></input>'+
            '<input id="emptyBtn" type="button" value="Vider"></input>';
        
        var model = new MessageCollection();

        var directive = 
            {"messages": 
                {"r00t": ".messages", 
                 "text": ".messages", 
                 "/remove" : ".messages->click"},
             "newMessage": "#message$value->blur",
             "/add": "#addBtn->click", 
             "/empty": "#emptyBtn->click"};
        
        var mamba = new MbaTemplate2(html, directive);
        mamba.render(model);
        //mamba.getRootNode().debug(true);
        var renderedDom = mamba.getRenderedDom();
        var input = mamba.findInRenderedDom('#message').getDom(0);
        var add = mamba.findInRenderedDom('#addBtn').getDom(0);
        var empty = mamba.findInRenderedDom('#emptyBtn').getDom(0);//TODO faire une fonction qui retourne un élément de dom
        var root = document.createElement('div');
        appendInRoot(root, renderedDom);
        
        document.addEventListener('populate', function(e){
            mamba.updateDomForModel(e.model);
        });
        
        var expectedHtml = 
            '<input id="message" placeholder="taper un message ici" type="text"><input id="addBtn" value="Ajouter" type="button"><input id="emptyBtn" value="Vider" type="button">';
        OnAttend(root.innerHTML).DEtreEgalA(expectedHtml);
        
        input.value = 'toto';
        input.dispatchEvent(new Event('blur'));
        OnAttend(model.newMessage).DEtreEgalA('toto');
        add.dispatchEvent(new Event('click'));
        OnAttend(model.messages.length).DEtreEgalA(1);
        var expectedHtml = 
            '<div class="messages">toto</div><input id="message" placeholder="taper un message ici" type="text"><input id="addBtn" value="Ajouter" type="button"><input id="emptyBtn" value="Vider" type="button">';
        OnAttend(root.innerHTML).DEtreEgalA(expectedHtml);
        
        input.value = 'tutu';
        input.dispatchEvent(new Event('blur'));
        OnAttend(model.newMessage).DEtreEgalA('tutu');
        add.dispatchEvent(new Event('click'));
        OnAttend(model.messages.length).DEtreEgalA(2);
        expectedHtml = 
            '<div class="messages">toto</div><div class="messages">tutu</div><input id="message" placeholder="taper un message ici" type="text"><input id="addBtn" value="Ajouter" type="button"><input id="emptyBtn" value="Vider" type="button">';
        OnAttend(root.innerHTML).DEtreEgalA(expectedHtml);
        
        input.value = 'titi';
        input.dispatchEvent(new Event('blur'));
        OnAttend(model.newMessage).DEtreEgalA('titi');
        add.dispatchEvent(new Event('click'));
        OnAttend(model.messages.length).DEtreEgalA(3);
        expectedHtml = 
            '<div class="messages">toto</div><div class="messages">tutu</div><div class="messages">titi</div><input id="message" placeholder="taper un message ici" type="text"><input id="addBtn" value="Ajouter" type="button"><input id="emptyBtn" value="Vider" type="button">';
        OnAttend(root.innerHTML).DEtreEgalA(expectedHtml);
        
        var tutu = root.childNodes[1];
        tutu.dispatchEvent(new Event('click'));
        OnAttend(model.messages.length).DEtreEgalA(2);
        expectedHtml = 
            '<div class="messages">toto</div><div class="messages">titi</div><input id="message" placeholder="taper un message ici" type="text"><input id="addBtn" value="Ajouter" type="button"><input id="emptyBtn" value="Vider" type="button">';
        OnAttend(root.innerHTML).DEtreEgalA(expectedHtml);
        
        empty.dispatchEvent(new Event('click'));       
        OnAttend(model.messages.length).DEtreEgalA(0);
        expectedHtml = 
            '<input id="message" placeholder="taper un message ici" type="text"><input id="addBtn" value="Ajouter" type="button"><input id="emptyBtn" value="Vider" type="button">';
        OnAttend(root.innerHTML).DEtreEgalA(expectedHtml);
    });
    
    Ca('teste le scénario de la demo 03', function(){
        function Message(text, parent){
            this.text = text;
        }
        
        function MessageCollection(){
            this.messages = [];
            this.newMessage = '';
            this.add = function(){
                this.messages.push(new Message(this.newMessage, this));
                this.newMessage = '';
            };
            this.remove = function(message){
                var index = this.messages.indexOf(message);
                this.messages.splice(index, 1);
            };
            this.empty = function(){
                this.messages = [];
            };
        }
                
        var html = 
            '<div class="messages"></div>'+
            '<input id="message" type="text" placeholder="taper un message ici"></input>'+
            '<input id="addBtn" type="button" value="Ajouter"></input>'+
            '<input id="emptyBtn" type="button" value="Vider"></input>';
        
        var model = new MessageCollection();
        
        var directive = 
            {"messages": 
             {"r00t": ".messages", 
              "text": ".messages"},
             "newMessage": "#message$value->blur",
             "/add": "#addBtn->click", 
             "/empty": "#emptyBtn->click", 
             "/remove": ".messages->click"};
        
        var mamba = new MbaTemplate2(html, directive);
        mamba.render(model);
        //mamba.getRootNode().debug(true);
        var renderedDom = mamba.getRenderedDom();
        var input = mamba.findInRenderedDom('#message').getDom(0);
        var add = mamba.findInRenderedDom('#addBtn').getDom(0);
        var empty = mamba.findInRenderedDom('#emptyBtn').getDom(0);//TODO faire une fonction qui retourne un élément de dom
        var root = document.createElement('div');
        appendInRoot(root, renderedDom);
        
        document.addEventListener('populate', function(e){
            mamba.updateDomForModel(e.model);
        });
        
        var expectedHtml = 
            '<input id="message" placeholder="taper un message ici" type="text"><input id="addBtn" value="Ajouter" type="button"><input id="emptyBtn" value="Vider" type="button">';
        OnAttend(root.innerHTML).DEtreEgalA(expectedHtml);
        
        input.value = 'toto';
        input.dispatchEvent(new Event('blur'));
        OnAttend(model.newMessage).DEtreEgalA('toto');
        add.dispatchEvent(new Event('click'));
        OnAttend(model.messages.length).DEtreEgalA(1);
        var expectedHtml = 
            '<div class="messages">toto</div><input id="message" placeholder="taper un message ici" type="text"><input id="addBtn" value="Ajouter" type="button"><input id="emptyBtn" value="Vider" type="button">';
        OnAttend(root.innerHTML).DEtreEgalA(expectedHtml);
        
        input.value = 'tutu';
        input.dispatchEvent(new Event('blur'));
        OnAttend(model.newMessage).DEtreEgalA('tutu');
        add.dispatchEvent(new Event('click'));
        OnAttend(model.messages.length).DEtreEgalA(2);
        expectedHtml = 
            '<div class="messages">toto</div><div class="messages">tutu</div><input id="message" placeholder="taper un message ici" type="text"><input id="addBtn" value="Ajouter" type="button"><input id="emptyBtn" value="Vider" type="button">';
        OnAttend(root.innerHTML).DEtreEgalA(expectedHtml);
        
        input.value = 'titi';
        input.dispatchEvent(new Event('blur'));
        OnAttend(model.newMessage).DEtreEgalA('titi');
        add.dispatchEvent(new Event('click'));
        OnAttend(model.messages.length).DEtreEgalA(3);
        expectedHtml = 
            '<div class="messages">toto</div><div class="messages">tutu</div><div class="messages">titi</div><input id="message" placeholder="taper un message ici" type="text"><input id="addBtn" value="Ajouter" type="button"><input id="emptyBtn" value="Vider" type="button">';
        OnAttend(root.innerHTML).DEtreEgalA(expectedHtml);
        
        var tutu = root.childNodes[1];
        tutu.dispatchEvent(new Event('click'));
        OnAttend(model.messages.length).DEtreEgalA(2);
        expectedHtml = 
            '<div class="messages">toto</div><div class="messages">titi</div><input id="message" placeholder="taper un message ici" type="text"><input id="addBtn" value="Ajouter" type="button"><input id="emptyBtn" value="Vider" type="button">';
        OnAttend(root.innerHTML).DEtreEgalA(expectedHtml);
        
        empty.dispatchEvent(new Event('click'));       
        OnAttend(model.messages.length).DEtreEgalA(0);
        expectedHtml = 
            '<input id="message" placeholder="taper un message ici" type="text"><input id="addBtn" value="Ajouter" type="button"><input id="emptyBtn" value="Vider" type="button">';
        OnAttend(root.innerHTML).DEtreEgalA(expectedHtml);
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
	

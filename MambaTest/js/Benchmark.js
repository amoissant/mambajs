function Benchmark (modelSize, anchor){
    
    this.messages = [];
    this._benchModel;
    this._benchModelSize;
    this._benchHtml;
    this._benchDirective;
    this._benchMamba;
    this._benchDom;
    this._anchor;
    this.genRefresh;
    
    this.init(modelSize, anchor);
};

Benchmark.prototype.init = function(modelSize, anchor){
    this._benchModelSize = modelSize;
    this._anchor = anchor;
    this.genRefresh = false;
    this.createBenchModel();
    this.createBenchHtml();
    this.createBenchDirective();
};

Benchmark.prototype.createBenchModel = function(){
    var tabContent = [];
    for(var i=0 ; i<this._benchModelSize; i++){
        tabContent.push({id : i, name : "toto", town : "merignac", country : "france"});
    }
    this._benchModel = {toto: {tutu: {tata: {tete: tabContent}}}};    
};

Benchmark.prototype.createBenchHtml = function(){
    this._benchHtml = 
        '<table><thead><tr><th>ID</th><th>NAME;</th><th>TOWN</th><th>COUNTRY</th></tr></thead><tbody><tr id="person"><td id="id"></td><td id="name"></td><td id="town"></td><td id="country"></td></tr></tbody></table>';
};

Benchmark.prototype.createBenchDirective = function(){
    this._benchDirective = 
        {toto: {tutu: {tata: {tete: {r00t : "#person",
                                     id : "#id",
                                     name : "#name",
                                     town : "#town",
                                     country : "#country"}}}}};
};

Benchmark.prototype.timeRender = function(){
    var begin = new Date();
    this._benchMamba = new Mamba(this._benchModel, this._benchHtml, this._benchDirective, this._anchor);
    this._benchMamba.setOptions({genRefresh: this.genRefresh});
    this._benchDom = this._benchMamba.render();
    var end = new Date();
    var message = {text : 'time for render '+this._benchModelSize+' elements : '+this.getTimeInSeconds(begin, end)+'s.'};
    this.messages.push(message);    
};

Benchmark.prototype.getTimeInSeconds = function(begin, end){
    return (end.getTime()-begin.getTime())/1000;    
};

Benchmark.prototype.updateBenchModel = function(){
    var tabContent = this._benchModel.toto.tutu.tata.tete;    
    for(var i=0 ; i<tabContent.length ; i++){
        tabContent[i].id += Math.floor(Math.random()*10);   
    }  
};

Benchmark.prototype.timeUpdate = function(){
    this.updateBenchModel();
    var begin = new Date();
    this._benchMamba.setOptions({genRefresh: this.genRefresh});
    this._benchDom = this._benchMamba.render();
    var end = new Date();
    var message = {text : 'time for update '+this._benchModelSize+' elements : '+this.getTimeInSeconds(begin, end)+'s.'};
    this.messages.push(message);
};

Benchmark.prototype.timeSearchForModel = function(){
    var begin = new Date();
    var model = this._benchModel.toto.tutu.tata.tete[this._benchModelSize-1];
    model.id = 'i have been updated manually';
    this._benchMamba.refresh(model); 
    var end = new Date();
    var message = {text : 'worst time to find a model : '+this.getTimeInSeconds(begin, end)+'s.'};
    this.messages.push(message);
};

Benchmark.prototype.getRenderedDom = function(){
    return this._benchDom;
};


    
 //disable checkType function called everywhere -> x20 perfs
 checkType = function(){};
 
 var bench = new Benchmark(1000, document.getElementById('array'));
 var html = 
     '<div class="message"></div>'
        +'<input id="render" type="button" value="Render">'
        +'<input id="update" type="button" value="Update">'
        +'</input><input id="search" type="button" value="Search">'
        +'</input><input id="gen_refresh" type="checkbox"></input>generate refresh method'
    +'<div id="array"></div>';

 var directive = {"messages" : {"r00t" : ".message", "text": ".message"},
                  "genRefresh" : "#gen_refresh$checked->click",
                  "/timeRender" : "#render->click",
                  "/timeUpdate" : "#update->click",
                  "/timeSearchForModel" : "#search->click"};
 var mamba = new Mamba(bench, html, directive, document.body);
 mamba.render();
 mamba.debugNodes();



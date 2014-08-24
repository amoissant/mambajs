function Benchmark (modelSize){
    
    this.messages = [];
    this._benchModel;
    this._benchModelSize;
    this._benchHtml;
    this._benchDirective;
    this._benchTemplate;
    this.libUpdateBtn;
    
    this.init(modelSize);
};

Benchmark.prototype.init = function(modelSize){
    this._benchModelSize = modelSize;
    this.libUpdateBtn = "Update";
    this.libSearchBtn  = "Search";
    this.createBenchModel();
    this.createBenchHtml();
    this.createBenchDirective();
    this.timeRender();
};

Benchmark.prototype.createBenchModel = function(){
    var tabContent = [];
    for(var i=0 ; i<this._benchModelSize; i++){
        tabContent.push({id : i, 
                         name : "toto", 
                         town : "merignac", 
                         country : "france"});
    }
    this._benchModel = 
        {toto: {tutu: {tata: {tete: tabContent}}}};    
};

Benchmark.prototype.createBenchHtml = function(){
    this._benchHtml = 
        '<table><thead><tr><th>ID</th><th>NAME</th><th>TOWN</th><th>COUNTRY</th></tr></thead><tbody><tr id="person"><td id="id"></td><td id="name"></td><td id="town"></td><td id="country"></td></tr></tbody></table>';
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
    this._benchTemplate = new MbaTemplate(this._benchHtml, this._benchDirective);
    this._benchTemplate.render(this._benchModel);
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
    this._benchTemplate.render(this._benchModel);
    var end = new Date();
    var message = {text : 'time for update '+this._benchModelSize+' elements : '+this.getTimeInSeconds(begin, end)+'s.'};
    this.messages.push(message);
};

Benchmark.prototype.timeSearchForModel = function(){
    var begin = new Date();
    var model = this._benchModel.toto.tutu.tata.tete[this._benchModelSize-1];
    model.id = 'i have been updated manually';
    this._benchTemplate.updateDomForModel(model); 
    var end = new Date();
    var message = {text : 'worst time to find a model : '+this.getTimeInSeconds(begin, end)+'s.'};
    this.messages.push(message);
};

Benchmark.prototype.getRenderedDom = function(){
    return this._benchTemplate.getRenderedDom().getElements();
};


    
 //disable checkType function called everywhere -> x20 perfs
 checkType = function(){};
 
 var bench = new Benchmark(1000);
 var html = 
     '<div class="message"></div><input id="update" type="button"></input><input id="search" type="button"></input><div id="array"></div>';
 var directive = {"messages" : {"r00t" : ".message", "text": ".message"},
                  "libUpdateBtn" : "#update@value",
                  "libSearchBtn" : "#search@value",
                  "/timeUpdate" : "#update->click",
                  "/timeSearchForModel" : "#search->click"};
 var mbaTemplate = new MbaTemplate(html, directive);    
 mbaTemplate.render(bench);
 mbaTemplate.getRootNode().debug(true);
 
 var benchDom = mbaTemplate.getRenderedDom().getElements();
 for(var i=0 ; i<benchDom.length ; i++){
     document.body.appendChild(benchDom[i]);
 }
 
 var renderedDom = bench.getRenderedDom();
 var arrayDiv = document.getElementById('array');
 for(var i=0 ; i<renderedDom.length ; i++){
     arrayDiv.appendChild(renderedDom[i]);
 }  
 
 var updateBtn = document.getElementById('update');
 updateBtn.addEventListener('click', function(){
     mbaTemplate.getRootNode().debug(true);
 });


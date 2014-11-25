function MbaAccessorChain(){
    
    this._accessors;
    this._lastRoute;
    this._lastModel;
    this._completeRoutes;
    this._cachedModelValues = {};
    this._modelHasNotMember;
    this._modelValue; 
    
    MbaAccessorChain.prototype.initFromMemberChain = function(memberChain){
        checkType(memberChain, 'array', 'string');
        this._accessors = [];
        this._completeRoutes = {};
        this._beforeEndRoutes = {};
        this.createAccessors(memberChain);
        return this;
    };
    
    MbaAccessorChain.prototype.initFromAccessorChain = function(accessorChain){
        checkType(accessorChain, MbaAccessorChain);
        this._accessors = [];
        this._completeRoutes = {};
        this._beforeEndRoutes = {};
        PushAll(accessorChain.getAccessors()).into(this._accessors);
        return this;
    };
    
    MbaAccessorChain.prototype.initOld = function(){
        this._accessors = [];
        this._completeRoutes = {};
        this._beforeEndRoutes = {};
    };
    
    MbaAccessorChain.prototype.getAccessors = function(){
        return this._accessors;
    };
    
    MbaAccessorChain.prototype.getAccessorCount = function(){
        return this._accessors.length;
    };
    
    MbaAccessorChain.prototype.getAccessor = function(index){
        checkType(index, 'number');
        return this._accessors[index];
    };
    
    MbaAccessorChain.prototype.getLastRoute = function(){
        //TODO on peut optimiser en mettant du cache si ca vaut le coup 
        return this._lastRoute;
    };
    
    MbaAccessorChain.prototype.setLastRoute = function(route){
        checkType(route, MbaRoute);
        this._lastRoute = route;
    }
    
    MbaAccessorChain.prototype.getLastModel = function(){
        return this._lastModel;  
    };
    
    MbaAccessorChain.prototype.setLastModel = function(model){
        this._lastModel = model;
    };
    
    MbaAccessorChain.prototype.modelHasNotMember = function(){
        return this._modelHasNotMember;
    };
    
    MbaAccessorChain.prototype.getSize = function(){
        return this._accessors.length;
    };
    
    MbaAccessorChain.prototype.getId = function(){
        return this.toStringWithModel();
    };
    
    MbaAccessorChain.prototype.createAccessors = function(memberChain){
        checkType(memberChain, 'array', 'string');
        for(var i=0 ; i<memberChain.length ; i++){
            this.appendAccessor(new MbaAccessor(memberChain[i]));
        }   
    };
    
    MbaAccessorChain.prototype.prependAccessor = function(accessor){
        checkType(accessor, MbaAccessor);
        this._accessors.splice(0, 0, accessor);
        return this;
    };
    
    MbaAccessorChain.prototype.appendAccessor = function(accessor){
        checkType(accessor, MbaAccessor);
        this._accessors.push(accessor);
    };
    
    MbaAccessorChain.prototype.removeLastAccessor = function(){
        this._accessors.pop();
    };
    
    MbaAccessorChain.prototype.prependAll = function(accessorChain){
        checkType(accessorChain, MbaAccessorChain);
        this._accessors = accessorChain.getAccessors().concat(this._accessors);
    };
     
    MbaAccessorChain.prototype.shortenRoute = function(route){
        checkType(route, MbaRoute);
        var maxRouteLength = this.getAccessorCount()+1;
        while(route.length > maxRouteLength){
            route.removeLastIndex();
        }
        return route;
    };
     
    MbaAccessorChain.prototype.hasAccessors = function(){
        return this._accessors.length > 0;
    };
    
    //TODO tester cette méthode et factoriser du code avec writefromroute
    MbaAccessorChain.prototype.getModelFromRoute = function(model, route){
        checkType(route, MbaRoute);
        this._lastRoute = new MbaRoute();
        this._lastModel = model;
        if(this.hasAccessors())
            this._lastModel = this.getModelValueFromNonEmptyRoute(route, this.getAccessorCount());

        if(route.length > this.getAccessorCount())
            this.getModelForRouteAtIndex(route, route.length-1);

        return this._lastModel;
    };
    
    MbaAccessorChain.prototype.getModelValueFromRoute = function(model, route){
        checkType(route, MbaRoute);
        this._lastRoute = new MbaRoute();
        this._lastModel = model;
        if(this.hasAccessors())
            return this.getModelValueFromNonEmptyRoute(route, this.getAccessorCount());
        else
            return model;
    }
    
    MbaAccessorChain.prototype.getModelValueFromNonEmptyRoute = function(route, nbAccessorThrought){
        checkType(route, MbaRoute);
        checkType(nbAccessorThrought , 'number');
        this._modelValue = this._lastModel;
        var accessorCount = this.getAccessorCount();
        for(var i=0 ; i<nbAccessorThrought ; i++){
            this.getModelValueForAccessorAtIndex(route, i);
            if(this._modelValue == null)
                break;
        }
        return this._modelValue;
    };
    
    MbaAccessorChain.prototype.getModelValueForAccessorAtIndex = function(route, index){
        checkType(route, MbaRoute);
        checkType(index, 'number');
        this._lastModel = this._modelValue;
        if(route.isNullAtIndex(index)){
            this.readWithAccessorForModel(route, index);
        }
        else{
            this.getModelForRouteAtIndex(route, index);
            this.readWithAccessor(index);
        }
        this._lastRoute.appendIndex(route[index]);
    };
    
    MbaAccessorChain.prototype.getModelForRouteAtIndex = function(route, index){
        checkType(route, MbaRoute);
        checkType(index, 'number');
        var routeIndex = route[index];
        if(this._lastModel instanceof Array){
            if(routeIndex >= this._lastModel.length)
                throw new MbaError(34, 'Route index is greater than model array size.');
            this._lastModel = this._lastModel[routeIndex];
        }
        else if(routeIndex > 0)//TODO voir si on peut pas remplacer les 0 par null si c'est pas des tableaux dans le modèle 
            throw new MbaError(35, 'Route index is greater than 0 and model is not an array.');
    };
    
    MbaAccessorChain.prototype.readWithAccessor = function(accessorIndex){
        checkType(accessorIndex, 'number');
        var accessor = this.getAccessor(accessorIndex);
        if(this._lastModel == null){
            this._modelHasNotMember = true;
            this._modelValue = null;
        }
        else{
            this._modelValue = accessor.getModelValue(this._lastModel);
            if(this._modelValue == null)
                this._modelHasNotMember = accessor.modelHasNotMember(this._lastModel);
        }
    };   
    
    MbaAccessorChain.prototype.readWithAccessorForModel = function(route, accessorIndex){
        checkType(route, MbaRoute);
        checkType(accessorIndex, 'number');
        
        if(this._lastModel instanceof Array){
            //TODO traquer les array.concat pour améliorer les perfs...
            var nextModelValue = [];
            var modelArray = this._lastModel;
            for(var i=0 ; i<modelArray.length ; i++){
                this._lastModel = modelArray[i];
                this.readWithAccessor(accessorIndex);
                if(this._modelValue instanceof Array)
                    pushAllOld(nextModelValue, this._modelValue);
                else
                    nextModelValue.push(this._modelValue);
            }
            this._modelValue = nextModelValue;
            this._lastModel = modelArray;
        }
        else{
            this.readWithAccessor(accessorIndex);
        }        
    };   
        
    MbaAccessorChain.prototype.setModelValueFromRoute = function(model, route, value){
        checkType(route, MbaRoute);
        var accessorCount = this.getAccessorCount();
        this._lastRoute = new MbaRoute();
        this._lastModel = model;
        model = this.getModelValueFromNonEmptyRoute(route, accessorCount-1);
        model = toArray(model);
        var routeIndex = route[accessorCount-1];
        var accessorIndex = accessorCount-1;
        if(routeIndex != null){
            this.writeWithAccessorForRouteIndex(model, routeIndex, accessorIndex, value);
        }
        else{
            this.writeWithAccessorForModel(model, accessorIndex, value);
        }
    };
    
    MbaAccessorChain.prototype.writeWithAccessorForRouteIndex = function(model, routeIndex, accessorIndex, value){
        checkType(model, Array);
        checkTypeOrNull(routeIndex, 'number');
        checkType(accessorIndex, 'number');
        if(routeIndex >= model.length)
            throw new MbaError(34, 'Route index is greater than model array size.');
        this.getAccessor(accessorIndex).setModelValue(model[routeIndex], value);
    };
    
    MbaAccessorChain.prototype.writeWithAccessorForModel = function(model, accessorIndex, value){
        checkType(model, Array);
        checkType(accessorIndex, 'number');
        for(var i=0 ; i<model.length ; i++){
            this.writeWithAccessorForRouteIndex(model, i, accessorIndex, value);
        }
    };
            
    MbaAccessorChain.prototype.match = function(accessors){
        checkType(accessors, 'array', 'string');
        
        if(this._accessors.length != accessors.length)
            return false;
        
        for(var i=0 ; i<this._accessors.length ; i++){
            if(this._accessors[i].getPrecursor() != accessors[i])
                return false;
        }
        return true;
    };
    
    MbaAccessorChain.prototype.toString = function(){
        var stringRepresentation = '[';
        for(var i=0 ; i<this._accessors.length ; i++){
            stringRepresentation += this._accessors[i].toString()+', ';
        }
        if(this._accessors.length> 0)
            stringRepresentation = stringRepresentation.substring(0, stringRepresentation.length-2);
        stringRepresentation += ']';
        return stringRepresentation;
    };
    
    MbaAccessorChain.prototype.toStringWithModel = function(){
        var stringRepresentation = 'model';
        for(var i=0 ; i<this._accessors.length ; i++){
            stringRepresentation += '.'+this._accessors[i].toString();
        }
        return stringRepresentation;
    };
    
    MbaAccessorChain.prototype.hasSameRoot = function(other){
        var rootSize = Math.min(this.getSize(), other.getSize());
        for(var i=0; i<rootSize ; i++){
            if(!this.getAccessor(i).equals(other.getAccessor(i)))
                return false;
        }
        return true;
    };
    
    MbaAccessorChain.prototype.removeNFirstAccessors = function(n){
        for(var i=0; i<n ; i++){
            this._accessors.shift();  
        }
    };  
    
    this.initOld();
}
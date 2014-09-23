function MbaAccessorChain(){
    
    this._accessors;
    this._lastRoute;
    this._lastModel;
    this._completeRoutes;
    this._cachedModelValues = {};
    
    MbaAccessorChain.prototype.init = function(){
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
        var resultModel = model;
        this._lastRoute = new MbaRoute();
        if(this.hasAccessors())
            resultModel = this.getModelValueFromNonEmptyRoute(model, route, this.getAccessorCount());

        if(route.length > this.getAccessorCount())
            resultModel = this.getModelForRouteAtIndex(resultModel, route, route.length-1);

        return resultModel;
    };
    
    MbaAccessorChain.prototype.getModelValueFromRoute = function(model, route){
        checkType(route, MbaRoute);
        this._lastRoute = new MbaRoute();
        this._lastModel = model;
        if(this.hasAccessors())
            return this.getModelValueFromNonEmptyRoute(model, route, this.getAccessorCount());
        else
            return model;
    }
    
    MbaAccessorChain.prototype.getModelValueFromNonEmptyRoute = function(model, route, nbAccessorThrought){
        checkType(route, MbaRoute);
        checkType(nbAccessorThrought , 'number');
        var modelValue = model;
        var accessorCount = this.getAccessorCount();
        for(var i=0 ; i<nbAccessorThrought ; i++){
            if(modelValue == null)
                break;
            modelValue = this.getModelValueForAccessorAtIndex(modelValue, route, i);            
        }
        return modelValue;
    };
    
    MbaAccessorChain.prototype.getModelValueForAccessorAtIndex = function(model, route, index){
        checkType(route, MbaRoute);
        checkType(index, 'number');
        var modelValue;
        if(route.isNullAtIndex(index)){
            this._lastModel = model;
            modelValue = this.readWithAccessorForModel(model, route, index);
        }
        else{
            model = this.getModelForRouteAtIndex(model, route, index);
            this._lastModel = model;
            modelValue = this.readWithAccessor(model, index);
        }
        this._lastRoute.appendIndex(route[index]);
        return modelValue;
    };
    
    MbaAccessorChain.prototype.getModelForRouteAtIndex = function(model, route, index){
        checkType(route, MbaRoute);
        checkType(index, 'number');
        var routeIndex = route[index];
        if(model instanceof Array){
            if(routeIndex >= model.length)
                throw new MbaError(34, 'Route index is greater than model array size.');
            return model[routeIndex];
        }
        else{
            if(routeIndex > 0)//TODO voir si on peut pas remplacer les 0 par null si c'est pas des tableaux dans le modèle 
                throw new MbaError(35, 'Route index is greater than 0 and model is not an array.');
            return model;
        }
    };
    
    MbaAccessorChain.prototype.readWithAccessor = function(model, accessorIndex){
        checkType(accessorIndex, 'number');
        return this.getAccessor(accessorIndex).getModelValue(model);
    };   
    
    MbaAccessorChain.prototype.readWithAccessorForModel = function(model, route, accessorIndex){
        checkType(route, MbaRoute);
        checkType(accessorIndex, 'number');
        var modelValue = [];
        if(model instanceof Array){
            //TODO traquer les array.concat pour améliorer les perfs...
            for(var i=0 ; i<model.length ; i++){
                var currModelValue = this.readWithAccessor(model[i], accessorIndex);
                if(currModelValue instanceof Array)
                    pushAll(modelValue, currModelValue);
                else
                    modelValue.push(currModelValue);
            }
            return modelValue;
        }
        else{
            return this.readWithAccessor(model, accessorIndex);
        }        
    };   
        
    MbaAccessorChain.prototype.setModelValueFromRoute = function(model, route, value){
        checkType(route, MbaRoute);
        var accessorCount = this.getAccessorCount();
        this._lastRoute = new MbaRoute();
        model = this.getModelValueFromNonEmptyRoute(model, route, accessorCount-1);
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
    
    this.init();
}
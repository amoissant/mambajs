function MbaNodeHtmlElement2(parent, baseDom) {

	MbaNodeHtmlElement2.prototype.init = function(parent, baseDom) {
		MbaNode2.prototype.init.call(this, parent, baseDom);
	};
    
	MbaNodeHtmlElement2.prototype.getDomElement = function() {
		return this._baseDom.getDom(0);
	};
	
	if (arguments.length > 0)
		this.init(parent, baseDom);
}
MbaNodeHtmlElement2.prototype = new MbaNode2();
MbaNodeHtmlElement2.prototype.constructor = MbaNodeHtmlElement2;

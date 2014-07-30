function MbaNodeHtmlElement(parent, baseDom) {

	MbaNodeHtmlElement.prototype.init = function(parent, baseDom) {
		MbaNode.prototype.init.call(this, parent, baseDom);
	};
    
	MbaNodeHtmlElement.prototype.getDomElement = function() {
		return this._baseDom.getDom(0);
	};
	
	if (arguments.length > 0)
		this.init(parent, baseDom);
}
MbaNodeHtmlElement.prototype = new MbaNode();
MbaNodeHtmlElement.prototype.constructor = MbaNodeHtmlElement;

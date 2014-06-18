function MbaNodeHtmlElement(parent, baseDom) {

	MbaNodeHtmlElement.prototype.init = function(parent, baseDom) {
		MbaNode.prototype.init.call(this, parent, baseDom);

		this.detachBaseDomChildren();
	};
	MbaNodeHtmlElement.prototype.getDomElement = function() {
		return this._baseDom.getDom(0);
	};
	MbaNodeHtmlElement.prototype.render = function(model) {
		checkType(model, 'array', 'object');
		if (model.length == 0) {
			this.callRenderOnChildren(model);
			this.removeDomIntoParent();
		} else {
			var renderedDom = this._baseDom.clone2();
			this.appendDomIntoParent(renderedDom);
			this.callRenderOnChildren(model);
		}
	};
	MbaNodeHtmlElement.prototype.detachBaseDomChildren = function() {
		var baseDomElement = this._baseDom.getDom(0);
		var baseDomChildren = baseDomElement.childNodes;
		if (baseDomChildren) {
			while (baseDomChildren.length > 0) {
				var currChild = baseDomChildren[0];
				baseDomElement.removeChild(currChild);
			}
		}
	}
	
	if (arguments.length > 0)
		this.init(parent, baseDom);
}
MbaNodeHtmlElement.prototype = new MbaNode();
MbaNodeHtmlElement.prototype.constructor = MbaNodeHtmlElement;

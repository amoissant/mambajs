function MbaNodeBinding(parent, baseDom, binding) {

	this._binding;
	this._baseNodeHtmlElement;
	this._previousModelSize;

	MbaNodeBinding.prototype.init = function(parent, baseDom, binding) {
		MbaNode.prototype.init.call(this, parent, baseDom, false);

		checkType(binding, MbaBinding);

		this._binding = binding;
		this._previousModelSize = 1;
	};
	MbaNodeBinding.prototype.getBinding = function() {
		return this._binding;
	};
	MbaNodeBinding.prototype.setBaseNode = function(baseNode) {
		checkType(baseNode, MbaNodeHtmlElement);
		this._baseNodeHtmlElement = baseNode;
		this.setBaseDom(baseNode.getBaseDom());
	};
	// TODO refactor pour en faire une méthode, ici c'est un style statique
	MbaNodeBinding.prototype.replaceHtmlNodeByBindingNode = function(	nodeToReplace,
																		bindingNode) {
		checkType(nodeToReplace, MbaNode);
		checkType(bindingNode, MbaNode);

		var domElement = nodeToReplace.getRenderedDom();
		var parent = nodeToReplace.getParent();
		var children = nodeToReplace.removeChildren();
		var positionInParent = parent.getChildPosition(nodeToReplace);
		parent.removeChild(nodeToReplace);
		bindingNode.setParent(parent);
		bindingNode.setChildren(children);
		// TODO séparer en plusieurs méthodes
		for ( var i = 0; i < children.length; i++) {
			var currChild = children[i];
			currChild.setParent(bindingNode);
		}
		parent.addChildAtIndex(bindingNode, positionInParent);
		bindingNode.referenceMeIntoDomElement(domElement);

		// TODO : essayer de gérer cette exception pour valider le principe que
		// les textnodes doivent avoir leur propre bindingNode (cf commentaire
		// MbaNodeBinding.removeLoneTextNodeChildrenIfTransfIsText)
		bindingNode.removeLoneTextNodeChildrenIfTransfIsText();
	};
	MbaNodeBinding.prototype.replaceHtmlNodesIntoMbaTemplate = function() {
		this.replaceHtmlNodeByBindingNode(this._baseNodeHtmlElement, this);
	};
	MbaNodeBinding.prototype.render = function(model) {
		checkType(model, 'array', 'object');

		if (model.length == 0) {
			this.callRenderOnChildren(model);
			this.removeDomIntoParent();
			if (!this.getRenderedDom().isEmpty())
				console.log('ERROR : renderedDom should be empty when rendered with an empty model');
		} else {
			this.updateExistingDom(model);
			this.renderNewDom(model);
			this.callRenderOnChildren(model);
			this.removeOldDom(model);
		}
		this._previousModelSize = model.length;
	};
	MbaNodeBinding.prototype.updateExistingDom = function(model) {
		checkType(model, 'array', 'object');
		var updateModel = model.slice(0, this._previousModelSize);
		var updateDom = this.getRenderedDom();
		var updatedDom = this._binding.update(updateDom, updateModel);
	};
	MbaNodeBinding.prototype.renderNewDom = function(model) {
		checkType(model, 'array', 'object');
		var currentModelSize = model.length;
		var renderModel = model
				.slice(this._previousModelSize, currentModelSize);
		var renderedDom = this._binding.render(renderModel, this._baseDom);
		this.appendDomIntoParent(renderedDom);
	};
	MbaNodeBinding.prototype.removeOldDom = function(model) {
		checkType(model, 'array', 'object');
		var currentModelSize = model.length;
		this.removeDomIntoParentFromIndex(currentModelSize);
	};
	MbaNodeBinding.prototype.beforeVisitMe = function(visitor) {
		visitor.beforeVisitNodeBinding(this);
	};
	MbaNodeBinding.prototype.afterVisitMe = function(visitor) {
		visitor.afterVisitNodeBinding(this);
	};
	// TODO : refacto de ceci on devrait avoir un bindingNode dédié au textNode
	// enfant et ne pas utiliser le bindingNode du parent
	// au niveau de la fonction getMergedBindings il va falloir faire des modifs
	MbaNodeBinding.prototype.removeLoneTextNodeChildrenIfTransfIsText = function() {
		var hasOneChild = function(node) {
			return node.getChildren().length == 1;
		};

		var lonelyChildIsATextNode = function(node) {
			var childNode = node.getChildren()[0];
			return isATextNode(childNode.getBaseDom().getDom(0));
		};

		var containsAnInnerTextTranformation = function(node) {
			var binding = node.getBinding();
			var transformations = binding.getTransf();
			for ( var i = 0; i < transformations.length; i++) {
				var currTransf = transformations[i];
				if (currTransf.transf === DOM_TRANSF.text)
					return true;
			}
			return false;
		};
		if (hasOneChild(this)
				&& lonelyChildIsATextNode(this)
				&& containsAnInnerTextTranformation(this)) {
			this._children.pop();
		}
	};
	if (arguments.length > 0)
		this.init(parent, baseDom, binding);
}
MbaNodeBinding.prototype = new MbaNode();
MbaNodeBinding.prototype.constructor = MbaNodeBinding;

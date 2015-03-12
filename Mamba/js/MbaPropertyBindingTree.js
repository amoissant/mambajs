function MbaPropertyBindingTree(){   
}
MbaPropertyBindingTree.prototype = new MbaAccessorTree();
MbaPropertyBindingTree.prototype.constructor = MbaPropertyBindingTree;

MbaPropertyBindingTree.prototype.instanciateNewNode = MbaPropertyBindingNode.prototype.instanciateNewNode;

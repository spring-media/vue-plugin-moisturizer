class NodeVisitor {

	constructor(condition, callback) {
		this.condition = condition;
		this.callback = callback;
	}

	visit(node) {
    if (this.condition(node)) {
      return this.callback(node);
    } else if (typeof node === 'object') {
      return this.iterateEntries(node, entry => this.visit(entry));
    } else {
      return node;
    }
	}

	iterateEntries(node, callback) {
		return Object.entries(node).reduce(
      (p, [key, val]) => ({...p, ...{[key]: callback(val)} }),
			{}
    );
	}

}

module.exports = NodeVisitor;

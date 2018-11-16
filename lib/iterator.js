class Iterator {
	static iterate(node, condition, callback) {
		if (condition(node)) {
			return callback(node);
		} else if (typeof node === 'object') {
			return Iterator.iterateEntries(node, entry =>
				Iterator.iterate(entry, condition, callback)
			);
		} else {
			return node;
		}
	}

	static iterateEntries(node, callback) {
		const newNode = {};
		Object.entries(node).forEach(([key, val]) => {
			if (val) {
				newNode[key] = callback(val);
			}
    });
		return newNode;
	}
}

module.exports = Iterator;

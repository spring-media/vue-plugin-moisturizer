function serialize(propObject) {
	const propsStr = JSON.stringify(propObject);
	return propsStr.replace(/'/g, "\\'").replace(/"/g, "'");
}

function deserialize(propsStr) {
	const propObject = propsStr.replace(/'/g, '"').replace(/\\"/g, '"');
	return JSON.parse(propObject);
}

module.exports.serialize = serialize;
module.exports.deserialize = deserialize;

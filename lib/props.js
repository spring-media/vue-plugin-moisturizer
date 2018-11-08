const getFingerprint = require('./fingerprint');

function serialize(propObject = {}) {
	const convertedProps = convertProps(propObject);
	console.log('convertedProps', convertedProps);
	const propsStr = JSON.stringify(convertedProps);
	return propsStr.replace(/'/g, "\\'").replace(/"/g, "'");
}

function deserialize(propsStr, components) {
	const propsJSON = propsStr.replace(/'/g, '"').replace(/\\"/g, '"');
	const propsObject = JSON.parse(propsJSON);
	console.log('propsString !', propsStr);
	console.log('propsObject !', propsObject);
	console.log('components !', components);
	for (const component of components) {
		console.log(getFingerprint(component), component);
	}
	return propsObject;
}

function convertProps(props) {
	const convertedProps = {};
	for (const key in props) {
		convertedProps[key] = isComponent(props[key]) ? convertProp(props[key]) : props[key];
	}
	return convertedProps;
}

function convertProp(prop) {
	return { type: 'component', fingerprint: getFingerprint(prop) };
}

function isComponent(obj) {
	return obj.render !== undefined;
}

module.exports.serialize = serialize;
module.exports.deserialize = deserialize;

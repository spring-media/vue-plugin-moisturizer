const Iterator = require('./iterator');

class Props {
	constructor(components) {
		this.components = components;
	}

	serialize(props) {
		const convertedProps = this.serializeComponents(props);
		return this.stringifyForAttr(convertedProps);
	}

	getFromElement(el, components) {
		const props = this.readPropsFromEl(el);
		return this.deserializeComponents(props, components);
	}

	deserializeComponents(node) {
		const condition = node => this.isSerializedComponent(node);
		const callback = node => this.convertToVueComponent(node);
		return Iterator.iterate(node, condition, callback);
	}

	serializeComponents(node) {
		const condition = node => this.isVueComponent(node);
		const callback = node => this.convertToSerializedComponent(node);
		return Iterator.iterate(node, condition, callback);
	}

	convertToSerializedComponent(prop) {
		const fingerprint = prop => new Fingerprinter(prop).fingerprint();
		return { __moisturizer: true, type: 'component', fingerprint: fingerprint(prop) };
	}

	convertToVueComponent(prop) {
		const fingerprint = comp => new Fingerprinter(comp).fingerprint();
		return this.components.find(comp => fingerprint(comp) === prop.fingerprint);
	}

	isVueComponent(obj) {
		return obj.render !== undefined;
	}

	isSerializedComponent(obj) {
		return obj.__moisturizer && obj.type === 'component';
	}

	stringifyForAttr(props) {
		const json = JSON.stringify(props);
		return json.replace(/'/g, "\\'").replace(/"/g, "'");
	}

	readPropsFromEl(el) {
		const attr = el.getAttribute(config.attrs.props);
		const json = attr.replace(/'/g, '"').replace(/\\"/g, '"');
		return JSON.parse(json);
	}
}

module.exports = Props;

/* const getFingerprint = require('./fingerprinter');

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
 */

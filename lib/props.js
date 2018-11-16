const Iterator = require('./iterator');
const config = require('./config');

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
		// if (typeof prop === 'undefined') return prop.default;
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

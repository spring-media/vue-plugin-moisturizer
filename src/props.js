const Fingerprinter = require('./fingerprinter');
const NodeVisitor = require('./visitor');
const config = require('./config');

class Props {
	constructor(components) {
		this.components = components;
	}

	serialize(props) {
		const convertedProps = this.serializeComponents(props);
		const sanitizedProps = this.sanitizeProps(convertedProps);
		return this.stringifyForAttr(sanitizedProps);
	}

	getFromElement(el, components) {
		const props = this.readPropsFromEl(el);
		return this.deserializeComponents(props, components);
	}

	deserializeComponents(node) {
		const condition = node => this.isSerializedComponent(node);
		const callback = node => this.convertToVueComponent(node);
		return new NodeVisitor(condition, callback).visit(node);
	}

	serializeComponents(node) {
		const condition = node => this.isVueComponent(node);
		const callback = node => this.convertToSerializedComponent(node);
		return new NodeVisitor(condition, callback).visit(node);
	}

	convertToSerializedComponent(prop) {
		return { __moisturizer: true, type: 'component', fingerprint: Fingerprinter.print(prop) };
	}

	convertToVueComponent(prop) {
		return this.components.find(comp => Fingerprinter.print(comp) === prop.fingerprint);
	}

	isVueComponent(obj) {
		return obj && obj.render !== undefined;
	}

	isSerializedComponent(obj) {
		return obj && obj.__moisturizer && obj.type === 'component';
	}

	stringifyForAttr(props) {
		const json = JSON.stringify(props);
		return json.replace(/'/g, "\\'").replace(/"/g, "&escapedquot;");
	}

	sanitizeProps(props) {
		const result = Array.isArray(props) ? [] : {};

		Object.keys(props).forEach(key => {
			if (key === '__typename') {
				return;
			}

			if (props[key] && typeof props[key] === 'object') {
				result[key] = this.sanitizeProps(props[key]);
			} else {
				result[key] = props[key];
			}
		});

		return result;
	}

	readPropsFromEl(el) {
		const attr = el.getAttribute(config.attrs.props);
		const json = (attr && attr.replace(/'/g, '"').replace(/&escapedquot;/g, '"')) || '"{}"';

		try {
			return JSON.parse(json);
		} catch (err) {
			console.error('Failed to deserialize props from JSON: ', json);
			throw err;
		}
	}
}

module.exports = Props;

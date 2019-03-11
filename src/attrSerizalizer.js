const NodeVisitor = require('./visitor');
const Fingerprinter = require('./fingerprinter');
const fingerprint = Fingerprinter.print;

class AttrSerializer {
	constructor(components) {
		this.components = components;
	}

	serialize(json) {
		const convertedJson = this.serializeComponents(json);
		return this.stringify(convertedJson);
	}

	deserialize(str) {
		const json = this.objectify(str);
		return this.deserializeComponents(json);
	}

	stringify(json) {
		const str = JSON.stringify(json);
		return str.replace(/'/g, "\\'").replace(/"/g, "'");
	}

	objectify(str) {
		const json = str.replace(/'/g, '"').replace(/\\"/g, '"');
		return JSON.parse(json);
	}

	serializeComponents(node) {
		const condition = node => this.isVueComponent(node);
		const callback = node => this.convertToSerializedComponent(node);
		return new NodeVisitor(condition, callback).visit(node);
	}

	deserializeComponents(node) {
		const condition = node => this.isSerializedComponent(node);
		const callback = node => this.convertToVueComponent(node);
		return new NodeVisitor(condition, callback).visit(node);
	}

	convertToSerializedComponent(prop) {
		return { __moisturizer: true, type: 'component', fingerprint: fingerprint(prop) };
	}

	convertToVueComponent(serializedComponent) {
		return this.components.find(
			component => fingerprint(component) === serializedComponent.fingerprint
		);
	}

	isVueComponent(obj) {
		return obj.render !== undefined;
	}

	isSerializedComponent(obj) {
		return obj.__moisturizer && obj.type === 'component';
	}
}

module.exports = AttrSerializer;

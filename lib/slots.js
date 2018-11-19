const Vue = require('vue').default || require('vue');
const Fingerprinter = require('./fingerprinter');
const config = require('./config');

class Slots {
	constructor(components) {
		this.components = components;
		this.vm = new Vue({});
	}

	serialize(slots) {
		const serialize = slot => this.serializeSlot((slot));
    const defaultSlot = slots.default && slots.default.map(serialize);
		return this.stringify({ default: defaultSlot || [] });
	}

	getFromElement(el) {
		const attr = el.getAttribute(config.attrs.slots);
		const defaultSlot = this.objectify(attr).default;
		return { default: defaultSlot.map(slot => this.deserializeSlot(slot)) };
	}

	serializeSlot(slot = {}) {
		if (slot.text) return this.getText(slot);
		if (slot.componentOptions) return this.getComponent(slot);
		if (slot.tag && !slot.componentOptions) return this.getTag(slot);
		throw new Error('Cannot handle slot');
	}

	deserializeSlot(slot) {
		if (slot.type === 'text') return slot.text;
		if (slot.type === 'tag') return this.createVNodeFromTag(slot.tag, slot.children);
		if (slot.type === 'component') return this.createVNodeFromComponent(slot.fingerprint);
		throw new Error(`Found unknown slot type "${slot.type}"`);
	}

	getText(slot) {
		const type = 'text';
		const text = slot.text;
		const __moisturizer = true;
		return { __moisturizer, type, text };
	}

	getComponent(slot) {
		const type = 'component';
		const fingerprint = Fingerprinter.print(slot);
		const __moisturizer = true;
		return { __moisturizer, type, fingerprint };
	}

	getTag(slot) {
		const type = 'tag';
		const name = slot.tag;
		const children = slot.children ? slot.children.map(c => this.serializeSlot(c)) : [];
		const __moisturizer = true;
		return { __moisturizer, type, name, children };
	}

	createVNodeFromTag(el, children) {
		const childrenAsVNodes = children ? children.map(c => this.deserializeSlot(c)) : undefined;
		return this.vm.$createElement(el, childrenAsVNodes);
	}

	createVNodeFromComponent(fingerprint) {
		const component = this.components.find(comp => Fingerprinter.print(comp) === fingerprint);
		const msg = `Could not find component "${name}". Did you provide it to the hydration?`;
		if (!component) throw new Error(msg);
		return this.vm.$createElement(component);
	}

	stringify(json) {
		const str = JSON.stringify(json);
		return str.replace(/'/g, "\\'").replace(/"/g, "'");
	}

	objectify(str) {
		const json = str && str.replace(/'/g, '"').replace(/\\"/g, '"') || '{"default": []}';
		return JSON.parse(json);
	}
}

module.exports = Slots;

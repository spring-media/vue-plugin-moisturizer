const Vue = require('vue').default || require('vue');
const Validator = require('./validator');
const Fingerprinter = require('./fingerprinter');
const config = require('./config');
const Props = require('./props');
const Slots = require('./slots');

class Hydrator {
	constructor(components, vueOptions = {}) {
		new Validator(components).validate();
		this.vueOptions = vueOptions;
		this.components = components;
	}

	hydrate() {
		return this.components.map(component => this.hydrateComponent(component));
	}

	hydrateComponent(component) {
		const attr = config.attrs.fingerprint;
		const fingerprint = new Fingerprinter(component).fingerprint();
		const elements = document.querySelectorAll(`[${attr}="${fingerprint}"]`);
		[...elements].map(el => this.mount(component, el));
	}

	mount(component, el) {
		const props = new Props(this.components).getFromElement(el);
		const slots = new Slots(this.components).getFromElement(el);
		const instance = this.getVueInstance(component, props, slots);
		instance.$mount(el);
	}

	getVueInstance(component, propsData, slots) {
		const Constr = Vue.extend(component);
		const instance = new Constr({ ...this.vueOptions, propsData });
		Object.assign(instance.$slots, slots);
		return instance;
	}
}

module.exports = Hydrator;

/* getProps(el) {
		const props = getProps(el);

		//const propsAttr = el.getAttribute(config.attrs.props);
		// const propsObj = props.deserialize(propsAttr, componentsHack);

		for (const key in propsObj) {
			const prop = propsObj[key];
			if (prop.type === 'component') {
				const component = componentsHack.find(
					component => getFingerprint(component) === prop.fingerprint
				);
				propsObj[key] = component;
			}
		}
		return propsObj;

	} */

/* function getSlots(el) {
	const slotsAttr = el.getAttribute(config.attrs.slots);
	return slots.deserialize(slotsAttr);
}
 */
/* function getVNodes(slotsData) {
	const def = slotsData.default.map(slot => getVNode(slot));
	return { default: def };
}
 */
/* function getVNode(slot) {
	if (slot.type === 'text') return slot.text;
	if (slot.type === 'tag')
		return vm.$createElement(slot.tag, slot.children.map(child => getVNode(child)));
	if (slot.type === 'component') {
		const component = componentsHack.find(component => component.name === slot.name);
		return vm.$createElement(component);
	}
	console.warn(`Found unknown slot type "${slot.type}"`, slot);
} */

// module.exports = hydrateComponents;

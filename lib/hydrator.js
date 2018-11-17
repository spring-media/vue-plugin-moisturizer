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
		// Filter data attributes
		const htmlAttrs = [...el.attributes].filter(a =>!a.name.startsWith('data-hydrate'));
		const attrObjects = [...htmlAttrs].map(attr => ({[attr.name]: attr.value}));
    const attrMap = Object.assign({}, ...attrObjects)
		const instance = this.getVueInstance(component, props, slots, attrMap);
		instance.$mount(el);
	}

	getVueInstance(component, propsData, slots, attrs) {
		const Constr = Vue.component('generic', {
			functional: true,
			render: (createElement) => {
				return createElement(component, {attrs})
			}
		});
		const instance = new Constr({ ...this.vueOptions, propsData });
		Object.assign(instance.$slots, slots);
		return instance;
	}
}

module.exports = Hydrator;

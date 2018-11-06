const Vue = require('vue').default || require('vue');
const validateComponents = require('./validate');
const config = require('./config');
const props = require('./props');
const slots = require('./slots');

let componentsHack = [];
let createElementHack = null;

function hydrateComponents(components, vueOptions = {}) {
	validateComponents(components);
	componentsHack = components;
	return components.map(c => hydrateComponent(c, vueOptions));
}

function hydrateComponent(component, vueOptions) {
	const elements = document.querySelectorAll(`[${config.attrs.name}="${component.name}"]`);
	const instances = [...elements].map(el => instantiateVue(el, component, vueOptions));
	return { component, instances };
}

function instantiateVue(el, component, vueOptions) {
	const propsData = getProps(el);
	const slotsData = getSlots(el);
	const Constr = Vue.extend(component);
	const instance = new Constr({ propsData });
	createElementHack = instance.$createElement;
	Object.assign(instance.$slots, getVNodes(slotsData));
	instance.$mount(el);
}

function getProps(el) {
	const propsAttr = el.getAttribute(config.attrs.props);
	return props.deserialize(propsAttr);
}

function getSlots(el) {
	const slotsAttr = el.getAttribute(config.attrs.slots);
	return slots.deserialize(slotsAttr);
}

function getVNodes(slotsData) {
	const def = slotsData.default.map(slot => getVNode(slot));
	return { default: def };
}

function getVNode(slot) {
	if (slot.type === 'text') return slot.text;
	if (slot.type === 'tag')
		return createElementHack(slot.tag, slot.children.map(child => getVNode(child)));
	if (slot.type === 'component') {
		const component = componentsHack.find(component => component.name === slot.name);
		return createElementHack(component);
	}
	console.warn(`Found unknown slot type "${slot.type}"`, slot);
}

module.exports = hydrateComponents;

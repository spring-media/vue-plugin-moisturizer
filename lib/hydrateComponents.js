const Vue = require('vue').default || require('vue');
const validateComponents = require('./validate');
const props = require('./props');
const config = require('./config');

function hydrateComponents(components, vueOptions = {}) {
	validateComponents(components);
	return components.map(c => hydrateComponent(c, vueOptions));
}

function hydrateComponent(component, vueOptions) {
	const elements = document.querySelectorAll(`[${config.attrs.name}="${component.name}"]`);
	const instances = [...elements].map(el => instantiateVue(el, component, vueOptions));
	return { component, instances };
}

function instantiateVue(el, component, vueOptions) {
	const props = getProps(el);
	const render = h => h(component, { props });
	return new Vue({ ...vueOptions, render }).$mount(el);
}

function getProps(el) {
	const propsAttr = el.getAttribute(config.attrs.props);
	return props.deserialize(propsAttr);
}

module.exports = hydrateComponents;

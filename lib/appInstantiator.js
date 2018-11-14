const _Vue = require('vue').default || require('vue');

class AppInstantiator {
	constructor(component, vueOptions = {}, Vue = _Vue) {
		this.component = component;
		this.vueOptions = vueOptions;
		this.Vue = Vue
	}

	instantiate() {
		const render = h => h(this.component);
		return new this.Vue({ ...this.vueOptions, render });
	}
}

module.exports = AppInstantiator;

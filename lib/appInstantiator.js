const Vue = require('vue').default || require('vue');

class AppInstantiator {
	constructor(component, vueOptions = {}) {
		this.component = component;
		this.vueOptions = vueOptions;
	}

	instantiate() {
		const render = h => h(this.component);
		return new Vue({ ...this.vueOptions, render });
	}
}

module.exports = AppInstantiator;

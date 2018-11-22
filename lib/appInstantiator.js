const MoisturizerVuePlugin = require('./moisturizerVuePlugin');

class AppInstantiator {
	constructor(component, vueOptions = {}) {
		this.component = component;
		this.vueOptions = vueOptions;
	}

	instantiate() {
		const render = h => h(this.component);
		return new MoisturizerVuePlugin.vue({ ...this.vueOptions, render });
	}
}

module.exports = AppInstantiator;

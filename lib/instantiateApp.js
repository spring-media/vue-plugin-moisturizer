const Vue = require('vue').default || require('vue');

function instantiateApp(component, vueOptions = {}) {
	const render = h => h(component);
	return new Vue({ ...vueOptions, render });
}

module.exports = instantiateApp;

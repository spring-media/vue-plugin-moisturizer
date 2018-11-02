const props = require('./props');

class MoisturizerVuePlugin {
	static install(Vue) {
		Vue.mixin({
			created() {
				if (this.hydrate) {
					MoisturizerVuePlugin.extendAttrs(this, {
						'data-hydrate-name': MoisturizerVuePlugin.getNameAttribute(this),
						'data-hydrate-props': MoisturizerVuePlugin.getPropsAttribute(this),
					});
				}
			},
			props: {
				hydrate: {
					type: Boolean,
					default: false,
				},
			},
		});
	}

	static extendAttrs(comp, obj) {
		comp.$vnode.data = comp.$vnode.data || {};
		comp.$vnode.data.attrs = comp.$vnode.data.attrs || {};
		Object.assign(comp.$vnode.data.attrs, obj);
	}

	static getNameAttribute(comp) {
		return comp.$vnode.componentOptions.Ctor.options.name;
	}

	static getPropsAttribute(comp) {
		const propsData = comp.$options.propsData || {};
		return props.serialize(propsData);
	}
}

module.exports = MoisturizerVuePlugin;

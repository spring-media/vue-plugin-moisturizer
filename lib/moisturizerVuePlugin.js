const config = require('./config');
const props = require('./props');
const slots = require('./slots');

class MoisturizerVuePlugin {
	static install(Vue) {
		Vue.mixin({
			created() {
				if (typeof window === 'undefined' && this.hydrate) {
					MoisturizerVuePlugin.extendAttrs(this, {
						[config.attrs.name]: MoisturizerVuePlugin.getNameAttribute(this),
						[config.attrs.props]: MoisturizerVuePlugin.getPropsAttribute(this),
						[config.attrs.slots]: MoisturizerVuePlugin.getSlotsAttribute(this),
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

	static getSlotsAttribute(comp) {
		return slots.serialize(comp.$slots);
	}
}

module.exports = MoisturizerVuePlugin;

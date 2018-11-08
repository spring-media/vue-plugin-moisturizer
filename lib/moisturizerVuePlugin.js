const getFingerprint = require('./fingerprint');
const config = require('./config');
const props = require('./props');
const slots = require('./slots');

class MoisturizerVuePlugin {
	static install(Vue) {
		Vue.mixin({
			created() {
				if (this.hydrate) {
					MoisturizerVuePlugin.extendAttrs(this, {
						[config.attrs.fingerprint]: MoisturizerVuePlugin.getFingerprint(this),
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

	static getFingerprint(comp) {
		return getFingerprint(comp);
	}

	static getPropsAttribute(comp) {
		return props.serialize(comp.$options.propsData);
	}

	static getSlotsAttribute(comp) {
		return slots.serialize(comp.$slots);
	}
}

module.exports = MoisturizerVuePlugin;

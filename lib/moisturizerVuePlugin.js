const Fingerprinter = require('./fingerprinter');
const config = require('./config');
const Props = require('./props');
const Slots = require('./slots');

class MoisturizerVuePlugin {
	static install(Vue) {
		Vue.mixin({
			created() {
				if (typeof window === 'undefined' && this.hydrate) {
					MoisturizerVuePlugin.extendAttrs(this, {
						[config.attrs.fingerprint]: MoisturizerVuePlugin.getFingerprint(this),
						[config.attrs.props]: MoisturizerVuePlugin.getProps(this),
						[config.attrs.slots]: MoisturizerVuePlugin.getSlots(this),
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
		return new Fingerprinter(comp).fingerprint();
	}

	static getProps(comp) {
		return new Props([]).serialize(comp.$options.propsData);
	}

	static getSlots(comp) {
		return new Slots().serialize(comp.$slots);
	}
}

module.exports = MoisturizerVuePlugin;

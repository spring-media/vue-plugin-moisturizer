const MoisturizerVuePlugin = {
	install: Vue =>
		Vue.mixin({
			created: function created() {
				if (this.hydrate) {
					this.$vnode.data = this.$vnode.data || {};
					this.$vnode.data.attrs = this.$vnode.data.attrs || {};
					this.$vnode.data.attrs[
						'data-hydrate'
					] = this.$vnode.componentOptions.Ctor.options.name;
				}
			},
			props: {
				hydrate: {
					type: Boolean,
					default: false,
				},
			},
		}),
};

module.exports = MoisturizerVuePlugin;

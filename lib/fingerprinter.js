const md5 = require('md5');

class Fingerprinter {
	constructor(component) {
		this.component = component;
	}

	fingerprint() {
		const id = this.componentName() || this.renderFunctionAsStr();
		const message = 'Cannot fingerprint component.';
		const advice = 'Either set a name in your component or use a functional component';
		if (!id) debugger;
		if (!id) throw new Error(`${message} ${advice}`);
		return md5(id);
	}

	componentName() {
		const comp = this.component;
		if (comp.name) return comp.name;
		if (comp.$vnode) return comp.$vnode.componentOptions.Ctor.options.name;
		if (comp.componentOptions) return comp.componentOptions.Ctor.options.name;
		return undefined;
	}

	renderFunctionAsStr() {
		return this.component.render ? this.component.render.toString() : undefined;
	}
}

module.exports = Fingerprinter;

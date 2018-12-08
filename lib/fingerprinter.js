const md5 = require('md5');

class Fingerprinter {
	constructor(component) {
		this.component = component;
	}

	// TODO find better way to identify components
	// TODO for instance: Hash component definition
	fingerprint() {
		const id = this.componentName() || this.renderFunctionAsStr();
		const message = 'Cannot fingerprint component.';
		const advice = 'Either set a name in your component or use a functional component';
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
		const comp = this.component;
		if (comp.render) return comp.render.toString();
		if (comp.componentOptions.Ctor.options)
			return comp.componentOptions.Ctor.options.toString();
		return undefined;
	}

	static print(comp) {
		return new Fingerprinter(comp).fingerprint();
	}
}

module.exports = Fingerprinter;

import Fingerprint from './fingerprinter';
import config from './config';

class Validator {
	constructor(components) {
		this.components = components;
		this.fingerprints = components.map(c => new Fingerprint(c).fingerprint())
	}

	validate() {
		this.showWarningsForUnprovidedComponents();
		this.throwErrorforDuplicateNames();
	}

	showWarningsForUnprovidedComponents() {
		if (process && process.env && process.env.NODE_ENV === 'production') return;
		const elements = document.querySelectorAll(`[${config.attrs.fingerprint}]`);
		[...elements].forEach(el => this.checkIfComponentIsProvided(el));
	}

	checkIfComponentIsProvided(el) {
		const fingerprintInAttr = el.getAttribute(config.attrs.fingerprint);
		const fingerprintMatch = ({ name }) => name === fingerprintInAttr;
		const componentProvidedForEl = this.fingerprints.find(fingerprintMatch);
		if (!componentProvidedForEl) {
			const msg = `Vue Moisturizer: You did not provide the component "${fingerprintInAttr}" in the client`;
			console.error(msg);
		}
	}

	throwErrorforDuplicateNames() {
		const duplicates = this.getDuplicates();
		if (duplicates.length === 0) return;
		const warning = 'You are trying to hydrate multiple components that have the same name!';
		const advice = `Please provide different names for components using ${duplicates.join(
			', '
		)}`;
		throw new Error(`${warning}\n${advice}`);
	}

	getDuplicates() {
		return Object.values(this.groupComponents())
			.filter(group => group.length > 1)
			.map(comps => `"${comps[0].name}"`);
	}

	groupComponents() {
		return this.components.reduce((dupes, comp) => {
			dupes[comp.name] = dupes[comp.name] || [];
			dupes[comp.name].push(comp);
			return dupes;
		}, {});
	}
}

module.exports = Validator;
const hasDuplicates = require('has-duplicates');
const Fingerprint = require('./fingerprinter');
const config = require('./config');

class Validator {
	constructor(components) {
		this.components = components;
		this.fingerprints = components.map(c => Fingerprint.print(c));
	}

	validate() {
		this.showWarningsForUnprovidedComponents();
		this.throwErrorforDuplicateFingerprints();
	}

	showWarningsForUnprovidedComponents() {
		if (process && process.env && process.env.NODE_ENV === 'production') return;
		const elements = document.querySelectorAll(`[${config.attrs.fingerprint}]`);
		[...elements].forEach(el => this.checkIfComponentIsProvided(el));
	}

	// TODO Provide human-readable message which component is actually missing
	checkIfComponentIsProvided(el) {
		const fingerprintInAttr = el.getAttribute(config.attrs.fingerprint);
		const fingerprintMatch = name => name === fingerprintInAttr;
		const componentProvidedForEl = this.fingerprints.find(fingerprintMatch);
		if (!componentProvidedForEl) {
			const msg = `Vue Moisturizer: You did not provide the component "${fingerprintInAttr}" in the client`;
			console.error(msg);
		}
	}

	// TODO Tell the programmer which components are dupes
	throwErrorforDuplicateFingerprints() {
		if (hasDuplicates(this.fingerprints)) {
			const warning = `You are trying to hydrate multiple components that have the same fingerprint!`;
			const advice = `Please provide different names for components or use functional components`;
			throw new Error(`${warning}\n${advice}`);
		}
	}
}

module.exports = Validator;

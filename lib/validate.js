const config = require('./config');

function validateComponents(components) {
	showWarningsForUnprovidedComponents(components);
	throwErrorforDuplicateNames(components);
}

function showWarningsForUnprovidedComponents(components) {
	if (process && process.env && process.env.NODE_ENV === 'production') return;
	const elements = document.querySelectorAll(`[${config.attrs.name}]`);
	[...elements].forEach(el => checkIfComponentIsProvided(el, components));
}

function checkIfComponentIsProvided(el, components) {
	const nameInAttr = el.getAttribute(config.attrs.name);
	const componentProvidedForEl = components.find(({ name }) => name === nameInAttr);
	if (!componentProvidedForEl) {
		const msg = `Vue Moisturizer: You did not provide the component "${nameInAttr}" in the client`;
		console.error(msg);
	}
}

function throwErrorforDuplicateNames(components) {
	const duplicates = getDuplicates(components);
	if (duplicates.length === 0) return;
	const warning = 'You are trying to hydrate multiple components that have the same name!';
	const advice = `Please provide different names for components using ${duplicates.join(', ')}`;
	throw new Error(`${warning}\n${advice}`);
}

function getDuplicates(components) {
	return Object.values(groupComponents(components))
		.filter(group => group.length > 1)
		.map(comps => `"${comps[0].name}"`);
}

function groupComponents(components) {
	return components.reduce((dupes, comp) => {
		dupes[comp.name] = dupes[comp.name] || [];
		dupes[comp.name].push(comp);
		return dupes;
	}, {});
}

module.exports = validateComponents;

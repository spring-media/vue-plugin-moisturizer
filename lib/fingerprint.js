const md5 = require('md5');

module.exports = function fingerprint(component) {
	const id = componentName(component) || renderFunctionAsStr(component);
	if (!id) throw new Error('Cannot fingerprint component');
	return md5(id);
};

function componentName(component) {
	try {
		return component.name || component.$vnode.componentOptions.Ctor.options.name;
	} catch (err) {
		return undefined;
	}
}

function renderFunctionAsStr(component) {
	try {
		return component.render.toString();
	} catch (err) {
		return undefined;
	}
}

function serialize(slots) {
	const strippedSlots = stripSlots(slots);
	const slotsStr = JSON.stringify(strippedSlots);
	return slotsStr.replace(/'/g, "\\'").replace(/"/g, "'");
}

function stripSlots(slots) {
	const def = slots.default.map(slot => stripSlot(slot));
	return { default: def };
}

function stripSlot(slot) {
	if (slot.text) return getText(slot);
	if (slot.componentOptions) return getComponent(slot);
	if (slot.tag && !slot.componentOptions) return getTag(slot);
	throw new Error('Cannot handle slot', slot);
}

function getText(slot) {
	return { type: 'text', text: slot.text };
}

function getTag(slot) {
	const children = slot.children || [];
	return { type: 'tag', name: slot.tag, children: children.map(stripSlot) };
}

function getComponent(slot) {
	return { type: 'component', name: slot.componentOptions.Ctor.options.name };
}

function deserialize(slotssStr) {
	const slotsObject = slotssStr.replace(/'/g, '"').replace(/\\"/g, '"');
	return JSON.parse(slotsObject);
}

module.exports.serialize = serialize;
module.exports.deserialize = deserialize;

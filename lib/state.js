const state = {};

function set(key, val) {
	state[key] = val;
}

function get(key) {
	if (key) return state[key];
	console.log('returning state', state);
	return state;
}

module.exports.set = set;
module.exports.get = get;

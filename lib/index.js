const MoisturizerVuePlugin = require('./moisturizerVuePlugin');
const AppInstantiator = require('./appInstantiator');
const Hydrator = require('./hydrator');

module.exports = MoisturizerVuePlugin;
module.exports.instantiateApp = (comp, options) => new AppInstantiator(comp, options).instantiate();
module.exports.hydrateComponents = (comps, options) => new Hydrator(comps, options).hydrate();

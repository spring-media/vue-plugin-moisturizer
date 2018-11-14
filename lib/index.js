const MoisturizerVuePlugin = require('./moisturizerVuePlugin');
const AppInstantiator = require('./appInstantiator');
const Hydrator = require('./hydrator');

module.exports = MoisturizerVuePlugin;
module.exports.instantiateApp = (comp, options, vue) => new AppInstantiator(comp, options, vue).instantiate();
module.exports.hydrateComponents = (comps, options) => new Hydrator(comps, options).hydrate();

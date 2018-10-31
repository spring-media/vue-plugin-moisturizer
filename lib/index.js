const MoisturizerVuePlugin = require('./moisturizerVuePlugin');
const instantiateApp = require('./instantiateApp');
const hydrateComponents = require('./hydrateComponents');
const state = require('./state');

module.exports = MoisturizerVuePlugin;
module.exports.instantiateApp = instantiateApp;
module.exports.hydrateComponents = hydrateComponents;
module.exports.getState = () => state.get();

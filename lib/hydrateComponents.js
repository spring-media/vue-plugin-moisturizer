const Vue = require('vue').default;

function hydrateComponents(components, vueOptions) {
  return components.map(component => {
    const render = h => h(component);
    const elements = document.querySelectorAll(`[data-hydrate="${component.name}"]`);
    const instances = [...elements].map(el => new Vue({ ...vueOptions, render }).$mount(el));
    return { component, instances };
  });
}

module.exports = hydrateComponents;
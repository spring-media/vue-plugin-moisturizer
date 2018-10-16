const Vue = require("vue").default || require("vue");

const attr = "data-hydrate";

function hydrateComponents(components, vueOptions = {}) {
  showWarningsForUnprovidedComponents(components);
  throwErrorforDuplicateNames(components);
  return components.map(component => {
    const render = h => h(component);
    const elements = document.querySelectorAll(`[${attr}="${component.name}"]`);
    const instances = [...elements].map(el => new Vue({ ...vueOptions, render }).$mount(el));
    return { component, instances };
  });
}

function showWarningsForUnprovidedComponents(components) {
  if (process.env.NODE_ENV === "production") return;
  const elements = document.querySelectorAll(`[${attr}]`);
  [...elements].forEach(el => {
    const attrName = el.getAttribute(attr);
    const componentProvidedForEl = components.find(({ name }) => name === attrName);
    if (!componentProvidedForEl) console.warn(`Vue Moisturizer: You did not provide the component "${attrName}" in the client`);
  });
}

function throwErrorforDuplicateNames(components) {
  const duplicates = getDuplicates(components);
  if (duplicates.length) {
    const duplicateComponentNames = duplicates.map(comps => `"${comps[0].name}"`).join(", ");
    const infoMsg = ["You are trying to hydrate multiple components that have the same name!", `Please provide different names for components using ${duplicateComponentNames}`];
    throw new Error(infoMsg.join("\n"));
  }
}

function getDuplicates(components) {
  return Object.values(groupComponents(components)).filter(group => group.length > 1);
}

function groupComponents(components) {
  return components.reduce((dupes, comp) => {
    dupes[comp.name] = dupes[comp.name] || [];
    dupes[comp.name].push(comp);
    return dupes;
  }, {});
}

module.exports = hydrateComponents;

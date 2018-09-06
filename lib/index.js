const componentsToHydrate = [];
const hidDomAttr = "data-hid";

function getHid(component) {
  return componentsToHydrate.findIndex(
    componentToHydrate =>
      getComponentFileName(componentToHydrate) ===
      getComponentFileName(component)
  );
}

function getComponentFileName(component) {
  return component.__file || component.constructor.options.__file;
}

const MoisturizerPlugin = {
  install: Vue => Vue.mixin({
    created: function() {
      if (this.hydrate) {
        this.$vnode.data = this.$vnode.data || {};
        this.$vnode.data.attrs = this.$vnode.data.attrs || {};
        this.$vnode.data.attrs[hidDomAttr] = getHid(this);
      }
    },
    props: {
      hydrate: {
        type: Boolean,
        default: false
      }
    }
  })
}

function hydrateComponents(componentsToHydrate) {
  return componentsToHydrate.map(component => {
    const render = h => h(component);
    const hid = getHid(component);
    const domElements = document.querySelectorAll(`[${hidDomAttr}="${hid}"]`);
    Array.prototype.forEach.call(domElements, el =>
      new Vue({ router, provide, render }).$mount(el)
    );
    return { component, domElements };
  });
}

function addComponentsToHydrate(components = []) {
  componentsToHydrate.push(...components);
}

function getComponentsToHydrate() {
  return componentsToHydrate;
}

export default MoisturizerPlugin;

export {
  hydrateComponents,
  addComponentsToHydrate,
  getComponentsToHydrate,
};

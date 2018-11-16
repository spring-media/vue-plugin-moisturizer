import Fingerprint from '../lib/fingerprinter';
import Props from '../lib/props';
import Slots from '../lib/slots';
import { createLocalVue, mount } from '@vue/test-utils';
import MoisturizerVuePlugin from '../lib/moisturizerVuePlugin';

export const createHTMLNode = (name, component, innerHtml = '', attributes = {}) => {
  const fp = `fingerprint="${new Fingerprint (component).fingerprint()}"`;
  const props = `props="${new Props(component).serialize(component.$props || [])}"`;
  const slots = `slots="${new Slots(component).serialize(component.$slots || [])}"`;
  const attrs = Object.keys(attributes).map(x => `${x}="${attributes[x]}"`);

  return `<${name} ` +
    [fp, props, slots].map(x => 'data-hydrate-' + x).join(' ')
    + (!attrs ? '' : ' ' + attrs.join(' '))
    + `>${innerHtml}</${name}>`;
};

export const setLocalVueEnv = (localVue, isServer) => {
  Object.defineProperty (localVue.prototype, '$isServer', {
    get: () => isServer,
  });
};

export const init = (components = []) => {
  const localVue = createLocalVue ();
  const isServer = true;
  setLocalVueEnv (localVue, isServer);
  localVue.use (MoisturizerVuePlugin);
  const mounted = components.map (c => mount (c));
  return { mounted, localVue };
};

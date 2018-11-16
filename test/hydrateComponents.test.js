import { hydrateComponents } from '../lib/.';
import A from './fixtures/components/A.vue';
import B from './fixtures/components/B.vue';
import AConflict from './fixtures/components/A.conflict.vue';
import BConflict from './fixtures/components/B.conflict.vue';
import Wet from './fixtures/components/Wet.vue';
import Fingerprint from '../lib/fingerprinter';
import { createLocalVue, mount } from '@vue/test-utils';
import MoisturizerVuePlugin from '../lib/moisturizerVuePlugin';
import Slots from '../lib/slots';
import Props from '../lib/props';


const setLocalVueEnv = (localVue, isServer) => {
  Object.defineProperty (localVue.prototype, '$isServer', {
  	get: () => isServer,
  });
};

const init = (components) => {
  const localVue = createLocalVue ();
  const isServer = true;
  setLocalVueEnv (localVue, isServer);
  localVue.use(MoisturizerVuePlugin);
  return components.map (c => mount (c));
};

const createHTMLNode = (name, component, innerHtml = '', attributes = {}) => {
  const fp = `fingerprint="${new Fingerprint (component).fingerprint()}"`;
  const props = `props="${new Props(component).serialize(component.$props || [])}"`;
  const slots = `slots="${new Slots(component).serialize(component.$slots || [])}"`;
  const attrs = Object.keys(attributes).map(x => `${x}="${attributes[x]}"`);

  return `<${name} ` +
    [fp, props, slots].map(x => 'data-hydrate-' + x).join(' ')
    + (!attrs ? '' : ' ' + attrs.join(' '))
    + `>${innerHtml}</${name}>`;
};

test('applies template to containers without markup', () => {
  const wrappers = init([A, B]);
  const aHTML = createHTMLNode('a', wrappers[0].vm);
  const bHTML = createHTMLNode('a', wrappers[1].vm);
  document.body.innerHTML = aHTML + bHTML;
  hydrateComponents([A, B]);
  expect(document.body.innerHTML).toBe('<a>A</a><a>B</a>');
});

test('applies template to containers with mismatching markup', () => {
  const wrappers = init([A]);
  document.body.innerHTML = createHTMLNode('a', wrappers[0].vm, 'foo <em>bar</em>');
  hydrateComponents ([A]);
  expect (document.body.innerHTML).toBe('<a>A</a>');
});

test('hydrates components with fitting markup', () => {
  const wrappers = init([A]);
  document.body.innerHTML = createHTMLNode('a', wrappers[0].vm, 'A');
  hydrateComponents([A]);
  expect (document.body.innerHTML).toBe('<a>A</a>');
});

test('hydrates components with existing attributes', () => {
  const wrappers = init([Wet]);
  document.body.innerHTML = createHTMLNode('a', wrappers[0].vm, 'A', {custom: "Stuff"});
  hydrateComponents([Wet]);
  expect (document.body.innerHTML).toBe('<div custom="Stuff">Got: Stuff</div>');
});

test('enables javascript on hydration', () => {
  const wrappers = init ([A]);
  window.spy = jest.fn ();
  document.body.innerHTML = createHTMLNode ('a', wrappers[0].vm, 'A');
  hydrateComponents ([A]);
  document.querySelector ('a').click ();
  expect (window.spy).toHaveBeenCalledWith ('A');
});

test('throws error if 2 components have the same name', () => {
  expect(() =>
    hydrateComponents([A, B, AConflict, BConflict]),
  ).toThrowErrorMatchingSnapshot();
});

test('logs a warning if a component is not provided for hydration', () => {
   const spy = jest.spyOn(console, 'error').mockImplementation(() => {
  });
   document.body.innerHTML =
    '<a data-hydrate="X">X</a><a data-hydrate="Y">Y</a>';
  hydrateComponents([A]);
  expect(console.error).toHaveBeenCalledWith (
    'Vue Moisturizer: You did not provide the component "X" in the client',
  );
  expect(console.error).toHaveBeenCalledWith (
    'Vue Moisturizer: You did not provide the component "Y" in the client',
  );
  spy.mockRestore();
});

test('does not log warnings in production env', () => {
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {
  });
  const orignalEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  document.body.innerHTML =
    '<a data-hydrate="X">X</a><a data-hydrate="Y">Y</a>';
  hydrateComponents([A]);
  expect(console.warn).not.toHaveBeenCalled();
  spy.mockRestore();
  process.env.NODE_ENV = orignalEnv;
});

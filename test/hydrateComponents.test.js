import { hydrateComponents } from '../lib/.';
import A from './fixtures/components/A.vue';
import B from './fixtures/components/B.vue';
import AConflict from './fixtures/components/A.conflict.vue';
import BConflict from './fixtures/components/B.conflict.vue';
import Wet from './fixtures/components/Wet.vue';
import { createHTMLNode, init } from './utils';
import Handlebars from './fixtures/components/Handlebars.vue';
import HandlebarsNoProp from './fixtures/components/HandlebarsNoProp.vue';
import Conditional from './fixtures/components/Conditional.vue';
import { mount } from '@vue/test-utils';


test('applies template to containers without markup', () => {
  const {mounted} = init([A, B]);
  const aHTML = createHTMLNode('a', mounted[0].vm);
  const bHTML = createHTMLNode('a', mounted[1].vm);
  document.body.innerHTML = aHTML + bHTML;
  hydrateComponents([A, B]);
  expect(document.body.innerHTML).toBe('<a>A</a><a>B</a>');
});

test('applies template to containers with mismatching markup', () => {
  const {mounted} = init([A]);
  document.body.innerHTML = createHTMLNode('a', mounted[0].vm, 'foo <em>bar</em>');
  hydrateComponents([A]);
  expect(document.body.innerHTML).toBe('<a>A</a>');
});

test('hydrates components with fitting markup', () => {
  const {mounted} = init([A]);
  document.body.innerHTML = createHTMLNode('a', mounted[0].vm, 'A');
  hydrateComponents([A]);
  expect(document.body.innerHTML).toBe('<a>A</a>');
});

test('hydrates components with serialized props', () => {
  init();
  const mounted = mount(Handlebars, {propsData: {nickname: 'John Doe'}});
  document.body.innerHTML = createHTMLNode('a', mounted.vm, 'A');
  hydrateComponents([Handlebars]);
  expect(document.body.innerHTML).toBe('<div>John Doe</div>');
});

test('hydrates components with existing attributes', () => {
  const {mounted} = init([Wet]);
  document.body.innerHTML = createHTMLNode('a', mounted[0].vm, 'A', {custom: "Stuff"});
  hydrateComponents([Wet]);
  expect(document.body.innerHTML).toBe('<div custom="Stuff">Got: Stuff</div>');
});


test("hydrates components with attribute props", () => {
  const {mounted} = init([Handlebars]);
  document.body.innerHTML = createHTMLNode('a', mounted[0].vm, '', {nickname: 'Bernd'});
  hydrateComponents([Handlebars]);
  expect(document.body.innerHTML).toBe('<div>Bernd</div>');
});

test("hydrates components without attribute props", () => {
  const {mounted} = init([HandlebarsNoProp]);
  document.body.innerHTML = createHTMLNode('a', mounted[0].vm);
  hydrateComponents([HandlebarsNoProp]);
  expect(document.body.innerHTML).toMatch('<div></div>');
});

test("hydrates conditional components with attribute props", () => {
  const {mounted} = init([Conditional]);
  document.body.innerHTML = createHTMLNode('a', mounted[0].vm, '', {name: 'Bernd'});
  hydrateComponents([Conditional]);
  expect(document.body.innerHTML).toMatch('<div><b>Bernd</b></div>');
});

test("hydrates conditional components without attribute props", () => {
  const {mounted} = init([Conditional]);
  document.body.innerHTML = createHTMLNode('a', mounted[0].vm);
  hydrateComponents([Conditional]);
  expect(document.body.innerHTML).toMatch('<div><i>No Name</i></div>');
});

test('enables javascript on hydration', () => {
  const {mounted} = init ([A]);
  window.spy = jest.fn ();
  document.body.innerHTML = createHTMLNode ('a', mounted[0].vm, 'A');
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
    '<a data-hydrate-fingerprint="unknown-fp-1234">X</a><a data-hydrate-fingerprint="unknown-fp-4231">Y</a>';
  hydrateComponents([A]);
  expect(console.error).toHaveBeenCalledWith (
    'Vue Moisturizer: You did not provide the component "unknown-fp-1234" in the client',
  );
  expect(console.error).toHaveBeenCalledWith (
    'Vue Moisturizer: You did not provide the component "unknown-fp-4231" in the client',
  );
  spy.mockRestore();
});

test('does not log warnings in production env', () => {
  const spy = jest.spyOn (console, 'warn').mockImplementation (() => {
  });
  const orignalEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  document.body.innerHTML =
    '<a data-hydrate-fingerprint="unknown-fp-1234">X</a><a data-hydrate-fingerprint="unknown-fp-4231">Y</a>';
  hydrateComponents ([A]);
  expect (console.warn).not.toHaveBeenCalled ();
  spy.mockRestore ();
  process.env.NODE_ENV = orignalEnv;
});


/*
 * @jest-environment node
 */

import { createLocalVue } from '@vue/test-utils';
import Moisturizer from '../lib/moisturizerVuePlugin';
import Hydrate from './fixtures/components/Hydrate.vue';
import Fingerprint from '../lib/fingerprinter';
import config from '../lib/config';
import { render } from '@vue/server-test-utils';


const setupServerEnvironment = (localVue, isServer) => {
	Object.defineProperty (localVue.prototype, '$isServer', {
		get: () => isServer,
	});
};

const init = () => {
	const localVue = createLocalVue ();
	setupServerEnvironment(localVue, true);
	localVue.use(Moisturizer);
  return localVue
};


test("adds the the comps fingerprint as data prop if hydrate is true", () => {
  const localVue = init();
  const wrapper = render(Hydrate, {
    propsData: { hydrate: true },
    localVue
  });
  const fingerprint = new Fingerprint(Hydrate).fingerprint();
  expect(wrapper.attr(config.attrs.fingerprint)).toBe(fingerprint);
});

test("does not add the the comps name as data prop if hydrate is true", () => {
  init();
  const wrapper = render(Hydrate);
  expect(wrapper.attr(config.attrs.fingerprint)).toBe(undefined);
});

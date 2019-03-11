/*
 * @jest-environment node
 */

import { init } from './utils';
import { render, renderToString } from '@vue/server-test-utils';
import Hydrate from './fixtures/components/Hydrate.vue';
import WithSlots from './fixtures/components/WithSlots.vue';
import Fingerprint from '../src/fingerprinter';
import config from '../src/config';


test("adds the comps fingerprint as data prop if hydrate is true", () => {
  const {localVue} = init();
  const wrapper = render(Hydrate, {
    propsData: { hydrate: true },
    localVue
  });
  const fingerprint = Fingerprint.print(Hydrate);
  expect(wrapper.attr(config.attrs.fingerprint)).toBe(fingerprint);
});

test("does not add the the comps fingerprint as data prop if hydrate is true", () => {
  init();
  const wrapper = render(Hydrate);
  expect(wrapper.attr(config.attrs.fingerprint)).toBe(undefined);
});

test("can serlialize component with slot", () => {
  const {localVue} = init();
  const slot = {
    name: 'SomeSlot',
    render: (h) => h('b', 'slot'),
  };
  const wrapper = renderToString(WithSlots, {
    propsData: { hydrate: true },
    slots: {default: slot},
    localVue
  });
  expect(wrapper).toMatch('<b>slot</b>');
});


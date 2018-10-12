import Vue from "vue";
import { shallowMount } from "@vue/test-utils";
import Moisturizer from "../lib/moisturizerVuePlugin";
import Hydrate from "./fixtures/components/Hydrate.vue";

test("adds the the comps name as data prop if hydrate is true", () => {
  Vue.use(Moisturizer);
  const wrapper = shallowMount(Hydrate, {
    propsData: { hydrate: true }
  });
  expect(wrapper.attributes("data-hydrate")).toBe("Hydrate");
});

test("does not add the the comps name as data prop if hydrate is true", () => {
  Vue.use(Moisturizer);
  const wrapper = shallowMount(Hydrate);
  expect(wrapper.attributes("data-hydrate")).toBe(undefined);
});

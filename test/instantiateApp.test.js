import Vue from "vue";
import {instantiateApp} from "../lib/index";
import App from "./fixtures/components/App.vue";

test("returns a Vue instance without Vue options", () => {
  expect(instantiateApp(App)).toBeInstanceOf(Vue);
});

test("returns a Vue instance with Vue options", () => {
  const vueOptions = true;
  const vueInstance = instantiateApp(App, { vueOptions });
  expect(vueInstance.$options.vueOptions).toBe(vueOptions);
});

test("returns a Vue instance that can be rendered", () => {
  document.body.innerHTML = '<div id="app"></div>';
  instantiateApp(App).$mount("#app");
  expect(document.body.innerHTML).toBe("<div>App</div>");
});

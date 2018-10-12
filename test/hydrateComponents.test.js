import hydrateComponents from "../lib/hydrateComponents";
import A from "./fixtures/components/A.vue";
import B from "./fixtures/components/B.vue";
import AConflict from "./fixtures/components/A.conflict.vue";
import BConflict from "./fixtures/components/B.conflict.vue";

test("applies template to containers without markup", () => {
  document.body.innerHTML = '<a data-hydrate="A"></a><a data-hydrate="B"></a>';
  hydrateComponents([A, B]);
  expect(document.body.innerHTML).toBe("<a>A</a><a>B</a>");
});

test("applies template to containers with mismatching markup", () => {
  document.body.innerHTML = '<a data-hydrate="A">foo <em>bar</em></a>';
  hydrateComponents([A]);
  expect(document.body.innerHTML).toBe("<a>A</a>");
});

test("hydrates components with fitting markup", () => {
  document.body.innerHTML = '<a data-hydrate="A">A</a>';
  hydrateComponents([A]);
  expect(document.body.innerHTML).toBe("<a>A</a>");
});

test("enables javascript on hydration", () => {
  window.spy = jest.fn();
  document.body.innerHTML = '<a data-hydrate="A">A</a>';
  hydrateComponents([A]);
  document.querySelector("a").click();
  expect(window.spy).toHaveBeenCalledWith("A");
});

test("throws error if 2 components have the same name", () => {
  expect(() =>
    hydrateComponents([A, B, AConflict, BConflict])
  ).toThrowErrorMatchingSnapshot();
});

test("logs a warning if a component is not provided for hydration", () => {
  const spy = jest.spyOn(console, "warn").mockImplementation(() => {});
  document.body.innerHTML =
    '<a data-hydrate="X">X</a><a data-hydrate="Y">Y</a>';
  hydrateComponents([A]);
  expect(console.warn).toHaveBeenCalledWith(
    'Vue Moisturizer: You did not provide the component "X" in the client'
  );
  expect(console.warn).toHaveBeenCalledWith(
    'Vue Moisturizer: You did not provide the component "Y" in the client'
  );
  spy.mockRestore();
});

test("does not log warnings in production env", () => {
  const spy = jest.spyOn(console, "warn").mockImplementation(() => {});
  const orignalEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";
  document.body.innerHTML =
    '<a data-hydrate="X">X</a><a data-hydrate="Y">Y</a>';
  hydrateComponents([A]);
  expect(console.warn).not.toHaveBeenCalled();
  spy.mockRestore();
  process.env.NODE_ENV = orignalEnv;
});

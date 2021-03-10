import { Rhum } from "../testing_deps.ts";

import mapObject from "./objects/mapObject.ts";
import invert from "./objects/invert.ts";
import findKeys from "./objects/findKeys.ts";
import get from "./objects/get.ts";

Rhum.testPlan("objects/*", () => {
  Rhum.testSuite("mapObject()", () => {
    Rhum.testCase("should map an object", () => {
      const testObj = {
        one: 1,
        two: 2,
        three: 3,
      };
      const returned = mapObject<number, string>(testObj, (n: number): string =>
        (n * n * 100).toString()
      );
      Rhum.asserts.assertEquals(returned, {
        one: "100",
        two: "400",
        three: "900",
      });
    });
  });
  Rhum.testSuite("invert()", () => {
    Rhum.testCase("should invert an objects keys and values", () => {
      Rhum.asserts.assertEquals(
        invert({ Moe: "Moses", Larry: "Louis", Curly: "Jerome" }),
        { Moses: "Moe", Louis: "Larry", Jerome: "Curly" }
      );
    });
  });
  Rhum.testSuite("findKeys()", () => {
    Rhum.testCase("should find all keys where the value holds true", () => {
      Rhum.asserts.assertEquals(
        findKeys({ a: 1, b: 2, c: 3 }, (x: number) => x % 2 === 1),
        ["a", "c"]
      );
      Rhum.asserts.assertEquals(
        findKeys({ c: 1, b: 2, a: 3 }, (x: number) => x % 2 === 1),
        ["a", "c"]
      );
    });
  });

  Rhum.testSuite("get()", () => {
    const testObj = {
      a: {
        b: 2,
        c: {
          d: false,
          e: ["foo", "bar", { baz: "quux" }],
        },
      },
    };
    Rhum.testCase("should get objects by a path", () => {
      Rhum.asserts.assertStrictEquals(
        get(testObj, ["a", "c", "e", 2, "baz"], "nope"),
        "quux"
      );
    });
    Rhum.testCase("should return whole objects", () => {
      Rhum.asserts.assertEquals(get(testObj, ["a", "c"], "nope"), {
        d: false,
        e: ["foo", "bar", { baz: "quux" }],
      });
    });
    Rhum.testCase("should a default if path does not exist", () => {
      Rhum.asserts.assertStrictEquals(
        get(testObj, ["a", "q", "c"], "nope"),
        "nope"
      );
      Rhum.asserts.assertStrictEquals(
        get(testObj, ["a", "b", "c"], "nope"),
        "nope"
      );
    });
    Rhum.testCase("should work with strings", () => {
      Rhum.asserts.assertEquals(get(testObj, "a.c.e", "nope"), [
        "foo",
        "bar",
        { baz: "quux" },
      ]);
    });
    Rhum.testCase("should work with a mix of arrays and strings", () => {
      Rhum.asserts.assertStrictEquals(get(testObj, ['a.c', 'e', 2, 'baz'], "nope"), 'quux');
    })
  });
});

Rhum.run();

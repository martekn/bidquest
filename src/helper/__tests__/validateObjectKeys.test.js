import { expect, describe, it } from "vitest";
import { validateObjectKeys } from "../validateObjectKeys";

describe("validateObjectKeys", () => {
  it("should return true when all expected keys are present in the object", () => {
    const object = { key1: "value1", key2: "value2" };
    const expectedKeys = ["key1", "key2"];
    const result = validateObjectKeys(object, expectedKeys);
    expect(result).toBe(true);
  });

  it("should return false when the object is missing some of the expected keys", () => {
    const object = { key1: "value1" };
    const expectedKeys = ["key1", "key2"];
    const result = validateObjectKeys(object, expectedKeys);
    expect(result).toBe(false);
  });

  it("should return true when the object contains all expected keys, even if the object contains additional keys", () => {
    const object = { key1: "value1", key2: "value2", key3: "value3" };
    const expectedKeys = ["key1", "key2"];
    const result = validateObjectKeys(object, expectedKeys);
    expect(result).toBe(true);
  });
  it("should return false when the object is null", () => {
    const object = null;
    const expectedKeys = ["key1", "key2"];
    const result = validateObjectKeys(object, expectedKeys);
    expect(result).toBe(false);
  });

  it("should return false when the object is undefined", () => {
    const object = undefined;
    const expectedKeys = ["key1", "key2"];
    const result = validateObjectKeys(object, expectedKeys);
    expect(result).toBe(false);
  });

  it("should return true when both the object and expectedKeys are empty", () => {
    const object = {};
    const expectedKeys = [];
    const result = validateObjectKeys(object, expectedKeys);
    expect(result).toBe(true);
  });

  it("should return true when expectedKeys is empty but the object is not", () => {
    const object = { key1: "value1" };
    const expectedKeys = [];
    const result = validateObjectKeys(object, expectedKeys);
    expect(result).toBe(true);
  });

  it("should return false when expectedKeys is not empty but the object is", () => {
    const object = {};
    const expectedKeys = ["key1", "key2"];
    const result = validateObjectKeys(object, expectedKeys);
    expect(result).toBe(false);
  });
});

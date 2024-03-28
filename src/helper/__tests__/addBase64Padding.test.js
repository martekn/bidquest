import { expect, describe, it } from "vitest";
import { addBase64Padding } from "../addBase64Padding";

describe("addBase64Padding", () => {
  it("should add padding to make the length a multiple of 4 when length is less than 4", () => {
    const value = "abc";
    const paddedValue = addBase64Padding(value);
    expect(paddedValue).toBe("abc=");
  });

  it("should add padding to make the length a multiple of 4 when length is more than 4", () => {
    const value = "abcde";
    const paddedValue = addBase64Padding(value);
    expect(paddedValue).toBe("abcde===");
  });

  it("should not add padding if the length is already a multiple of 4", () => {
    const value = "abcd";
    const paddedValue = addBase64Padding(value);
    expect(paddedValue).containSubset("abcd");
  });

  it("should throw an error if input is not a string", () => {
    const value = 123;
    expect(() => addBase64Padding(value)).toThrow(TypeError);
  });
});

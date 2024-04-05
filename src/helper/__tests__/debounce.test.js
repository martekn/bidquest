import { expect, describe, it } from "vitest";
import { debounce } from "../debounce";

describe("debounce", () => {
  it("should call the function only once", async () => {
    let counter = 0;
    const func = () => {
      counter += 1;
    };

    const debouncedFunc = debounce(func, 150);
    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(counter).toBe(1);
  });

  it("should call the function the correct number of times for multiple calls after the timeout", async () => {
    let counter = 0;
    const func = () => {
      counter += 1;
    };

    const debouncedFunc = debounce(func, 150);
    debouncedFunc();
    await new Promise((resolve) => setTimeout(resolve, 200));
    debouncedFunc();
    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(counter).toBe(2);
  });

  it("should not call the function before the timeout", async () => {
    let counter = 0;
    const func = () => {
      counter += 1;
    };

    const debouncedFunc = debounce(func, 150);
    debouncedFunc();

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(counter).toBe(0);
  });

  it("should call the function with the correct arguments", async () => {
    let arg;
    const func = (param) => {
      arg = param;
    };

    const debouncedFunc = debounce(func, 150);
    debouncedFunc("test argument");

    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(arg).toBe("test argument");
  });
});

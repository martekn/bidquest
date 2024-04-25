import { expect, describe, it, afterEach } from "vitest";
import { HistoryStack } from "../HistoryStack";

describe("HistoryStack.get", () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it("should return history if stack is present in session storage", () => {
    sessionStorage.setItem("historyStack", JSON.stringify(["/", "/auctions"]));

    expect(HistoryStack.get()).toStrictEqual(["/", "/auctions"]);
  });

  it("should return empty array if no stack in session storage", () => {
    expect(HistoryStack.get()).toStrictEqual([]);
  });
});

describe("HistoryStack.update", () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it("should add path and set history stack to session storage", () => {
    HistoryStack.update("/auctions");
    const historyStack = HistoryStack.get();
    expect(historyStack[0]).toBe("/auctions");
  });

  it("should not be longer than 25 members", () => {
    const arr = [];
    arr.length = 25;

    sessionStorage.setItem("historyStack", JSON.stringify(arr));
    let historyStack = HistoryStack.get();
    expect(historyStack.length).toBe(25);
    expect(historyStack[historyStack.length - 1]).not.toBe("/auctions");

    HistoryStack.update("/auctions");
    historyStack = HistoryStack.get();
    expect(historyStack.length).toBe(25);
    expect(historyStack[historyStack.length - 1]).toBe("/auctions");
  });

  it("should throw when argument passed is not a string", () => {
    expect(() => HistoryStack.update(123)).toThrow();
  });
});

describe("HistoryStack.clear", () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it("should set session storage to empty array", () => {
    const arr = [];
    arr.length = 25;

    sessionStorage.setItem("historyStack", JSON.stringify(arr));
    expect(HistoryStack.get().length).toBe(25);

    HistoryStack.clear();
    expect(HistoryStack.get().length).toBe(0);
  });
});

describe("HistoryStack.lastVisited", () => {
  it("should return last path of array if array is not empty", () => {
    HistoryStack.update("/auctions");
    expect(HistoryStack.lastVisited()).toBe("/auctions");
  });

  it("should return path to homepage if array is empty", () => {
    HistoryStack.clear();
    expect(HistoryStack.lastVisited()).toBe("/");
  });
});

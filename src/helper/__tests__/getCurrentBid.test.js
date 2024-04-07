import { expect, describe, it } from "vitest";
import { getCurrentBid } from "../getCurrentBid";

describe("getCurrentBid", () => {
  it("should return 0 for an empty array of bids", () => {
    const emptyBids = [];
    expect(getCurrentBid(emptyBids)).toBe(0);
  });

  it("should return the highest bid amount", () => {
    const bids = [{ amount: "100" }, { amount: "150" }, { amount: "200" }];
    expect(getCurrentBid(bids)).toBe(200);
  });

  it("should throw an error for bid amounts that cant be turned into a number", () => {
    const invalidBids = [{ amount: "invalid" }, { amount: "150" }, { amount: "200" }];
    expect(() => getCurrentBid(invalidBids)).toThrow(Error);
  });

  it("should throw a TypeError when anything but an array is passed in", () => {
    const nonArray = "not an array";
    expect(() => getCurrentBid(nonArray)).toThrow(TypeError);
  });
});

import { expect, describe, it } from "vitest";
import { createRequestObject } from "../createRequestObject";

describe("createRequestObject", () => {
  it("should create a request object with the provided arguments", () => {
    const endpoint = "/data";
    const params = { id: 123 };
    const token = "abc123";
    const method = "GET";
    const body = { key: "value" };

    const requestObject = createRequestObject(endpoint, params, token, method, body);

    expect(requestObject).toEqual({
      endpoint,
      params,
      token,
      method,
      body
    });
  });

  it("should create a request object with null values for missing arguments", () => {
    const endpoint = "/data";

    const requestObject = createRequestObject(endpoint, null, null, null, null);

    expect(requestObject).toEqual({
      endpoint,
      params: null,
      token: null,
      method: null,
      body: null
    });
  });

  it("should throw an error when endpoint is not a string or null", () => {
    expect(() => createRequestObject(undefined)).toThrow();
  });

  it("should throw an error when params is not an object or null", () => {
    expect(() => createRequestObject("/data", 0)).toThrow();
  });

  it("should throw an error when token is not a string or null", () => {
    expect(() => createRequestObject("/data", {}, false)).toThrow();
  });

  it("should throw an error when method is not a string or null", () => {
    expect(() => createRequestObject("/data", {}, "abc123", "")).toThrow();
  });

  it("should not throw an error arguments are null", () => {
    expect(() => createRequestObject(null, null, null, null, null)).not.toThrow();
  });
});

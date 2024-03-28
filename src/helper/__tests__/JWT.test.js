import { expect, describe, it } from "vitest";
import { JWT } from "../JWT";

const token = {
  valid:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidXNlcm5hbWUiLCJpZCI6IjEyMyIsImVtYWlsIjoiZW1haWxAc3R1ZC5ub3JvZmYubm8iLCJpYXQiOjE1MTYyMzkwMjJ9.brPDgBxD2C_MzQ1r-gecWNvU7PBaRn3d-SRccsGg5Os",
  invalid:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidXNlcm5dhbWUiLCJpZCI6IjEyMyIsImVtYWlsIjoiZW1haWxAc3R1ZC5ub3JvZmYubm8iLCJpYXQiOjE1MTYyMzkwMjJ9.brPDgBxD2C_MzQ1r-gecWNvU7PBaRn3d-SRccsGg5Os"
};

describe("JWT.getPayload", () => {
  it("should return the correct value for a valid key", () => {
    const result = JWT.getPayload(token.valid, "name");

    expect(result).toBe("username");
  });

  it("should return null for an invalid token", () => {
    const result = JWT.getPayload(token.invalid, "name");

    expect(result).toBe(null);
  });

  it("should return the entire payload if no key is provided", () => {
    const expectedPayload = {
      name: "username",
      id: "123",
      email: "email@stud.noroff.no",
      iat: 1516239022
    };

    const result = JWT.getPayload(token.valid);

    expect(result).toEqual(expectedPayload);
  });
});

describe("JWT.validate", () => {
  it("should return true for a valid token", () => {
    const result = JWT.validate(token.valid);

    expect(result).toBe(true);
  });

  it("should return false for an invalid token", () => {
    const result = JWT.validate(token.invalid);

    expect(result).toBe(false);
  });
});

import { expect, describe, it } from "vitest";
import { isAuthenticated } from "../isAuthenticated";

const token = {
  valid:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidXNlcm5hbWUiLCJpZCI6IjEyMyIsImVtYWlsIjoiZW1haWxAc3R1ZC5ub3JvZmYubm8iLCJpYXQiOjE1MTYyMzkwMjJ9.brPDgBxD2C_MzQ1r-gecWNvU7PBaRn3d-SRccsGg5Os",
  invalid:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidXNlcm5dhbWUiLCJpZCI6IjEyMyIsImVtYWlsIjoiZW1haWxAc3R1ZC5ub3JvZmYubm8iLCJpYXQiOjE1MTYyMzkwMjJ9.brPDgBxD2C_MzQ1r-gecWNvU7PBaRn3d-SRccsGg5Os"
};

describe("isAuthenticated", () => {
  it("should return true when a valid token is in local storage", () => {
    localStorage.setItem("accessToken", token.valid);
    expect(isAuthenticated()).toBe(true);
  });

  it("should return false when an invalid token is in local storage", () => {
    localStorage.setItem("accessToken", token.invalid);
    expect(isAuthenticated()).toBe(false);
  });

  it("should return false is there is no token", () => {
    expect(isAuthenticated()).toBe(false);
  });
});

import { expect, describe, it, afterEach } from "vitest";
import { AuthStateManager } from "../AuthStateManager";

const token = {
  valid:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidXNlcm5hbWUiLCJpZCI6IjEyMyIsImVtYWlsIjoiZW1haWxAc3R1ZC5ub3JvZmYubm8iLCJpYXQiOjE1MTYyMzkwMjJ9.brPDgBxD2C_MzQ1r-gecWNvU7PBaRn3d-SRccsGg5Os",
  invalid:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidXNlcm5dhbWUiLCJpZCI6IjEyMyIsImVtYWlsIjoiZW1haWxAc3R1ZC5ub3JvZmYubm8iLCJpYXQiOjE1MTYyMzkwMjJ9.brPDgBxD2C_MzQ1r-gecWNvU7PBaRn3d-SRccsGg5Os"
};

describe("AuthStateManager.token", () => {
  afterEach(() => {
    AuthStateManager.remove();
  });

  it("should set token in local storage when a valid token is provided", () => {
    AuthStateManager.token = token.valid;
    expect(AuthStateManager.token).toBe(token.valid);
    expect(localStorage.getItem("accessToken")).toBe(token.valid);
  });

  it("should get the correct token from state manager", () => {
    AuthStateManager.token = token.valid;
    expect(AuthStateManager.token).toBe(token.valid);
  });

  it("should return an empty string if there is no token stored", () => {
    expect(AuthStateManager.token).toBe("");
  });
});

describe("AuthStateManager.isAuthenticated", () => {
  afterEach(() => {
    AuthStateManager.remove();
  });

  it("should return true when a valid token is stored", () => {
    AuthStateManager.token = token.valid;
    expect(AuthStateManager.isAuthenticated()).toBe(true);
  });

  it("should return false when an invalid token is stored", () => {
    AuthStateManager.token = token.invalid;
    expect(AuthStateManager.isAuthenticated()).toBe(false);
  });

  it("should return false is there is no token", () => {
    expect(AuthStateManager.isAuthenticated()).toBe(false);
  });
});

describe("AuthStateManager.getUsername", () => {
  afterEach(() => {
    AuthStateManager.remove();
  });

  it("should return the correct username when a valid token is in local storage", () => {
    AuthStateManager.token = token.valid;
    expect(AuthStateManager.getUsername()).toBe("username");
  });

  it("should return null when an invalid token is in local storage", () => {
    AuthStateManager.token = token.invalid;
    expect(AuthStateManager.getUsername()).toBe(null);
  });

  it("should return null if there is no token", () => {
    expect(AuthStateManager.getUsername()).toBe(null);
  });
});

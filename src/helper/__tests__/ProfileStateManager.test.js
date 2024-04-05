import { expect, describe, it, afterEach } from "vitest";
import { ProfileStateManager } from "../ProfileStateManager";
import { AuthStateManager } from "../AuthStateManager";

describe("ProfileStateManager.profile", () => {
  afterEach(() => {
    ProfileStateManager.remove();
  });

  it("should set and get profile in state manager when a valid profile is provided", () => {
    const profile = { status: "fulfilled", data: { name: "username" } };
    ProfileStateManager.profile = profile;
    expect(ProfileStateManager.profile).toStrictEqual(profile);
  });

  it("should return an empty profile if there is no profile stored", () => {
    expect(ProfileStateManager.profile).toEqual({ status: "none" });
  });
});

describe("ProfileStateManager.update", () => {
  afterEach(() => {
    ProfileStateManager.remove();
  });

  it("should update the profile when a valid token is stored", async () => {
    AuthStateManager.token = import.meta.env.VITE_TOKEN;
    await ProfileStateManager.update();
    expect(ProfileStateManager.profile.status).toBe("fulfilled");
  });

  it("should set the profile to error status when an invalid token is stored", async () => {
    AuthStateManager.token = "invalid token";
    await ProfileStateManager.update();
    expect(ProfileStateManager.profile.status).toBe("rejected");
  });

  it("should set the profile to error status if there is no token", async () => {
    AuthStateManager.token = "";
    await ProfileStateManager.update();
    expect(ProfileStateManager.profile.status).toBe("rejected");
  });
});

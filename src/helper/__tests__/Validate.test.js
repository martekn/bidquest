import { expect, describe, it } from "vitest";
import { Validate } from "../Validate";

describe("Validate.username", () => {
  it("should return null if username is valid", () => {
    expect(Validate.username("username")).toBe(null);
  });

  it("should return null even if username contains underscore (_)", () => {
    expect(Validate.username("user_name")).toBe(null);
  });

  it("should return error message if username is empty", () => {
    expect(Validate.username("")).toBe("Username is required");
  });

  it("should return error message if username is longer than 20 characters", () => {
    expect(Validate.username("extremely_long_username")).toBe(
      "Username cant be longer than 20 characters"
    );
  });

  it("Should return error message if username contains punctuation symbols", () => {
    expect(Validate.username("user.name")).toBe(
      "Username cannot contain punctuation symbols apart from underscore (_)"
    );
  });

  it("Should return error message if username contains punctuation symbols and is longer than 20 characters", () => {
    expect(Validate.username("extremely.long.username")).toBe(
      "Username cannot contain punctuation symbols apart from underscore (_). Username cant be longer than 20 characters"
    );
  });

  it("should throw when argument passed is not a string", () => {
    expect(() => Validate.username(123)).toThrow();
  });
});

describe("Validate.email", () => {
  it("should return null if email is valid", () => {
    expect(Validate.email("username@stud.noroff.no")).toBe(null);
  });

  it("should return error message if email is invalid", () => {
    expect(Validate.email("username@noroff.no")).toBe(
      "The email must be a valid stud.noroff.no email address."
    );
  });

  it("should throw when argument passed is not a string", () => {
    expect(() => Validate.email(123)).toThrow();
  });
});

describe("Validate.password", () => {
  it("should return null if password is 8 characters long", () => {
    expect(Validate.password("passord1")).toBe(null);
  });

  it("should return null if password is longer than 8 characters", () => {
    expect(Validate.password("passord123")).toBe(null);
  });

  it("should return error message is password is shorter than 8 characters", () => {
    expect(Validate.password("pass")).toBe("The password should be 8 chars long");
  });

  it("should throw when argument passed is not a string", () => {
    expect(() => Validate.password(123)).toThrow();
  });
});

/**
 * Validation object for user inputs.
 * @module Validate
 */
export const Validate = Object.freeze({
  /**
   * Validates a username.
   *
   * @method
   * @param {string} username - The username to validate.
   * @returns {string|null} Error message if validation fails, otherwise null.
   * @throws {Error} Throws an error if the argument is not a string.
   */
  username(username) {
    if (typeof username !== "string") {
      throw new Error("Username must be a string.");
    }

    const regex = /^[a-zA-Z0-9_]*$/;
    if (!regex.test(username) && username.length > 20) {
      return "Username cannot contain punctuation symbols apart from underscore (_). Username cant be longer than 20 characters";
    } else if (username.length > 20) {
      return "Username cant be longer than 20 characters";
    } else if (!regex.test(username)) {
      return "Username cannot contain punctuation symbols apart from underscore (_)";
    } else if (username.length <= 0) {
      return "Username is required";
    } else {
      return null;
    }
  },

  /**
   * Validates an email address.
   *
   * @method
   * @param {string} email - The email address to validate.
   * @returns {string|null} Error message if validation fails, otherwise null.
   * @throws {Error} Throws an error if the argument is not a string.
   */
  email(email) {
    if (typeof email !== "string") {
      throw new Error("Email must be a string.");
    }

    const regex = /^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/;
    if (!regex.test(email)) {
      return "The email must be a valid stud.noroff.no email address.";
    } else {
      return null;
    }
  },

  /**
   * Validates a password.
   *
   * @method
   * @param {string} password - The password to validate.
   * @returns {string|null} Error message if validation fails, otherwise null.
   * @throws {Error} Throws an error if the argument is not a string.
   */
  password(password) {
    if (typeof password !== "string") {
      throw new Error("Password must be a string.");
    }

    if (password.length < 8) {
      return "The password should be 8 chars long";
    } else {
      return null;
    }
  }
});

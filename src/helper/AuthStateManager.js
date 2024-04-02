import { reactive } from "vue";
import { JWT } from "./JWT";
import { Storage } from "./Storage";

/**
 * @module AuthStateManager
 * @description This module exports a reactive object that manages authentication state.
 */
export const AuthStateManager = reactive({
  /**
   * @property {string} _token - The current JWT token.
   */
  _token: Storage.local.get("accessToken") || "",

  /**
   * @method token
   * @description Sets the JWT token and stores it in local storage.
   * @param {string} token - The JWT token.
   */
  set token(token) {
    this._token = token;
    Storage.local.set("accessToken", this._token);
  },

  /**
   * @method token
   * @returns {string} The current JWT token.
   */
  get token() {
    return this._token;
  },

  /**
   * @method remove
   * @description Removes the JWT token and deletes it from local storage.
   */
  remove() {
    this._token = "";
    Storage.local.remove("accessToken");
  },

  /**
   * @method isAuthenticated
   * @description Checks if the current JWT token is valid.
   * @returns {boolean} True if the token is valid, false otherwise.
   */
  isAuthenticated() {
    if (this._token) {
      const isValid = JWT.validate(this._token);
      return isValid;
    }
    return false;
  },

  /**
   * @method getUsername
   * @description Retrieves the username from the JWT token payload.
   * @returns {string} The username.
   */
  getUsername() {
    return JWT.getPayload(this._token, "name");
  }
});

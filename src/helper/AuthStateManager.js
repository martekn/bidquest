// #region -IMPORTS-
// Vue-related imports
import { reactive } from "vue";

// Custom module/helper imports
import { JWT } from "@/helper/JWT";
import { Storage } from "@/helper/Storage";
// #endregion

/**
 * This module exports a reactive object that manages authentication state.
 *
 * @module AuthStateManager
 */
export const AuthStateManager = reactive({
  /**
   * @private
   * @property {string} _token - The current JWT token.
   */
  _token: Storage.local.get("accessToken") || "",

  /**
   * Sets the JWT token and stores it in local storage.
   *
   * @method token
   * @param {string} token - The JWT token to be set.
   */
  set token(token) {
    this._token = token;
    Storage.local.set("accessToken", this._token);
  },

  /**
   * Retrieves the current JWT token
   *
   * @method token
   * @returns {string} The current JWT token.
   */
  get token() {
    return this._token;
  },

  /**
   * Removes the JWT token and deletes it from local storage.
   *
   * @method remove
   */
  remove() {
    this._token = "";
    Storage.local.remove("accessToken");
  },

  /**
   * Checks if the current JWT token is valid.
   *
   * @method isAuthenticated
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
   * Retrieves the username from the JWT token payload.
   *
   * @method getUsername
   * @returns {string} The username.
   */
  getUsername() {
    return JWT.getPayload(this._token, "name");
  }
});

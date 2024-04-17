// #region -IMPORTS-
// Vue-related imports
import { reactive } from "vue";

// Custom module/helper imports
import { profile } from "@/api";
import { AuthStateManager } from "./AuthStateManager";
// #endregion

/**
 * @module ProfileStateManager
 * @description This module exports a reactive object that manages profile state.
 */
export const ProfileStateManager = reactive({
  /**
   * @property {Object} _profile - The current profile state.
   */
  _profile: { status: "none" },

  /**
   * @method profile
   * @description Sets the profile state.
   * @param {Object} profile - The new profile state.
   */
  set profile(profile) {
    this._profile = profile;
  },

  /**
   * @method profile
   * @returns {Object} The current profile state.
   */
  get profile() {
    return this._profile;
  },

  /**
   * @method remove
   * @description Resets the profile state to its initial value.
   */
  remove() {
    this._profile = { status: "none" };
  },

  /**
   * @method update
   * @description Asynchronously updates the profile state based on the response from the `getProfile` API call.
   */
  async update() {
    try {
      const response = await profile.getProfile(AuthStateManager.getUsername());
      response.data.status = "fulfilled";
      this.profile = response.data;
    } catch (error) {
      error.status = "rejected";
      this.profile = error;
    }
  }
});

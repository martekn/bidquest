// #region -IMPORTS-
// Custom module/helper imports
import { ProfileStateManager } from "@/helper/ProfileStateManager";
import { request } from "@/helper/request";
// #endregion

/**
 * Updates the avatar of a profile.
 *
 * @function
 * @async
 * @memberof profile
 * @param {Object} body - The body of the request, containing the new avatar data.
 * @returns {Promise<Object>} A promise that resolves to the response from the request to "/auction/profiles/:username"
 */
export const updateAvatar = async (body) => {
  const res = await request(
    `/auction/profiles/${ProfileStateManager.profile.name}`,
    null,
    true,
    "PUT",
    body
  );
  return res;
};

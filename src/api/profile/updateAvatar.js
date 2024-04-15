import { ProfileStateManager } from "@/helper/ProfileStateManager";
import { request } from "../../helper/request";

/**
 * Updates the avatar of a profile.
 *
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

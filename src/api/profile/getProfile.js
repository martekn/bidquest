import { request } from "../../helper/request";

/**
 * Performs a request to retrieve a user's profile.
 * @param {string} username - The username of the user whose profile is to be retrieved.
 * @returns {Promise<Object>} A promise that resolves to the response from the request.
 */
export const getProfile = async (username) => {
  const res = await request(`/auction/profiles/${username}`, null, true, "GET", null);

  return res;
};

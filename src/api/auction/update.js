import { request } from "../../helper/request";

/**
 * Sends a PUT request to update a specific auction listing.
 *
 * @memberof auction
 * @async
 * @function
 * @param {string} id - The ID of the auction listing to update.
 * @param {Object} body - The data to update the auction listing with.
 * @returns {Promise<Object>} The response from the request.
 */
export const update = async (id, body) => {
  const res = await request(`/auction/listings/${id}`, null, true, "PUT", body);
  return res;
};

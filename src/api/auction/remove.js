import { request } from "../../helper/request";

/**
 * Sends a DELETE request to remove a specific auction listing.
 *
 * @memberof auction
 * @async
 * @function
 * @param {string} id - The ID of the auction listing to remove.
 * @returns {Promise<Object>} The response from the request.
 */
export const remove = async (id) => {
  const res = await request(`/auction/listings/${id}`, null, true, "DELETE");
  return res;
};

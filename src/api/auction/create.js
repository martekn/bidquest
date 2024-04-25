import { request } from "../../helper/request";

/**
 * Sends a POST request to create a new auction listing.
 *
 * @memberof auction
 * @async
 * @function
 * @param {Object} body - The data for the new auction listing.
 * @returns {Promise<Object>} The response from the request.
 */
export const create = async (body) => {
  const res = await request("/auction/listings", null, true, "POST", body);
  return res;
};

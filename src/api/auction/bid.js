// #region -IMPORTS-
// Custom module/helper imports
import { request } from "@/helper/request";
// #endregion

/**
 * Sends a bid for a specific auction listing.
 *
 * @memberof auction
 * @async
 * @function
 * @param {string} id - The ID of the auction listing.
 * @param {Object} body - The body of the request, containing the bid details.
 * @param {number} body.amount - The amount of the bid.
 * @returns {Promise<Object>} The response from the request.
 */
export const bid = async (id, body) => {
  const res = await request(`/auction/listings/${id}/bids`, null, true, "POST", body);
  return res;
};

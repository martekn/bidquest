import { request } from "../../helper/request";

/**
 * Fetches a single auction listing by ID.
 *
 * @memberof auction
 * @async
 * @function
 * @param {string} id - The ID of the auction listing.
 * @return {Promise<Object>} - A Promise that resolves to the auction listing object.
 */
export const getSingle = async (id) => {
  const res = await request(`/auction/listings/${id}`, {
    _bids: true,
    _seller: true
  });
  return res;
};

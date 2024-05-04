// #region -IMPORTS-
// Custom module/helper imports
import { request } from "@/helper/request";
// #endregion

/**
 * Fetches all auction listings with specified parameters.
 *
 * @memberof auction
 * @async
 * @function
 * @param {number} [limit=40] - The maximum number of auction listings to return.
 * @param {string} [sortBy="created"] - The field to sort the auction listings by.
 * @param {string} [sortOrder="desc"] - The order to sort the auction listings in.
 * @param {number} [page=1] - The page number to return in the paginated response.
 * @returns {Promise<Object>} A promise that resolves to the response from the request to "/auction/listings".
 */
export const getAll = async (limit = 40, sortBy = "created", sortOrder = "desc", page = 1) => {
  const res = await request("/auction/listings", {
    _bids: true,
    _active: true,
    limit: limit,
    _seller: true,
    sort: sortBy,
    sortOrder: sortOrder,
    page: page
  });
  return res;
};

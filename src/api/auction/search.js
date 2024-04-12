import { request } from "../../helper/request";

/**
 * Performs a search on auction listings.
 *
 * @param {string} query - The search query.
 * @param {number} [limit=40] - The maximum number of auction listings to return.
 * @param {string} [sortBy="created"] - The field to sort the auction listings by.
 * @param {string} [sortOrder="desc"] - The order to sort the auction listings in.
 * @param {number} [page=1] - The page number to return in the paginated response.
 * @returns {Promise<Object>} The response from the request to the search endpoint.
 */
export const search = async (
  query,
  limit = 40,
  sortBy = "created",
  sortOrder = "desc",
  page = 1
) => {
  const res = await request("/auction/listings/search", {
    _bids: true,
    limit: limit,
    _seller: true,
    sort: sortBy,
    sortOrder: sortOrder,
    page: page,
    q: query
  });
  return res;
};

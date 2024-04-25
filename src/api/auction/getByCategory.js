import { request } from "../../helper/request";

/**
 * This function retrieves auction listings by category.
 *
 * @memberof auction
 * @async
 * @function
 * @param {string} category - The category to filter the listings by.
 * @param {number} [limit=40] - The maximum number of auction listings to return.
 * @param {string} [sortBy="created"] - The field to sort the auction listings by.
 * @param {string} [sortOrder="desc"] - The order to sort the auction listings in.
 * @param {number} [page=1] - The page number to return in the paginated response.
 * @returns {Promise<Object>} The response from the request to the listings endpoint.
 */
export const getByCategory = async (
  category,
  limit = 40,
  sortBy = "created",
  sortOrder = "desc",
  page = 1
) => {
  const res = await request("/auction/listings", {
    _bids: true,
    _active: true,
    limit: limit,
    _seller: true,
    sort: sortBy,
    sortOrder: sortOrder,
    page: page,
    _tag: category
  });
  return res;
};

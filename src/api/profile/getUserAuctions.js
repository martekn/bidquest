import { request } from "../../helper/request";

/**
 * Retrieves the auctions of a specific user.
 *
 * @param {string} username - The username of the user whose auctions are to be retrieved.
 * @param {boolean} onlyActive - If true, only active auctions will be retrieved.
 * @param {number} [limit=40] - The maximum number of auction listings to return.
 * @param {string} [sortBy="created"] - The field to sort the auction listings by.
 * @param {string} [sortOrder="desc"] - The order to sort the auction listings in.
 * @param {number} [page=1] - The page number to return in the paginated response.
 * @returns {Promise<Object>} A promise that resolves to the response from the request.
 */
export const getUserAuctions = async (
  username,
  onlyActive,
  limit = 40,
  sortBy = "endsAt",
  sortOrder = "asc",
  page = 1
) => {
  const res = await request(
    `/auction/profiles/${username}/listings`,
    {
      _bids: true,
      _active: onlyActive,
      limit: limit,
      sort: sortBy,
      sortOrder: sortOrder,
      page: page
    },
    true
  );
  return res;
};

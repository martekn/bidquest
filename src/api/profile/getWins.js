import { request } from "@/helper/request";
import { AuthStateManager } from "@/helper/AuthStateManager";

/**
 * Retrieves auction wins for a specific user.
 *
 * @function
 * @async
 * @memberof profile
 * @param {number} [limit=40] - The maximum number of auction wins to return.
 * @param {number} [page=1] - The page number to return in the paginated response.
 * @returns {Promise<Object>} The response from the request
 */
export const getWins = async (limit = 40, page = 1) => {
  const res = await request(
    `/auction/profiles/${AuthStateManager.getUsername()}/wins`,
    { _bids: true, sortBy: "endsAt", sortOrder: "asc", limit: limit, page: page },
    true
  );

  return res;
};

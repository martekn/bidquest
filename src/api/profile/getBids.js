import { request } from "@/helper/request";
import { AuthStateManager } from "@/helper/AuthStateManager";

/**
 * Retrieves auction bids for a specific user.
 *
 * @param {number} [limit=40] - The maximum number of bids to return.
 * @param {number} [page=1] - The page number to return in the paginated response.
 * @returns {Promise<Object>} The response from the request
 */
export const getBids = async (limit = 40, page = 1) => {
  const res = await request(
    `/auction/profiles/${AuthStateManager.getUsername()}/bids`,
    { _bids: true, _listings: true, sortBy: "created", sortOrder: "asc", limit: limit, page: page },
    true
  );

  return res;
};

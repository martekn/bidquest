// #region -IMPORTS-
// Custom module/helper imports
import { getProfile } from "./getProfile";
import { getUserAuctions } from "./getUserAuctions";
import { updateAvatar } from "./updateAvatar";
import { getWins } from "./getWins";
import { getBids } from "./getBids";
// #endregion

/**
 * A collection of functions for handling profile api calls.
 *
 * @namespace profile
 */
export const profile = Object.freeze({
  getProfile,
  getUserAuctions,
  updateAvatar,
  getWins,
  getBids
});

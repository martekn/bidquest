import { getProfile } from "./getProfile";
import { getUserAuctions } from "./getUserAuctions";
import { updateAvatar } from "./updateAvatar";
import { getWins } from "./getWins";
import { getBids } from "./getBids";

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

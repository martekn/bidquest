import { getProfile } from "./getProfile";
import { getUserAuctions } from "./getUserAuctions";
import { updateAvatar } from "./updateAvatar";
import { getWins } from "./getWins";
import { getBids } from "./getBids";

export const profile = Object.freeze({
  getProfile,
  getUserAuctions,
  updateAvatar,
  getWins,
  getBids
});

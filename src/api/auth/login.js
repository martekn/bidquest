import { Storage } from "@/helper/Storage";
import { request } from "../../helper/request";
import router from "@/router";
import { HistoryStack } from "@/helper/HistoryStack";

/**
 * Clears the history stack and redirects to the last visited path or redirected from path.
 */
const redirect = () => {
  let redirectPath = HistoryStack.lastVisited();

  if (router.currentRoute.value && typeof router.currentRoute.value === "object") {
    const { query } = router.currentRoute.value;
    redirectPath = query && query.redirect ? query.redirect : redirectPath;
  }

  HistoryStack.clear();

  router.push(redirectPath);
};

/**
 * Performs a login request and stores the access token in local storage.
 * @param {Object} body - The login request body containing email and password.
 * @param {string} body.email - The user's email address.
 * @param {string} body.password - The user's password.
 * @returns {Promise<void>} A promise that resolves when the login process is complete.
 */
export const login = async (body) => {
  const res = await request("/auth/login", null, null, "POST", body);
  Storage.local.set("accessToken", res.data.accessToken);

  redirect();
};

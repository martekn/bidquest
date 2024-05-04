// #region -IMPORTS-
// Vue-related imports
import router from "@/router";

// Custom module/helper imports
import { request } from "@/helper/request";
import { HistoryStack } from "@/helper/HistoryStack";
import { AuthStateManager } from "@/helper/AuthStateManager";

// #endregion

/**
 * Clears the history stack and redirects to the last visited path or redirected from path.
 *
 * @function
 * @private
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
 *
 * @memberof auth
 * @async
 * @function
 * @param {Object} body - The login request body containing email and password.
 * @param {string} body.email - The user's email address.
 * @param {string} body.password - The user's password.
 * @returns {Promise<void>} A promise that resolves when the login process is complete.
 */
export const login = async (body) => {
  const res = await request("/auth/login", null, null, "POST", body);
  AuthStateManager.token = res.data.accessToken;

  redirect();
};

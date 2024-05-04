// #region -IMPORTS-
// Vue-related imports
import router from "@/router";

// Third-party library imports
import { notify } from "notiwind";

// Custom module/helper imports
import { AuthStateManager } from "@/helper/AuthStateManager";
import { ProfileStateManager } from "@/helper/ProfileStateManager";

// #endregion

/**
 * Performs a logout operation by removing authentication and profile state.
 * If the current route requires authentication, it redirects to the login page.
 *
 * @memberof auth
 * @async
 * @function
 */
export const logout = () => {
  AuthStateManager.remove();
  ProfileStateManager.remove();
  notify(
    {
      group: "general",
      title: "You have been logged out",
      type: "success"
    },
    2000
  );
  if (router.currentRoute.value.matched.some((record) => record.meta.requiresAuth)) {
    router.push({ name: "login" });
  }
};

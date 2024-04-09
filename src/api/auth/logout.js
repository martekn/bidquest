import { AuthStateManager } from "@/helper/AuthStateManager";
import { ProfileStateManager } from "@/helper/ProfileStateManager";
import { notify } from "notiwind";
import router from "@/router";

/**
 * Performs a logout operation by removing authentication and profile state.
 * If the current route requires authentication, it redirects to the login page.
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
    router.push("/login");
  }
};

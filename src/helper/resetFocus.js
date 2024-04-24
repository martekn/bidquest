// #region -IMPORTS-
// Vue-related imports
import { nextTick } from "vue";
import { useRouter } from "vue-router";
// #endregion

/**
 * Resets focus based on navigation from one route to another.
 *
 * @function
 * @returns {void}
 */
export const resetFocus = () => {
  const router = useRouter();
  router.afterEach((from, to) => {
    if (
      to.name === "history" &&
      from.name === "history" &&
      (from.params.view === "all" || from.params.view === "wins")
    ) {
      return;
    } else if (
      to.name === "profile" &&
      from.name === "profile" &&
      (from.params.view === "all" || from.params.view === "active")
    ) {
      return;
    } else if (from.path !== to.path) {
      nextTick(() => {
        document.body.tabIndex = 0;
        document.body.focus();
        document.body.tabIndex = -1;
      });
    }
  });
};

// #region -IMPORTS-
// Custom module/helper imports
import { Storage } from "@/helper/Storage";
// #endregion

/**
 * A utility for managing a history stack in session storage.
 * @namespace HistoryStack
 */
export const HistoryStack = Object.freeze({
  /**
   * Retrieves the history stack from session storage.
   * @returns {string[]} An array containing the history stack.
   */
  get() {
    return Storage.session.get("historyStack") || [];
  },

  /**
   * Updates the history stack with a new path.
   * @param {string} path - The path to add to the history stack.
   * @throws {Error} Throws an error if the argument is not a string.
   */
  update(path) {
    if (typeof path !== "string") {
      throw new Error("Path must be a string.");
    }

    let historyStack = this.get();

    historyStack.push(path);

    if (historyStack.length > 25) {
      historyStack.shift();
    }

    Storage.session.set("historyStack", historyStack);
  },

  /**
   * Clears the entire history stack.
   */
  clear() {
    Storage.session.set("historyStack", []);
  },

  /**
   * Retrieves the last visited path from the history stack.
   * @returns {string} The last visited path, or "/" if the stack is empty.
   */
  lastVisited() {
    let historyStack = this.get();
    let lastPath = historyStack.length > 0 ? historyStack[historyStack.length - 1] : "/";
    return lastPath;
  }
});

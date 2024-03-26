/**
 * Storage is an object that provides methods for interacting with the browser's local storage.
 * @namespace
 */
export const Storage = Object.freeze({
  /**
   * Retrieves an item from local storage and tries to parse it as JSON.
   *
   * @param {string} key - The key of the item to retrieve from local storage.
   * @returns {any} The parsed JSON object if successful, or the original value if not.
   */
  get(key) {
    const value = localStorage.getItem(key);
    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  },

  /**
   * Stores a value in the browser's local storage.
   *
   * @param {string} key - The key under which the value will be stored.
   * @param {string|number|object} value - The value to be stored. It can be a string, number, or object.
   */
  set(key, value) {
    if (typeof value === "string" || typeof value === "number") {
      localStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },

  /**
   * Removes a value stored in the browser's local storage under the given key.
   *
   * @param {string} key - The key under which the value is stored and should be removed.
   */
  remove(key) {
    localStorage.removeItem(key);
  },

  /**
   * Clears all keys out of the local storage.
   *
   * @returns {void}
   */
  clear() {
    return localStorage.clear();
  },

  /**
   * Checks if a given key exists in the local storage.
   *
   * @param {string} key - The key to check.
   * @returns {boolean} Returns true if the key exists, or false otherwise.
   */
  has(key) {
    return this.get(key) !== null;
  }
});

/**
 * Creates a storage interface for the given storage API (localStorage or sessionStorage).
 *
 * @param {Storage} storage - The storage API to create an interface for.
 * @returns {Object} The storage interface with get, set, remove, clear, and has methods.
 */
function storageFactory(storage) {
  return {
    /**
     * Retrieves an item from storage and tries to parse it as JSON.
     *
     * @param {string} key - The key of the item to retrieve from storage.
     * @returns {any} The parsed JSON object if successful, or null if not.
     */
    get(key) {
      const value = storage.getItem(key);
      try {
        return JSON.parse(value);
      } catch (error) {
        console.error(`Error parsing storage item "${key}"`, error);
        return null;
      }
    },

    /**
     * Stores a value in storage. The value is stringified before storing.
     *
     * @param {string} key - The key under which the value will be stored.
     * @param {string|number|object} value - The value to be stored.
     */
    set(key, value) {
      try {
        storage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error setting storage item "${key}"`, error);
      }
    },

    /**
     * Removes a value stored in storage under the given key.
     *
     * @param {string} key - The key under which the value is stored and should be removed.
     */
    remove(key) {
      storage.removeItem(key);
    },

    /**
     * Clears all keys out of the storage.
     */
    clear() {
      storage.clear();
    },

    /**
     * Checks if a given key exists in the storage.
     *
     * @param {string} key - The key to check.
     * @returns {boolean} Returns true if the key exists, or false otherwise.
     */
    has(key) {
      return this.get(key) !== null;
    }
  };
}

/**
 * The Storage object provides methods for interacting with the browser's session storage and local storage.
 *
 * @namespace
 */
export const Storage = Object.freeze({
  /**
   * Interface for interacting with the browser's local storage.
   */
  local: storageFactory(localStorage),

  /**
   * Interface for interacting with the browser's session storage.
   */
  session: storageFactory(sessionStorage)
});

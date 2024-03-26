import { validateObjectKeys } from "./validate-object-keys";
import { addBase64Padding } from "./addBase64Padding";

/**
 * JWT is an object that provides methods for handling JSON Web Tokens (JWTs)
 * @namespace
 */
export const JWT = Object.freeze({
  /**
   * Extracts a specific value from the payload of a JSON Web Token (JWT).
   *
   * @param {string} token - The JSON Web Token (JWT) containing the payload.
   * @param {string} key - The key of the value to extract from the payload.
   * @returns {*} The value associated with the specified key in the payload, or null if the key is not found or the token is invalid.
   */
  getPayload(token, key) {
    try {
      if (!this.validate(token)) {
        throw new Error("Invalid JWT token");
      }

      const payload = addBase64Padding(token.split(".")[1]);
      const parsedPayload = JSON.parse(atob(payload));
      if (!key) {
        return parsedPayload;
      }
      return parsedPayload[key];
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  /**
   * Validates the structure of a JSON Web Token (JWT) to ensure it contains
   * the required header, payload and signature components, including specific keys.
   *
   * @param {string} token - The JWT to be validated.
   * @returns {boolean} Returns true if the token structure is valid, or false otherwise.
   */
  validate(token) {
    if (!token) {
      return false;
    }

    try {
      const tokenArray = token.split(".");
      if (tokenArray.length < 3) {
        return false;
      }

      const [header, payload] = tokenArray.map(addBase64Padding);
      const parsedHeader = JSON.parse(atob(header));

      if (!parsedHeader || !validateObjectKeys(parsedHeader, ["alg", "typ"])) {
        return false;
      }

      const parsedPayload = JSON.parse(atob(payload));

      if (
        !parsedPayload ||
        !parsedPayload.name ||
        !validateObjectKeys(parsedPayload, ["name", "id", "email", "iat"])
      ) {
        return false;
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
});

import { JWT } from "./JWT";
import { Storage } from "./Storage";

/**
 * Checks if the user is authenticated.
 *
 * This function retrieves the access token from local storage and validates it.
 * If the token is valid, it returns true, indicating that the user is authenticated.
 * If the token is not valid or does not exist, it returns false.
 *
 * @returns {boolean} True if the user is authenticated, false otherwise.
 */
export const isAuthenticated = () => {
  const token = Storage.local.get("accessToken");
  if (token) {
    const isValid = JWT.validate(token);
    return isValid;
  }
  return false;
};

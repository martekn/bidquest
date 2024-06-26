// #region -IMPORTS-
// Custom module/helper imports
import { request } from "@/helper/request";
import { login } from "./login";

// Constants imports
import { baseAvatar } from "@/consts/baseAvatar";
// #endregion

/**
 * Registers a new user by sending a registration request.
 * After successful registration, logs in the user using the provided email and password.
 *
 * @memberof auth
 * @async
 * @function
 * @param {Object} body - The registration request body containing email, password, and username.
 * @param {string} body.email - The user's email address.
 * @param {string} body.password - The user's password.
 * @param {string} body.username - The desired username for the user.
 * @returns {Promise<void>} A promise that resolves when registration and login are complete.
 */
export const register = async (body) => {
  body.avatar = baseAvatar;
  await request("/auth/register", null, null, "POST", body);
  await login({ email: body.email, password: body.password });
};

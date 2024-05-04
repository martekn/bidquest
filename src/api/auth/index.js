// #region -IMPORTS-
// Custom module/helper imports
import { login } from "./login";
import { register } from "./register";
import { logout } from "./logout";
// #endregion

/**
 * A collection of functions for handling authentication api calls.
 *
 * @namespace auth
 */
export const auth = Object.freeze({ login, register, logout });

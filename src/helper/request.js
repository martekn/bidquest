// #region -IMPORTS-
// Custom module/helper imports
import { AuthStateManager } from "./AuthStateManager.js";

// Constants imports
import { baseUrl } from "../consts/baseUrl.js";
// #endregion

/**
 * Makes an asynchronous HTTP request to a specified endpoint with optional parameters, authentication token, method, and request body.
 *
 * @async
 * @param {String} endpoint - The endpoint for the HTTP request.
 * @param {Object} [params] - Optional query parameters as key-value pairs (e.g., { key: value }).
 * @param {Boolean} [useToken=false] - Indicates whether to use a token in the request (optional).
 * @param {String} [method="GET"] - The HTTP method for the request (e.g., "GET", "POST"). Default is "GET".
 * @param {Object} [body] - The request body data to send (if applicable) as an object.
 * @returns {Promise} - A promise that resolves to the JSON response data from the HTTP request.
 */
export const request = async (
  endpoint,
  params = null,
  useToken = false,
  method = "GET",
  body = null
) => {
  let url = baseUrl;

  if (endpoint) {
    url += endpoint;
  }
  const options = {
    method,
    headers: {}
  };

  if (useToken) {
    const token = AuthStateManager.token;
    options.headers["X-Noroff-API-Key"] = import.meta.env.VITE_API_KEY;
    options.headers.Authorization = `Bearer ${token}`;
  }

  if (params) {
    url = `${url}?${new URLSearchParams(params).toString()}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
    options.headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  let result;
  try {
    result = await response.json();
    return result;
  } catch (error) {
    return response;
  }
};

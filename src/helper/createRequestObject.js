/**
 * Creates a request object with the provided parameters.
 *
 * @param {string|null} endpoint - The URL endpoint for the request.
 * @param {object|null} params - URL parameters to include in the request.
 * @param {boolean|null} token - Authorization token for the request.
 * @param {string|null} method - The HTTP request method (e.g., 'GET', 'POST').
 * @param {any|null} body - The request body data for methods like 'POST'.
 * @returns {object} A request object.
 */
export const createRequestObject = (endpoint, params, token, method, body) => {
  const argumentTypes = [
    { value: endpoint, type: "string", name: "Endpoint" },
    { value: params, type: "object", name: "Params" },
    { value: token, type: "string", name: "Token" },
    { value: method, type: "string", name: "Method" },
    { value: body, type: "object", name: "Body" }
  ];

  for (const argument of argumentTypes) {
    if (argument.value !== null && typeof argument.value !== argument.type) {
      throw new Error(`${argument.name} must be a ${argument.type} or null`);
    }
  }

  return { endpoint, params, token, method, body };
};

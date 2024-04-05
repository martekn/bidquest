/**
 * Adds padding to a Base64 string until its length is a multiple of 4.
 *
 * @param {string} value - The Base64 string to pad.
 * @returns {string} The padded Base64 string.
 */
export const addBase64Padding = (value) => {
  if (typeof value !== "string") {
    throw new TypeError("Expected a string");
  }
  let newValue = value.replace(/-/g, "+").replace(/_/g, "/");
  while (newValue.length % 4 !== 0) {
    newValue += "=";
  }
  return newValue;
};

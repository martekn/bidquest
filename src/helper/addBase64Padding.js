/**
 * Adds padding to a Base64 string until its length is a multiple of 4.
 *
 * @param {string} value - The Base64 string to pad.
 * @returns {string} The padded Base64 string.
 */
export const addBase64Padding = (value) => {
  while (value.length % 4 !== 0) {
    value += "=";
  }
  return value;
};

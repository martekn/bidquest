/**
 * Calculates the current highest bid amount from an array of bids.
 *
 * @param {Array} bids - An array of bid objects, where each bid must have an "amount" property.
 * @return {number} - The highest bid amount (or 0 if no bids).
 * @throws {TypeError} - If the input is not an array.
 * @throws {Error} - If any bid object does not have an "amount" property.
 */
export const getCurrentBid = (bids) => {
  if (!Array.isArray(bids)) {
    throw new TypeError("Bids must be an array");
  }

  if (bids.length === 0) {
    return 0;
  }

  const bidAmounts = bids.map((bid) => {
    if (!("amount" in bid)) {
      throw new Error("Each bid must have an 'amount' property");
    }

    const amount = Number(bid.amount);
    if (isNaN(amount)) {
      throw new Error(`Invalid bid amount: ${bid.amount}`);
    }

    return amount;
  });

  return Math.max(...bidAmounts);
};

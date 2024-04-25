import { getAll } from "./getAll";
import { getSingle } from "./getSingle";
import { bid } from "./bid";
import { getByCategory } from "./getByCategory";
import { search } from "./search";
import { create } from "./create";
import { update } from "./update";
import { remove } from "./remove";

/**
 * A collection of functions for handling auctions api calls.
 *
 * @namespace auction
 */
export const auction = Object.freeze({
  getAll,
  getSingle,
  bid,
  getByCategory,
  search,
  create,
  update,
  remove
});

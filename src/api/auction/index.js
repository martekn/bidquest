import { getAll } from "./getAll";
import { getSingle } from "./getSingle";
import { bid } from "./bid";
import { getByCategory } from "./getByCategory";

export const auction = Object.freeze({
  getAll,
  getSingle,
  bid,
  getByCategory
});

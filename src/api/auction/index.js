import { getAll } from "./getAll";
import { getSingle } from "./getSingle";
import { bid } from "./bid";
import { getByCategory } from "./getByCategory";
import { search } from "./search";
import { create } from "./create";
import { update } from "./update";

export const auction = Object.freeze({
  getAll,
  getSingle,
  bid,
  getByCategory,
  search,
  create,
  update
});

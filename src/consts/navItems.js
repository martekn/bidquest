/**
 * Array of navigation items.
 * @type {Object[]}
 * @property {string} name - The name of the navigation item.
 * @property {Object} route - The route configuration object.
 *                            It should have a 'name' property representing the route name
 *                            and an optional 'params' property containing route parameters,
 *                            where 'category' is one of the parameters if applicable.
 * @property {number} id - The unique identifier for the navigation item.
 */
export const navItems = [
  { name: "+ Create auction", route: { name: "create" }, id: 1 },
  { name: "All auctions", route: { name: "auctions" }, id: 2 },
  { name: "Jewelry", route: { name: "category", params: { category: "jewelry" } }, id: 3 },
  { name: "Art", route: { name: "category", params: { category: "art" } }, id: 4 },
  { name: "Fashion", route: { name: "category", params: { category: "fashion" } }, id: 5 },
  { name: "Electronics", route: { name: "category", params: { category: "electronics" } }, id: 6 },
  { name: "Home", route: { name: "category", params: { category: "home" } }, id: 7 },
  { name: "Toys", route: { name: "category", params: { category: "toys" } }, id: 8 },
  { name: "Sports", route: { name: "category", params: { category: "sports" } }, id: 9 },
  { name: "Vehicles", route: { name: "category", params: { category: "vehicles" } }, id: 10 },
  {
    name: "Miscellaneous",
    route: { name: "category", params: { category: "miscellaneous" } },
    id: 11
  }
];

/**
 * Array of category names extracted from the navigation items.
 * @type {string[]}
 */
export const categories = navItems
  .filter((item) => item.route.params?.category)
  .map((item) => item.route.params.category);

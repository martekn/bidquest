const url =
  "/auction/listings/search?_bids=true&limit=40&_seller=true&sort=endsAt&sortOrder=asc&page=1&q=test";

describe("Search", () => {
  it("displays auctions when fetch is successful", () => {
    cy.visit("./");
    cy.intercept("GET", url, { fixture: "auctions.json" });
    cy.get("#searchInput").should("be.visible").type("test {enter}");
    cy.url().should("include", `/search/test`);
    cy.get("main ul").should("be.visible");
    cy.get("ErrorDialog").should("not.exist");
  });
});

describe("auth guard preventing access by unregistered users", () => {
  beforeEach(() => {});
  it("should redirect user to login page if visiting page that requires authentication", () => {
    cy.visit(`/profile/${Cypress.env("USER_NAME")}`);
    cy.url().should("include", "/login");
  });
});

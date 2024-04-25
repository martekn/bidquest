describe("Logout", () => {
  beforeEach(() => {
    cy.visit("./");
    cy.navigateToLogin();
  });

  it("should logout a user and remove token from local storage", () => {
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));

    cy.logout();
  });
});

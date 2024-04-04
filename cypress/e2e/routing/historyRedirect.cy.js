describe("Redirecting by history stack from login/register pages", () => {
  beforeEach(() => {
    cy.visit("./");
    cy.navigateToLogin();
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
  });
  it("should redirect back to the previous page after navigating between login and register pages", () => {
    cy.visit("/auctions/fashion");
    cy.logout();
    cy.navigateToLogin();
    cy.get("main form a[href='/register']").should("be.visible").click();
    cy.get("main form a[href='/login']").should("be.visible").click();
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    cy.url().should("include", "/auctions/fashion");
  });

  it("should redirect back to the previous page after logout on an authenticated path", () => {
    cy.visit(`/profile/${Cypress.env("USER_NAME")}`);

    cy.logout();
    cy.navigateToLogin();
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));

    cy.url().should("include", `/profile/${Cypress.env("USER_NAME")}`);
  });
});

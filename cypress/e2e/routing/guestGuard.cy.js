describe("guest guard prevents logged in users from accessing login/register page", () => {
  beforeEach(() => {});
  it("should redirect user if user is logged in when visiting guest pages", () => {
    cy.visit("./");
    cy.navigateToLogin();
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
    cy.visit("/login");
    cy.location("pathname").should("eq", "/");
    cy.visit("/register");
    cy.location("pathname").should("eq", "/");
  });
});

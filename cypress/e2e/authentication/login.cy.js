describe("Login", () => {
  beforeEach(() => {
    cy.visit("./");
    cy.navigateToLogin();
  });

  it("should log in with valid credentials and store token in local storage", () => {
    cy.login(Cypress.env("USER_EMAIL"), Cypress.env("USER_PASSWORD"));
  });

  it("should display input errors if passing in email and password in wrong format", () => {
    cy.fillLoginForm("invalid-email", "pass");
    cy.get("#input-error-email").should("be.visible");
    cy.get("#input-error-password").should("be.visible");
  });

  it("should display error dialog if passing in credentials for an unregistered user", () => {
    cy.intercept("POST", "auth/login").as("login");
    cy.fillLoginForm("unregistered@stud.noroff.no", "password");
    cy.wait("@login");

    cy.get("#login-error").should("be.visible");
  });
});

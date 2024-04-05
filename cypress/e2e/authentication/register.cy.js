describe("Register", () => {
  beforeEach(() => {
    cy.visit("./");
    cy.navigateToLogin();
    cy.get("main form a[href='/register']").should("be.visible").click();
    cy.get("main form").should("be.visible");
  });

  it("should display an error box when you try to create an account that already exists", () => {
    cy.get("main form").should("be.visible");
    cy.get("#name").should("be.visible").type(Cypress.env("USER_NAME"));
    cy.get("#email").should("be.visible").type(Cypress.env("USER_EMAIL"));
    cy.get("#password").should("be.visible").type(Cypress.env("USER_PASSWORD"));
    cy.intercept("POST", "auth/register").as("register");
    cy.get("main form button[type='submit']").click();

    cy.wait("@register");

    cy.get("#register-error").should("be.visible");
  });

  it("should display input errors if passing in email and password in wrong format", () => {
    cy.get("main form").should("be.visible");
    cy.get("#name").should("be.visible").type("invalid.username");
    cy.get("#email").should("be.visible").type("invalid@email.com");
    cy.get("#password").should("be.visible").type("pass");
    cy.get("main form button[type='submit']").click();

    cy.get("#input-error-name").should("be.visible");
    cy.get("#input-error-email").should("be.visible");
    cy.get("#input-error-password").should("be.visible");
  });
});

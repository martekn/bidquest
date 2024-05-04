// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("waitForToken", () => {
  cy.window().then((win) => {
    return new Cypress.Promise((resolve, reject) => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        const token = win.localStorage.getItem("accessToken");
        if (token) {
          clearInterval(interval);
          resolve(token);
        } else if (i > 10) {
          clearInterval(interval);
          reject("Token not found");
        }
      }, 500);
    });
  });
});

Cypress.Commands.add("fillLoginForm", (email, password) => {
  cy.get("main form").should("be.visible");
  cy.get("#email").should("be.visible").type(email);
  cy.get("#password").should("be.visible").type(password);
  cy.get("main form button[type='submit']").click();
});

Cypress.Commands.add("isLoggedIn", () => {
  cy.window().then((win) => {
    const token = win.localStorage.getItem("accessToken");
    expect(token).to.exist;
    expect(typeof token).to.equal("string");
  });
});

Cypress.Commands.add("login", (email, password) => {
  cy.intercept("POST", "auth/login").as("login");
  cy.fillLoginForm(email, password);
  cy.wait("@login");
  cy.waitForToken();

  cy.isLoggedIn();
});

Cypress.Commands.add("logout", () => {
  cy.get("header #user-dropdown button").should("be.visible").click();
  cy.get("#logout-button").should("be.visible").click();

  cy.window().then((win) => {
    const token = win.localStorage.getItem("accessToken");
    expect(token).to.not.exist;
  });
});

Cypress.Commands.add("navigateToLogin", () => {
  cy.get("header a[href='/login']", { timeout: 5000 }).should("be.visible").click();
});

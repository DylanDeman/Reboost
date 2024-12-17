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

Cypress.Commands.add('loginToAuth0', (username, password) => {
  const log = Cypress.log({
    displayName: 'AUTH0 LOGIN',
    message: [`🔐 Inloggen... | ${username}`],
    autoEnd: false,
  })
  log.snapshot('before')

  cy.session(
    `auth0-${username}`,
    () => {
      cy.loginViaAuth0Ui(username, password)
    },
    {
      validate: () => {
        cy.wrap(localStorage)
          .invoke('getItem', 'authAccessToken')
          .should('exist')
      },
    }
  )

  log.snapshot('after')
  log.end()
})


Cypress.Commands.add('loginViaAuth0Ui', (username, password) => {
  cy.visit('http://localhost:5173');

  cy.origin(
    'dev-eu5g8sejk0b6k23l.us.auth0.com',
    { args: { username, password } },
    ({ username, password }) => {
      cy.get('input#username').type(username);
      cy.get('input#password').type(password, { log: false });
      cy.contains('button[value=default]', 'Continue').click();
    }
  );

  cy.url().should('equal', 'http://localhost:5173/evenementen');
});




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
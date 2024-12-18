describe('Auth0', () => {
  beforeEach(() => {
    const username = 'test@reboost.be';
    const password = 'Test123.';
    
    cy.loginViaAuth0Ui(username, password);
  });

  it('Moet inloggen en redirecten naar de homepagina', () => {
    cy.url().should('equal', 'http://localhost:5173/evenementen');
  });
});

describe('Authentication', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    
    cy.intercept('POST', '**/api/sessions', (req) => {
      const { naam, wachtwoord } = req.body;
      
      if (naam === 'Dylan De Man' && wachtwoord === '123456789') {
        req.reply({
          statusCode: 200,
          body: { 
            token: 'fake-jwt-token-for-admin',
            user: {
              id: 1,
              naam: 'Dylan De Man',
              roles: ['admin', 'user']
            }
          }
        });
      } 
      else if (naam === 'Maxime Jacobs' && wachtwoord === '123456789') {
        req.reply({
          statusCode: 200,
          body: { 
            token: 'fake-jwt-token-for-regular-user',
            user: {
              id: 2,
              naam: 'Maxime Jacobs',
              roles: ['user']
            }
          }
        });
      } 
      else {
        req.reply({
          statusCode: 401,
          body: { error: 'Invalid credentials' }
        });
      }
    }).as('loginAttempt');
    
    cy.intercept('GET', '**/api/gebruikers/me', (req) => {
      const token = req.headers.authorization;
      
      if (token?.includes('fake-jwt-token-for-admin')) {
        req.reply({
          statusCode: 200,
          body: {
            id: 1,
            naam: 'Dylan De Man',
            roles: ['admin', 'user']
          }
        });
      } 
      else if (token?.includes('fake-jwt-token-for-regular-user')) {
        req.reply({
          statusCode: 200,
          body: {
            id: 2,
            naam: 'Maxime Jacobs',
            roles: ['user']
          }
        });
      }
      else {
        req.reply({
          statusCode: 401,
          body: { error: 'Unauthorized' }
        });
      }
    }).as('getUserData');
  });

  context('Successful login scenarios', () => {
    it('Moet inloggen als admin gebruiker en redirecten naar de evenementen pagina', () => {
      cy.visit('http://localhost:5173/login');
      
      cy.get('[data-cy="loginNaam"]').type('Dylan De Man');
      cy.get('[data-cy="loginWachtwoord"]').type('123456789');
      cy.get('[data-cy="loginSubmitButton"]').click();
      
      cy.wait('@loginAttempt');
      cy.url().should('include', '/evenementen');
      cy.get('[data-cy="filter_naam"]', { timeout: 10000 }).should('be.visible');
      
      cy.window().then(win => {
        expect(win.localStorage.getItem('jwtToken')).to.exist;
      });
    });
    
    it('Moet inloggen als reguliere gebruiker en redirecten naar de evenementen pagina', () => {
      cy.visit('http://localhost:5173/login');
      
      cy.get('[data-cy="loginNaam"]').type('Maxime Jacobs');
      cy.get('[data-cy="loginWachtwoord"]').type('123456789');
      cy.get('[data-cy="loginSubmitButton"]').click();
      
      cy.wait('@loginAttempt');
      cy.url().should('include', '/evenementen');
      cy.get('[data-cy="filter_naam"]', { timeout: 10000 }).should('be.visible');
      
      cy.window().then(win => {
        expect(win.localStorage.getItem('jwtToken')).to.exist;
      });
    });
  });

  context('Failed login scenarios', () => {
    it('Moet een foutmelding tonen bij verkeerde inloggegevens', () => {
      cy.intercept('POST', '**/api/sessions', {
        statusCode: 401,
        delay: 50,
        body: { error: 'Invalid credentials' }
      }).as('failedLogin');
      
      cy.visit('http://localhost:5173/login');
      
      cy.get('[data-cy="loginNaam"]').type('NietBestaandeGebruiker');
      cy.get('[data-cy="loginWachtwoord"]').type('verkeerd-wachtwoord');
    
      cy.get('[data-cy="loginSubmitButton"]').click();
      
      cy.wait('@failedLogin');
      
      cy.wait(100);
      
      cy.get('[data-cy="error"]').should('be.visible');
      cy.url().should('include', '/login');
      
      cy.window().then(win => {
        expect(win.localStorage.getItem('jwtToken')).to.be.null;
      });
    });

    it('Moet validatie tonen voor lege velden', () => {
      cy.visit('http://localhost:5173/login');
      
      cy.get('[data-cy="loginSubmitButton"]').click();
      
      cy.get('[data-cy="naam-error"]').should('be.visible');
      cy.get('[data-cy="wachtwoord-error"]').should('be.visible');
      
      cy.url().should('include', '/login');
    });
  });

  context('Session management', () => {
    it('Sessie blijft behouden na page refresh', () => {
      cy.visit('http://localhost:5173/login');
      cy.get('[data-cy="loginNaam"]').type('Maxime Jacobs');
      cy.get('[data-cy="loginWachtwoord"]').type('123456789');
      cy.get('[data-cy="loginSubmitButton"]').click();
      
      cy.wait('@loginAttempt');
      cy.url().should('include', '/evenementen');
      
      cy.reload();
      
      cy.url().should('include', '/evenementen');
      cy.get('[data-cy="filter_naam"]', { timeout: 10000 }).should('be.visible');
    });
    
    it('Moet succesvol uitloggen en redirecten naar login pagina', () => {
      cy.visit('http://localhost:5173/login');
      cy.get('[data-cy="loginNaam"]').type('Maxime Jacobs');
      cy.get('[data-cy="loginWachtwoord"]').type('123456789');
      cy.get('[data-cy="loginSubmitButton"]').click();
      
      cy.wait('@loginAttempt');
      cy.url().should('include', '/evenementen');
      
      cy.get('[data-cy="logoutButton"]').click();
      
      cy.url().should('include', '/login');
      cy.get('.alert-success').should('be.visible');
      
      cy.window().then(win => {
        expect(win.localStorage.getItem('jwtToken')).to.be.null;
      });
    });
  });
  
  context('Redirect behavior', () => {
    it('Moet correct redirecten na login wanneer een redirect parameter aanwezig is', () => {
      cy.visit('http://localhost:5173/login?redirect=evenementen/add');
      
      cy.get('[data-cy="loginNaam"]').type('Dylan De Man');
      cy.get('[data-cy="loginWachtwoord"]').type('123456789');
      cy.get('[data-cy="loginSubmitButton"]').click();
      
      cy.wait('@loginAttempt');
      cy.url().should('include', '/evenementen/add');
    });
    
    it('Moet naar home redirecten na login zonder redirect parameter', () => {
      cy.visit('http://localhost:5173/login');
      
      cy.get('[data-cy="loginNaam"]').type('Dylan De Man');
      cy.get('[data-cy="loginWachtwoord"]').type('123456789');
      cy.get('[data-cy="loginSubmitButton"]').click();
      
      cy.wait('@loginAttempt');
      cy.url().should('match', /\/(evenementen)?$/);
    });
  });
});
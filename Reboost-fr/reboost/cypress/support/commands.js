// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Add a command to mock all common API endpoints
Cypress.Commands.add('mockEvenementen', () => {
  cy.intercept('GET', '**/api/evenementen*', { fixture: 'evenementen.json' }).as('getEvenementen');
  cy.intercept('GET', '**/api/gebruikers', { fixture: 'gebruikers.json' }).as('getGebruikers');
  cy.intercept('GET', '**/api/plaatsen', { fixture: 'plaatsen.json' }).as('getPlaatsen');
  cy.intercept('GET', '**/api/gereedschap', { fixture: 'gereedschap.json' }).as('getGereedschap');
});

// Load fixtures as aliases
Cypress.Commands.add('loadFixtures', () => {
  cy.fixture('gebruikers.json').as('gebruikersData');
  cy.fixture('plaatsen.json').as('plaatsenData');
  cy.fixture('gereedschap.json').as('gereedschapData');
  cy.fixture('evenementen.json').as('evenementenData');
});

// Mock API data for evenementen
Cypress.Commands.add('mockEvenementen', () => {
  cy.fixture('evenementen.json').then(data => {
    cy.intercept('GET', '**/api/evenementen', {
      statusCode: 200,
      body: data
    }).as('getEvenementen');
  });
});

// Mock API data for plaatsen
Cypress.Commands.add('mockPlaatsen', () => {
  cy.fixture('plaatsen.json').then(data => {
    cy.intercept('GET', '**/api/plaatsen', {
      statusCode: 200,
      body: data
    }).as('getPlaatsen');
  });
});

// Mock API data for gebruikers
Cypress.Commands.add('mockGebruikers', () => {
  cy.fixture('gebruikers.json').then(data => {
    cy.intercept('GET', '**/api/gebruikers', {
      statusCode: 200,
      body: data
    }).as('getGebruikers');
  });
});

// Mock API data for gereedschap
Cypress.Commands.add('mockGereedschap', () => {
  cy.fixture('gereedschap.json').then(data => {
    cy.intercept('GET', '**/api/gereedschap', {
      statusCode: 200,
      body: data
    }).as('getGereedschap');
  });
});

// Mock all API data at once
Cypress.Commands.add('mockAllData', () => {
  cy.mockEvenementen();
  cy.mockPlaatsen();
  cy.mockGebruikers();
  cy.mockGereedschap();
});

// Mock API data for creating a new evenement
Cypress.Commands.add('mockCreateEvenement', () => {
  cy.intercept('POST', '**/api/evenementen', (req) => {
    req.reply({
      statusCode: 201,
      body: {
        id: 100,
        naam: req.body.naam || 'testEvenement',
        datum: req.body.datum || '2025-01-20T00:00:00.000Z',
        plaats: {
          id: parseInt(req.body.plaats_id) || 1,
          naam: "Verhaeghe, Michiels and Lemmens Theater",
          straat: "Felixdreef",
          huisnummer: "426",
          postcode: "5267",
          gemeente: "Zarlardingevijve"
        },
        auteur: {
          id: parseInt(req.body.auteur_id) || 1,
          naam: "Dylan De Man"
        },
        gereedschappen: []
      }
    });
  }).as('createEvenement');
});

// Mock API data for retrieving a single evenement
Cypress.Commands.add('mockGetEvenement', (id) => {
  cy.fixture('evenementen.json').then(data => {
    const evenement = data.items.find(e => e.id === id) || data.items[0];
    cy.intercept('GET', `**/api/evenementen/${id}`, {
      statusCode: 200,
      body: evenement
    }).as('getEvenement');
  });
});

// Mock API data for updating an evenement
Cypress.Commands.add('mockUpdateEvenement', (id) => {
  cy.intercept('PUT', `**/api/evenementen/${id}`, {
    statusCode: 200,
    body: {
      id: id,
      naam: 'Updated Test Event',
      datum: '2024-05-16T00:00:00.000Z',
      plaats: {
        id: 1,
        naam: "Verhaeghe, Michiels and Lemmens Theater",
        straat: "Felixdreef",
        huisnummer: "426",
        postcode: "5267",
        gemeente: "Zarlardingevijve"
      },
      auteur: {
        id: 1,
        naam: "Dylan De Man"
      },
      gereedschappen: []
    }
  }).as('updateEvenement');
});

// Mock API data for deleting an evenement with improved implementation
Cypress.Commands.add('mockDeleteEvenement', (id) => {
  // Create a proper delete response that works reliably
  cy.intercept('DELETE', `**/api/evenementen/${id}`, {
    statusCode: 200,
    body: { success: true, id: id, message: "Evenement deleted successfully" }
  }).as('deleteEvenement');
  
  // Create a separate intercept for the subsequent GET request
  cy.fixture('evenementen.json').then(data => {
    const updatedItems = {
      items: data.items.filter(e => e.id !== id)
    };
    
    // Intercept the GET request that occurs after deletion
    cy.intercept('GET', '**/api/evenementen', {
      statusCode: 200,
      body: updatedItems
    }).as('getEvenementenAfterDelete');
  });
});

// Simplified login command that works reliably
Cypress.Commands.add('loginViaUi', (username, password) => {
  // Start with a clean localStorage
  cy.clearLocalStorage();
  
  // Visit the login page
  cy.visit('http://localhost:5173/login');
  
  // Fill in the form
  cy.get('[data-cy="loginNaam"]').type(username);
  cy.get('[data-cy="loginWachtwoord"]').type(password, { log: false });
  cy.get('[data-cy="loginSubmitButton"]').click();
  
  // Wait for successful login and redirection
  cy.url().should('include', '/evenementen');
  cy.get('[data-cy="filter_naam"]', { timeout: 10000 }).should('be.visible');
  
  // Verify the token exists
  cy.window().then(win => {
    const token = win.localStorage.getItem('jwtToken');
    if (!token) {
      throw new Error('Login failed: No JWT token in localStorage');
    }
  });
});

// Improved loginViaUi command that handles validation errors
Cypress.Commands.add('loginViaUi', (username, password) => {
  // Start with a clean localStorage
  cy.clearLocalStorage();
  
  // Visit the login page
  cy.visit('http://localhost:5173/login');
  
  // Fill in the form
  if (username) {
    cy.get('[data-cy="loginNaam"]').type(username);
  }
  
  if (password) {
    cy.get('[data-cy="loginWachtwoord"]').type(password, { log: false });
  }
  
  // Intercept the login request to properly handle errors
  cy.intercept('POST', '**/api/sessions').as('loginRequest');
  
  // Click the login button
  cy.get('[data-cy="loginSubmitButton"]').click();
  
  // Check if we sent a request (only if both fields were filled)
  if (username && password) {
    cy.wait('@loginRequest').then(({ response }) => {
      if (response && response.statusCode === 200) {
        // Success path - wait for redirect
        cy.url().should('include', '/evenementen');
        cy.get('[data-cy="filter_naam"]', { timeout: 10000 }).should('be.visible');
      } else {
        // Error path - check for error message
        cy.url().should('include', '/login');
        cy.get('[data-cy="error"]', { timeout: 5000 }).should('be.visible');
      }
    });
  } else {
    // If fields are empty, check for validation errors
    cy.url().should('include', '/login');
    
    if (!username) {
      cy.get('[data-cy="naam-error"]', { timeout: 5000 }).should('be.visible');
    }
    
    if (!password) {
      cy.get('[data-cy="wachtwoord-error"]', { timeout: 5000 }).should('be.visible');
    }
  }
});

// Add a proper programmatic login command
Cypress.Commands.add('loginProgrammatically', (username, password) => {
  // Determine user ID and roles based on username
  let userId, roles, token;
  
  if (username === 'Dylan De Man') {
    userId = 1;
    roles = ['admin', 'user'];
    token = 'fake-jwt-token-for-admin';
  } else if (username === 'Maxime Jacobs') {
    userId = 2;
    roles = ['user'];
    token = 'fake-jwt-token-for-regular-user';
  } else {
    userId = 3;
    roles = ['user'];
    token = 'fake-jwt-token-for-testing';
  }
  
  // Set localStorage directly for authentication
  localStorage.setItem('jwtToken', token);
  localStorage.setItem('loginTime', new Date().toISOString());
  
  // Mock the user data for gebruikers/me endpoint
  cy.intercept('GET', '**/api/gebruikers/me', {
    statusCode: 200,
    body: {
      id: userId,
      naam: username,
      roles: roles
    }
  }).as('getUserData');
  
  cy.log(`Logged in programmatically as ${username}`);
});

// Helper command to select gereedschappen in the form
Cypress.Commands.add('selectGereedschappen', (count = 1) => {
  // Check if there are options available
  cy.get('[data-cy="gereedschap_multiselect"]').then($select => {
    if ($select.find('option').length > 0) {
      // Limit count to the actual number of options
      const availableOptions = $select.find('option').length;
      const selectCount = Math.min(count, availableOptions);
      
      // Select multiple items if requested
      for (let i = 0; i < selectCount; i++) {
        cy.get('[data-cy="gereedschap_multiselect"] option').eq(i).click();
        
        // Click outside after each selection to ensure it's applied
        cy.get('body').click(0, 0);
        
        // Verify the selection was added
        cy.get('[data-cy^="selected_gereedschap_"]').should('have.length.at.least', i + 1);
      }
      
      cy.log(`Selected ${selectCount} gereedschappen`);
    } else {
      cy.log('No gereedschappen available to select');
    }
  });
});

// Helper command to remove gereedschappen from selection
Cypress.Commands.add('removeGereedschappen', (count = 1) => {
  cy.get('body').then($body => {
    const removeButtons = $body.find('[data-cy^="remove_gereedschap_"]');
    const removeCount = Math.min(count, removeButtons.length);
    
    if (removeCount > 0) {
      for (let i = 0; i < removeCount; i++) {
        cy.get('[data-cy^="remove_gereedschap_"]').first().click();
        // Click outside after removing to ensure UI updates
        cy.get('body').click(0, 0);
      }
      cy.log(`Removed ${removeCount} gereedschappen`);
    } else {
      cy.log('No gereedschappen to remove');
    }
  });
});

// Helper to select a dropdown item and click outside to ensure selection applies
Cypress.Commands.add('selectAndClickOutside', (selector, value) => {
  // Select the value in the dropdown
  cy.get(selector).select(value);
  
  // Log what was selected for debugging
  cy.get(selector).then($select => {
    cy.log(`Selected value in ${selector}: ${$select.val()}`);
  });
  
  // Click outside the select element to ensure the selection is applied
  cy.get('body').click(0, 0);
  
  // Wait a bit for the UI to update
  cy.wait(300);

  // Verify the selection was applied
  cy.get(selector).should('have.value', value);

  // Log the final value for debugging
  cy.get(selector).then($select => {
    cy.log(`Final value in ${selector}: ${$select.val()}`);
  });
});

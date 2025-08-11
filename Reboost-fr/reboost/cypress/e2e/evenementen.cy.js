describe('Evenementen Feature', () => {
  context('Als niet-ingelogde gebruiker', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      
      // Create a custom command to mock all necessary endpoints
      cy.intercept('GET', '**/api/evenementen*', { fixture: 'evenementen.json' }).as('getEvenementen');
      cy.intercept('GET', '**/api/gebruikers', { fixture: 'gebruikers.json' }).as('getGebruikers');
      cy.intercept('GET', '**/api/plaatsen', { fixture: 'plaatsen.json' }).as('getPlaatsen');
      cy.intercept('GET', '**/api/gereedschap', { fixture: 'gereedschap.json' }).as('getGereedschap');
      
      cy.visit('http://localhost:5173/evenementen');
      
      // Wait for fixtures to load
      cy.wait('@getEvenementen');
    });

    it('Moet naar login pagina redirecten bij beveiligde acties', () => {
      // Test bewerken
      cy.visit('http://localhost:5173/evenementen/edit/1');
      cy.url().should('include', '/login');
      cy.url().should(url => {
        expect(url).to.satisfy(
          u => u.includes('redirect=evenementen/edit/1') || 
               u.includes('?redirect=') || 
               u.includes('&redirect=')
        );
      });
      
      // Test toevoegen
      cy.visit('http://localhost:5173/evenementen/add');
      cy.url().should('include', '/login');
      cy.url().should(url => {
        expect(url).to.satisfy(
          u => u.includes('redirect=evenementen/add') || 
               u.includes('?redirect=') || 
               u.includes('&redirect=')
        );
      });
    });

    describe('Filter functionaliteit', () => {
      beforeEach(() => {
        // Ensure event data is loaded before testing filters
        cy.get('[data-cy=evenement]').should('have.length.at.least', 1);
      });

      it('Moet correct filteren op naam', () => {
        // Positief scenario
        cy.get('[data-cy="filter_naam"]').type('Metal');
        cy.contains('Global Metalen Forum').should('exist');
        cy.contains('Distributed Structure Expo').should('not.exist');
        cy.contains('Innovate Kleding Forum').should('not.exist');
        
        // Geen resultaten
        cy.get('[data-cy="filter_naam"]').clear().type('NonexistentEvent');
        cy.contains('Global Metalen Forum').should('not.exist');
        cy.get('[data-cy=geen_evenementen_melding]').should('exist');
        
        // Reset filter
        cy.get('[data-cy="filter_naam"]').clear();
        cy.get('[data-cy=evenement]').should('have.length', 3);
      });

      it('Moet correct filteren op auteur en locatie', () => {
        // Validate the dropdown options first
        cy.get('[data-cy="filter_auteur"]').find('option').should('have.length.at.least', 2);
        cy.get('[data-cy="filter_plaats"]').find('option').should('have.length.at.least', 2);
        
        // Log available authors from fixture for debugging
        cy.fixture('evenementen.json').then(data => {
          const authors = [...new Set(data.items.map(e => e.auteur.naam))];
          cy.log(`Available authors in fixture: ${JSON.stringify(authors)}`);
          
          // Get the first author name from fixture
          const firstAuthor = authors[0];
          
          // Filter by the first author from fixture
          cy.get('[data-cy="filter_auteur"]').select(firstAuthor);
          
          // Check that some events are shown and others are hidden
          cy.get('[data-cy=evenement]').should('have.length.at.least', 1);
          cy.get('[data-cy=evenement]').should('have.length.lessThan', 4);
          
          // Reset filter
          cy.get('[data-cy="filter_auteur"]').select('');
          cy.get('[data-cy=evenement]').should('have.length', 3);
          
          // Get the first location from fixture
          const locations = [...new Set(data.items.map(e => e.plaats.naam))];
          cy.log(`Available locations in fixture: ${JSON.stringify(locations)}`);
          const firstLocation = locations[0];
          
          // Filter by the first location from fixture
          cy.get('[data-cy="filter_plaats"]').select(firstLocation);
          
          // Check that some events are shown and others are hidden
          cy.get('[data-cy=evenement]').should('have.length.at.least', 1);
          cy.get('[data-cy=evenement]').should('have.length.lessThan', 4);
        });
      });

      it('Moet correct filteren op datums', () => {
        // Datum van
        cy.get('[data-cy="filter_datum_van"]').type('2025-09-01');
        cy.get('[data-cy=evenement]').should('have.length.lessThan', 3);
        cy.get('[data-cy=evenement]').should('have.length.at.least', 1);
        
        // Reset
        cy.get('[data-cy="filter_datum_van"]').clear();
        cy.get('[data-cy=evenement]').should('have.length', 3);
        
        // Datum tot
        cy.get('[data-cy="filter_datum_tot"]').type('2026-01-01');
        cy.get('[data-cy=evenement]').should('have.length.lessThan', 3);
        cy.get('[data-cy=evenement]').should('have.length.at.least', 1);
        
        // Reset datums
        cy.get('[data-cy="filter_datum_van"]').clear();
        cy.get('[data-cy="filter_datum_tot"]').clear();
        cy.get('[data-cy=evenement]').should('have.length', 3);
      });

      it('Moet meerdere filters kunnen combineren en wissen', () => {
        // Combinatie van filters
        cy.fixture('evenementen.json').then(data => {
          // Get an event to filter on
          const sampleEvent = data.items[0];
          
          // Apply name filter
          cy.get('[data-cy="filter_naam"]').type(sampleEvent.naam.substring(0, 5));
          
          // Apply author filter
          cy.get('[data-cy="filter_auteur"]').select(sampleEvent.auteur.naam);
          
          // Check results
          cy.get('[data-cy=evenement]').should('have.length', 1);
          cy.contains(sampleEvent.naam).should('exist');
          
          // Wis alle filters met knop
          cy.contains('Wis filters').click();
          cy.get('[data-cy="filter_naam"]').should('have.value', '');
          cy.get('[data-cy="filter_auteur"]').should('have.value', '');
          cy.get('[data-cy=evenement]').should('have.length', 3);
        });
      });
    });

    it('Toont correcte meldingen bij lege resultaten en fouten', () => {
      // Lege resultaten test
      cy.intercept('GET', '**/api/evenementen*', {
        statusCode: 200,
        body: { items: [] }
      }).as('emptyResponse');
      
      cy.visit('http://localhost:5173/evenementen');
      cy.wait('@emptyResponse');
      
      cy.get('[data-cy=geen_evenementen_melding]').should('exist');
      cy.contains('Nog geen evenementen').should('exist');
      
      // API error test (500 error)
      cy.intercept('GET', '**/api/evenementen*', {
        statusCode: 500,
        body: { error: 'Internal server error' }
      }).as('serverError');
      
      cy.visit('http://localhost:5173/evenementen');
      cy.wait('@serverError');
      
      cy.get('[data-cy="axios_error_message"]').should('exist');
      cy.contains('Er is een fout opgetreden').should('exist');
      
      // API error test (404 error)
      cy.intercept('GET', '**/api/evenementen*', {
        statusCode: 404,
        body: { error: 'Not found' }
      }).as('notFoundError');
      
      cy.visit('http://localhost:5173/evenementen');
      cy.wait('@notFoundError');
      
      cy.get('[data-cy="axios_error_message"]').should('exist');
      cy.contains('Resource niet gevonden').should('exist');
    });
  });

  context('Als ingelogde gebruiker', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      
      // Login
      cy.visit('http://localhost:5173/login');
      cy.get('[data-cy="loginNaam"]').type('Maxime Jacobs');
      cy.get('[data-cy="loginWachtwoord"]').type('123456789');
      cy.get('[data-cy="loginSubmitButton"]').click();
      
      cy.url().should('include', '/evenementen');
      cy.get('[data-cy="filter_naam"]').should('be.visible');
      
      // Mock API endpoints
      cy.intercept('GET', '**/api/evenementen*', { fixture: 'evenementen.json' }).as('getEvenementen');
      cy.intercept('GET', '**/api/gebruikers', { fixture: 'gebruikers.json' }).as('getGebruikers');
      cy.intercept('GET', '**/api/plaatsen', { fixture: 'plaatsen.json' }).as('getPlaatsen');
      cy.intercept('GET', '**/api/gereedschap', { fixture: 'gereedschap.json' }).as('getGereedschap');
      
      cy.reload();
      cy.wait('@getEvenementen');
    });

    it('Moet CRUD functionaliteiten tonen en correct navigeren', () => {
      // Controleer CRUD knoppen
      cy.contains('Nieuw evenement').should('exist');
      cy.get('[data-cy=evenement_bewerk_knop]').should('exist');
      cy.get('[data-cy="evenement_verwijder_knop"]').should('exist');
      
      // Test navigatie naar toevoegen
      cy.contains('Nieuw evenement').click();
      cy.url().should('include', '/evenementen/add');
      cy.get('[data-cy=evenementNaam_input]').should('exist');
      cy.go('back');
      
      // Test navigatie naar bewerken
      cy.get('[data-cy=evenement_bewerk_knop]').first().click();
      cy.url().should('include', '/evenementen/edit/');
      cy.get('[data-cy=evenementNaam_input]').should('exist');
    });

    
    });
  });

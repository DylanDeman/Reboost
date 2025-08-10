describe('Evenement beheer (aanmaken, bewerken, verwijderen)', () => {
  context('Toegangscontrole', () => {
    it('Moet niet-ingelogde gebruiker redirecten naar login pagina', () => {
      cy.clearLocalStorage();
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
  });

  context('Als ingelogde gebruiker', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      
      cy.visit('http://localhost:5173/login');
      cy.get('[data-cy="loginNaam"]').type('Maxime Jacobs');
      cy.get('[data-cy="loginWachtwoord"]').type('123456789');
      cy.get('[data-cy="loginSubmitButton"]').click();
      
      cy.url().should('include', '/evenementen');
      cy.get('[data-cy="filter_naam"]').should('be.visible');
      
      cy.fixture('gebruikers.json').as('gebruikersData');
      cy.fixture('plaatsen.json').as('plaatsenData');
      cy.fixture('gereedschap.json').as('gereedschapData');
      cy.fixture('evenementen.json').as('evenementenData');
    });

    it('moet een evenement succesvol aanmaken', () => {
      cy.intercept('GET', '**/api/gebruikers', { fixture: 'gebruikers.json' }).as('getGebruikers');
      cy.intercept('GET', '**/api/plaatsen', { fixture: 'plaatsen.json' }).as('getPlaatsen');
      cy.intercept('GET', '**/api/gereedschap', { fixture: 'gereedschap.json' }).as('getGereedschap');
      
      cy.intercept('POST', '**/api/evenementen', (req) => {
        req.reply({
          statusCode: 201,
          body: {
            id: 100,
            naam: req.body.naam || 'testEvenement',
            datum: req.body.datum || '2025-01-20T00:00:00.000Z',
            plaats: {
              id: parseInt(req.body.plaats_id) || 1,
              naam: "Test Locatie"
            },
            auteur: {
              id: parseInt(req.body.auteur_id) || 2,
              naam: "Maxime Jacobs"
            },
            gebruiker: {
              id: parseInt(req.body.auteur_id) || 2,
              naam: "Maxime Jacobs"
            },
            gereedschappen: []
          }
        });
      }).as('createEvenement');
      
      cy.visit('http://localhost:5173/evenementen/add');
      
      cy.wait('@getGebruikers');
      cy.wait('@getPlaatsen');
      cy.wait('@getGereedschap');
      
      cy.get('[data-cy=evenementNaam_input]').type('testEvenement');
      cy.get('[data-cy=datum_input]').type('2025-01-20');
      
      cy.get('[data-cy=plaats_input]').select('1');
      cy.get('body').click(0, 0);
      
      cy.get('[data-cy=auteur_input]').select('2');
      cy.get('body').click(0, 0);
      
      cy.get('[data-cy=auteur_input]').then($select => {
        cy.log(`Selected auteur value: ${$select.val()}`);
      });
      
      cy.get('[data-cy=submit_evenement]').click();
      
      cy.wait('@createEvenement', { timeout: 10000 });
      
      cy.url().should('include', '/evenementen');
    });

    it('moet een evenement bewerken', () => {
      cy.fixture('evenementen.json').then(eventData => {
        const firstEvent = eventData.items[0];
        
        cy.intercept('GET', `**/api/evenementen/${firstEvent.id}`, {
          statusCode: 200,
          body: {
            ...firstEvent,
            gebruiker: firstEvent.auteur
          }
        }).as('getEvenement');
        
        cy.intercept('PUT', `**/api/evenementen/${firstEvent.id}`, {
          statusCode: 200,
          body: {
            ...firstEvent,
            naam: 'Updated Test Event'
          }
        }).as('updateEvenement');
        
        cy.intercept('GET', '**/api/gebruikers', { fixture: 'gebruikers.json' }).as('getGebruikers');
        cy.intercept('GET', '**/api/plaatsen', { fixture: 'plaatsen.json' }).as('getPlaatsen');
        cy.intercept('GET', '**/api/gereedschap', { fixture: 'gereedschap.json' }).as('getGereedschap');
        
        cy.visit(`http://localhost:5173/evenementen/edit/${firstEvent.id}`);
        
        cy.wait('@getEvenement');
        cy.wait('@getGebruikers');
        cy.wait('@getPlaatsen');
        cy.wait('@getGereedschap');
        
        cy.get('[data-cy=evenementNaam_input]').clear().type('Updated Test Event');
        
        cy.get('[data-cy=plaats_input]').select('1');
        cy.get('body').click(0, 0);
        
        cy.get('[data-cy=auteur_input]').select('1');
        cy.get('body').click(0, 0);
        
        cy.get('[data-cy=submit_evenement]').click();
        
        cy.wait('@updateEvenement', { timeout: 10000 });
        
        cy.url().should('include', '/evenementen');
      });
    });

    it('moet een evenement verwijderen', () => {
      cy.intercept('GET', '**/api/evenementen*', { fixture: 'evenementen.json' }).as('getEvenementen');
      cy.intercept('GET', '**/api/gebruikers', { fixture: 'gebruikers.json' }).as('getGebruikers');
      cy.intercept('GET', '**/api/plaatsen', { fixture: 'plaatsen.json' }).as('getPlaatsen');
      cy.intercept('GET', '**/api/gereedschap', { fixture: 'gereedschap.json' }).as('getGereedschap');
      
      cy.visit('http://localhost:5173/evenementen');
      
      cy.wait('@getEvenementen');
      
      cy.get('@evenementenData').then(eventData => {
        expect(eventData).to.have.property('items');
        expect(eventData.items.length).to.be.at.least(1, 'Fixture should have at least 1 event');
        
        const firstEventId = eventData.items[0].id;
        const firstEventName = eventData.items[0].naam;
        
        cy.intercept('DELETE', `**/api/evenementen/${firstEventId}`, {
          statusCode: 200,
          body: { success: true }
        }).as('deleteEvent');
        
        const remainingEvents = {
          items: eventData.items.filter(event => event.id !== firstEventId),
          count: eventData.items.length - 1
        };
        
        cy.intercept('GET', '**/api/evenementen*', {
          statusCode: 200,
          body: remainingEvents
        }).as('getUpdatedEvents');
        
        cy.contains(firstEventName).should('exist');
        
        cy.get('[data-cy=evenement]').then($events => {
          const initialCount = $events.length;
          
          cy.get('[data-cy="evenement_verwijder_knop"]').first().click();
          
          cy.wait('@deleteEvent');
          
          cy.wait('@getUpdatedEvents');
          
          cy.get('[data-cy=evenement]').should('have.length', initialCount - 1);
          
          cy.contains(firstEventName).should('not.exist');
        });
      });
    });
  });
});
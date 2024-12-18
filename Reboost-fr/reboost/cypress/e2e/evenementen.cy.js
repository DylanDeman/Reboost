describe('Evenementenlijst', () => {
  beforeEach(() => {
    const username = 'test@reboost.be';
    const password = 'Test123.';
    
    cy.loginViaAuth0Ui(username, password);
  });
  it('Moet de evenementenlijst tonen', () => {
    cy.intercept(
      'GET',
      'http://localhost:9000/api/evenementen',
      { fixture: 'evenementen.json' },
    );
    cy.visit('http://localhost:5173');
    cy.get('[data-cy=evenement]').should('have.length', 9);
    cy.get('[data-cy=evenement_naam]').contains('Disco Dasco');
    cy.get('[data-cy=evenement_auteur_naam]').eq(0).contains('Dylan De Man'); 
    cy.get('[data-cy=evenement_plaats_naam]').eq(0).contains('Het klokhuis'); 
    cy.get('[data-cy=evenement_plaats_straat]').eq(0).contains('Kaaiplein'); 
    cy.get('[data-cy=evenement_plaats_huisnummer]').eq(0).contains('18'); 
    cy.get('[data-cy=evenement_plaats_postcode]').eq(0).contains('9220'); 
    cy.get('[data-cy=evenement_plaats_gemeente]').eq(0).contains('Hamme'); 
  });


  it('Moet een laden indicator tonen voor een traag antwoord', () => {
   
    cy.intercept(
      'http://localhost:9000/api/evenementen', 
      
      (req) => {
        req.on('response', (res) => {
          res.setDelay(1000);
        });
      },
    ).as('slowResponse'); 
    cy.visit('http://localhost:5173'); 
    cy.get('[data-cy=loader]').should('be.visible'); 
    cy.wait('@slowResponse'); 
    cy.get('[data-cy=loader]').should('not.exist'); 
  });


  it('Moet alle evenementen tonen dat met JH Zenith als locatie', () => {
    cy.visit('http://localhost:5173');
    cy.intercept(
      'GET',
      'http://localhost:9000/api/evenementen',
      { fixture: 'evenementen.json' },
    );

    cy.get('[data-cy=evenementen_search_input]').type('JH Z');
    cy.get('[data-cy=evenementen_search_btn]').click();
  
    cy.get('[data-cy=evenement]').should('have.length', 3);
    cy.get('[data-cy=evenement_plaats_naam]').eq(0).contains(/JH Zenith/);
  });
  
  it('Toont een bericht als er geen evenementen zijn gevonden', () => {
    cy.visit('http://localhost:5173');
  
    cy.get('[data-cy=evenementen_search_input]').type('xyz');
    cy.get('[data-cy=evenementen_search_btn]').click();
  
    cy.get('[data-cy=geen_evenementen_melding]').should('exist');
  });
  
  it('toont een error als de api call faalt', () => {
    cy.intercept('GET', 'http://localhost:9000/api/evenementen', {
      statusCode: 500,
      body: {
        error: 'Internal server error',
      },
    });
    cy.visit('http://localhost:5173');
  
    cy.get('[data-cy=axios_error_message').should('exist');
  });
  
});

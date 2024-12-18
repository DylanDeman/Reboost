// cypress/e2e/addTransaction.cy.js
describe('voeg en verwijder een nieuw evenement', () => {
  beforeEach(() => {
    const username = 'test@reboost.be';
    const password = 'Test123.';
    
    cy.loginViaAuth0Ui(username, password);
  });
  it('moet een nieuw evenement aanmaken', () => {
    cy.visit('http://localhost:5173/evenementen/add'); 

    cy.get('[data-cy=evenementNaam_input]').type('testEvenement')
    cy.get('[data-cy=auteur_input]').select(2); 
    cy.get('[data-cy=datum_input]').type('2025-01-20'); 
    cy.get('[data-cy=plaats_input]').select(3); 
    cy.get('body').click(0, 0);
    cy.get('[data-cy=submit_evenement]').click(); 
    cy.get('[data-cy=evenement_auteur_naam]').eq(9).contains('Steve Schwing'); 
    cy.get('[data-cy=evenement_plaats_naam]').eq(9).contains('JH Zenith'); 
    cy.get('[data-cy=evenement_plaats_straat]').eq(9).contains('Otterstraat'); 
    cy.get('[data-cy=evenement_plaats_huisnummer]').eq(9).contains('58'); 
    cy.get('[data-cy=evenement_plaats_postcode]').eq(9).contains('9200'); 
    cy.get('[data-cy=evenement_plaats_gemeente]').eq(9).contains('Dendermonde'); 
    cy.get('[data-cy=evenement]').should('have.length', 10); 
});



it('moet het nieuwe evenement bewerken', () => {
  cy.visit(`http://localhost:5173/evenementen`); 

  cy.get('[data-cy=evenement_bewerk_knop]').eq(9).click();
  cy.get('[data-cy=evenementNaam_input]').clear();
  cy.get('[data-cy=evenementNaam_input]').type('testEvenementGewijzigd')
  cy.get('[data-cy=auteur_input]').select(1); 
  cy.get('[data-cy=datum_input]').clear();
  cy.get('[data-cy=datum_input]').type('2024-05-16'); 
  cy.get('[data-cy=plaats_input]').select(1); 
  cy.get('body').click(0, 0);
  cy.get('[data-cy=submit_evenement]').click(); 
  cy.get('[data-cy=evenement_auteur_naam]').eq(9).contains('Dylan De Man'); 
  cy.get('[data-cy=evenement_plaats_naam]').eq(9).contains('Het klokhuis'); 
  cy.get('[data-cy=evenement_plaats_straat]').eq(9).contains('Kaaiplein'); 
  cy.get('[data-cy=evenement_plaats_huisnummer]').eq(9).contains('18'); 
  cy.get('[data-cy=evenement_plaats_postcode]').eq(9).contains('9220'); 
  cy.get('[data-cy=evenement_plaats_gemeente]').eq(9).contains('Hamme'); 
  cy.get('[data-cy=evenement]').should('have.length', 10); 
});


it('moet het net aangemaakte evenement verwijderen.', () => {
  cy.visit('http://localhost:5173/evenementen/'); 
  cy.get('[data-cy=evenement_verwijder_knop]').eq(9).click(); 
  cy.get('[data-cy=evenement]').should('have.length', 9); 
});
});
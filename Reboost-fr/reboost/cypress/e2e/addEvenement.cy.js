// cypress/e2e/addTransaction.cy.js
describe('voeg en verwijder een nieuw evenement', () => {
  it('moet een nieuw evenement aanmaken', () => {
    cy.visit('http://localhost:5173/evenementen/add'); 

    cy.get('[data-cy=evenementNaam_input]').type('testEvenement')
    cy.get('[data-cy=auteur_input]').select(2); 
    cy.get('[data-cy=datum_input]').type('2025-01-20'); 
    cy.get('[data-cy=plaats_input]').select(3); 
    cy.get('[data-cy=submit_evenement]').click(); 
    cy.get('[data-cy=evenement_auteur_naam]').eq(10).contains('Steve Schwing'); 
    cy.get('[data-cy=evenement_plaats_naam]').eq(10).contains('JH Zenith'); 
    cy.get('[data-cy=evenement_plaats_straat]').eq(10).contains('Otterstraat'); 
    cy.get('[data-cy=evenement_plaats_huisnummer]').eq(10).contains('58'); 
    cy.get('[data-cy=evenement_plaats_postcode]').eq(10).contains('9200'); 
    cy.get('[data-cy=evenement_plaats_gemeente]').eq(10).contains('Dendermonde'); 
    cy.get('[data-cy=evenement]').should('have.length', 10); 
  });
});


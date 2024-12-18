// cypress/e2e/addTransaction.cy.js
describe('voeg en verwijder een nieuwe plaats', () => {
  beforeEach(() => {
    const username = 'test@reboost.be';
    const password = 'Test123.';
    
    cy.loginViaAuth0Ui(username, password);
  });
  it('moet een nieuwe plaats aanmaken', () => {

    cy.visit('http://localhost:5173/plaatsen/add'); 

    cy.get('[data-cy=plaats_naam_input]').type('testPlaats')
    cy.get('[data-cy=straat_input]').type('Kersenlaan'); 
    cy.get('[data-cy=huisnummer_input]').type('22'); 
    cy.get('[data-cy=postcode_input]').type('9200'); 
    cy.get('[data-cy=gemeente_input]').type('Dendermonde');
    cy.get('[data-cy=submit_plaats]').click(); 
    cy.get('body').click(0, 0);
    cy.get('[data-cy=plaats_naam]').contains('testEvenement');
    cy.get('[data-cy=plaats_adres]').contains('Kersenlaan 22 9200 Dendermonde');
    cy.get('[data-cy=plaats]').should('have.length', 4); 
});


it('moet de nieuwe plaats bewerken', () => {

  cy.visit(`http://localhost:5173/plaatsen`); 

  cy.get('[data-cy=plaats_edit]').eq(4).click();
  cy.get('[data-cy=plaats_naam_input]').clear();
  cy.get('[data-cy=plaats_naam_input]').type('testPlaatsGewijzigd')
  cy.get('[data-cy=straat_input]').clear();
  cy.get('[data-cy=straat_input]').type('Kerkstraat'); 
  cy.get('[data-cy=huisnummer_input]').clear();
  cy.get('[data-cy=huisnummer_input]').type('64'); 
  cy.get('[data-cy=postcode_input]').clear();
  cy.get('[data-cy=postcode_input]').type('9220'); 
  cy.get('[data-cy=gemeente_input]').clear();
  cy.get('[data-cy=gemeente_input]').type('Hamme');
  cy.get('body').click(0, 0);
  cy.get('[data-cy=submit_plaats]').click(); 
  cy.get('[data-cy=plaats_naam]').eq(4).contains('testPlaatsGewijzigd');
  cy.get('[data-cy=plaats_adres]').eq(4).contains('Kerkstraat 64 9220 Hamme');
  cy.get('[data-cy=plaats]').should('have.length', 4); 
});


it('moet de net aangemaakte plaats verwijderen.', () => {
  cy.visit('http://localhost:5173/plaatsen/'); 
  cy.get('[data-cy=plaats_delete]').eq(4).click(); 
  cy.get('[data-cy=plaats]').should('have.length', 3); 
});
});
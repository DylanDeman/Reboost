describe('Error Component', () => {
  context('When error prop is provided', () => {
    it('Displays the error message', () => {
      cy.mount(<Error error="Test error message" />);
      cy.get('[data-cy="error"]').should('exist');
      cy.contains('Test error message').should('be.visible');
    });
    
    it('Shows with alert-danger class', () => {
      cy.mount(<Error error="Error message" />);
      cy.get('.alert-danger').should('exist');
    });
  });
  
  context('When no error prop is provided', () => {
    it('Does not render anything', () => {
      cy.mount(<Error error={null} />);
      cy.get('[data-cy="error"]').should('not.exist');
      cy.get('.alert-danger').should('not.exist');
    });
  });
});

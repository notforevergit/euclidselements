describe('the proposition index', () => {
  it('lists all ten propositions of Book I', () => {
    cy.visit('/');
    cy.contains('h1', 'Straightedge');
    cy.get('[data-testid="proposition"]').should('have.length', 10);
  });

  it('says which propositions are playable now', () => {
    cy.visit('/');
    cy.contains('Proposition 1').should('be.visible');
    cy.get('[data-status="playable"]').should('have.length.at.least', 1);
  });
});

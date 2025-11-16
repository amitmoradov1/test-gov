/// <reference types="cypress" />

describe('Gov.il Authority 262 - Services Appointment Test', () => {
  
  const BASE_URL = 'https://govisit.gov.il/he/authorities/authority/262';
  
  it('Loop through services and verify each appointment URL', () => {
    cy.visit(BASE_URL, {
      timeout: 120000,
      failOnStatusCode: false
    });
    cy.wait(2000);
    
    cy.get('button, a').filter(function() {
      return Cypress.$(this).text().includes('לזימון תור');
    }).then(($buttons) => {
      const buttonCount = $buttons.length;
      cy.log(`Found ${buttonCount} buttons with 'לזימון תור'`);
      
      for (let i = 0; i < buttonCount; i++) {
        cy.visit(BASE_URL, {
          timeout: 120000,
          failOnStatusCode: false
        });
        cy.wait(1500);
        
        cy.get('button, a').filter(function() {
          return Cypress.$(this).text().includes('לזימון תור');
        }).eq(i).click({ force: true });
        
        cy.wait(2000);
        
        cy.url().should('include', 'appointment');
      }
    });
  });
  
});
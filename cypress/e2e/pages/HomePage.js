class HomePage {

  open() {
    cy.visit("https://www.gov.il/he");
  }

  openSearch() {
    cy.get("#wrapIcon").click();       
    cy.get("#SearchInput").should("be.visible"); 
  }

typeInSearch(text) {
  this.openSearch();

  cy.get("#SearchInput").clear();

  if (text) {
    cy.get("#SearchInput").type(text);
  }
}


  clickSearch() {
    cy.get("#btnSearch").click();
  }

  search(text) {
    this.typeInSearch(text);
    this.clickSearch();
  }
}

module.exports = HomePage;

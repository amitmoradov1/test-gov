const HomePage = require("./pages/HomePage.js");
const home = new HomePage();

describe("Gov.il Search Tests", () => {

  beforeEach(() => {
    home.open();
  });

  it("Search for valid term (e.g. דירה)", () => {
    home.search("דירה");
    cy.url().should("include", "Search");
    cy.get('body').should("contain", "דירה");
  });

  it("Search with empty input - should not crash", () => {
    home.search("");
    cy.url().should("include", "Search");
  });

  it("Search for gibberish value", () => {
    home.search("dfnsgfddfjg");
    cy.url().should("include", "Search");
  });

});

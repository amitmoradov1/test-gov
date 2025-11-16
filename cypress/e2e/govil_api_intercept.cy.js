describe("Gov.il API + Static Intercepts (Only working requests)", () => {

  it("Intercepts and validates real requests executed during Cypress run", () => {

    cy.intercept("GET", "**/govilHF/api/GetHeaderMoreData*").as("header");
    cy.intercept("GET", "**/trends.json*").as("trends");

    cy.intercept("GET", "**/*.js").as("jsFile");
    cy.intercept("GET", "**/*.css").as("cssFile");
    cy.intercept("GET", "**/*.png").as("pngFile");

    // visit
    cy.visit("https://www.gov.il/he");

    cy.wait("@header", { timeout: 15000 })
      .its("response.statusCode").should("eq", 200);

    cy.wait("@trends", { timeout: 15000 })
      .its("response.statusCode").should("eq", 200);

    cy.wait("@jsFile", { timeout: 15000 })
      .its("response.statusCode").should("eq", 200);

    cy.wait("@cssFile", { timeout: 15000 })
      .its("response.statusCode").should("eq", 200);

    cy.wait("@pngFile", { timeout: 15000 })
      .its("response.statusCode").should("eq", 200);
  });

});

describe("Gov.il API + Static Intercepts (Only working requests)", () => {

  it("Intercepts and validates real requests executed during Cypress run", () => {

    //כל תקשורת מהסוג הזה תסמן אותה ותן כינוי
    cy.intercept("GET", "**/govilHF/api/GetHeaderMoreData*").as("header");
    cy.intercept("GET", "**/trends.json*").as("trends");

    cy.intercept("GET", "**/*.js").as("jsFile");
    cy.intercept("GET", "**/*.css").as("cssFile");
    cy.intercept("GET", "**/*.png").as("pngFile");

    //בקטע הקוד הזה השתמשתי ב-cy.intercept בתור Spy (מרגל). המטרה שלי הייתה לוודא שהתקשורת הבסיסית של האתר תקינה.

    // visit
    cy.visit("https://www.gov.il/he");

    cy.wait("@header", { timeout: 15000 })
      .its("response.statusCode").should("be.oneOf", [200, 304]);
   // השרת אומר לדפדפן להשתמש בקובץ שכבר שמור אצלו כי הוא לא השתנה לכן 304

    cy.wait("@trends", { timeout: 15000 })
      .its("response.statusCode").should("be.oneOf", [200, 304]);

    cy.wait("@jsFile", { timeout: 15000 })
      .its("response.statusCode").should("be.oneOf", [200, 304]);

    cy.wait("@cssFile", { timeout: 15000 })
      .its("response.statusCode").should("be.oneOf", [200, 304]);

    cy.wait("@pngFile", { timeout: 15000 })
      .its("response.statusCode").should("be.oneOf", [200, 304]);
  });

});

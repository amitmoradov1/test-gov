class HomePage {

  open() {
    cy.visit("https://www.gov.il/he", {
      // 1. מונע מהטסט ליפול אם השרת מחזיר שגיאה (כמו 429 או 403)
      failOnStatusCode: false, 
      
      // 2. משנה את "זהות" הדפדפן כך שיראה כמו כרום רגיל של משתמש אמיתי
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7"
      }
    });
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
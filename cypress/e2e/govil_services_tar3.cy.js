describe('Gov.il Authority 262 - Services Appointment Test', () => {

  // --- קבועים (Constants) ---
  const PAGE_URL = 'https://govisit.gov.il/he/authorities/authority/262';
  const SEARCH_TEXT = 'לזימון תור';
  // סלקטור שתופס גם כפתורים, גם קישורים וגם דיבים לחיצים
  const BUTTON_SELECTOR = 'a, button, div[role="button"]'; 

  
  // --- פונקציות עזר (Helpers) ---
  
  /**
   * פונקציה שמנסה לחלץ כתובת URL מאלמנט ולגלוש אליה.
   * אם אין כתובת, היא מנסה ללחוץ ולתפוס את window.open
   */
  const smartNavigateToService = ($el) => {
    // מנסים למצוא תגית <a> (האלמנט עצמו או ההורה שלו)
    const $anchor = $el.is('a') ? $el : $el.closest('a');
    const href = $anchor.attr('href');

    if (href && href.length > 1) {
      cy.log(` Found standard link. Navigating to: ${href}`);
      cy.visit(href);
    } else {
      cy.log(' No link found. Clicking button & catching window.open...');
      cy.wrap($el).click({ force: true });

      // בדיקה אם נפתח חלון חדש דרך JS
      cy.get('@windowOpen').then((stub) => {
        if (stub.called) {
          const url = stub.args[0][0];
          cy.visit(url);
        }
      });
    }
  };


  // --- הטסט עצמו ---

  it('Scans all services and verifies appointment links', () => {
    
    // 1. הכנה: האזנה לפתיחת חלונות חדשים
    cy.on('window:before:load', (win) => {
      cy.stub(win, 'open').as('windowOpen');
    });

    // 2. כניסה ראשונית כדי לספור כמה כפתורים יש
    cy.visit(PAGE_URL, { failOnStatusCode: false });

    cy.get(BUTTON_SELECTOR, { timeout: 30000 })
      .filter(`:contains("${SEARCH_TEXT}")`)
      .should('have.length.gt', 0)
      .then(($buttons) => {
        
        const totalButtons = $buttons.length;
        cy.log(`Found ${totalButtons} services to check.`);

        // 3. ריצה בלולאה על כל הכפתורים שנמצאו
        for (let i = 0; i < totalButtons; i++) {
          
          cy.log(`--- Checking Service #${i + 1} of ${totalButtons} ---`);

          // חובה: רענון העמוד לפני כל בדיקה כדי לחזור לנקודת ההתחלה
          cy.visit(PAGE_URL, { failOnStatusCode: false });

          // מציאת הכפתור הספציפי (לפי האינדקס i) ושליחה לפונקציית הניווט
          cy.get(BUTTON_SELECTOR)
            .filter(`:contains("${SEARCH_TEXT}")`)
            .eq(i)
            .scrollIntoView()
            .then(($el) => {
              smartNavigateToService($el);
            });

          // 4. וידוא (Assertion) שהגענו לעמוד זימון תור
          cy.url({ timeout: 20000 }).should('include', 'appointment');
        }
      });
  });

});
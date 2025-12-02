// הגנה משגיאות פנימיות של האתר
Cypress.on('uncaught:exception', (err, runnable) => { return false; });

describe('Gov.il Task 4: Banner Swap - Global String Replace Strategy', () => {

  // פונקציית עזר למציאת הטקסט בתוך ה-JSON של האתר הראשון
  function findBannerTitleDeep(obj) {
    if (!obj || typeof obj !== 'object') return null;
    const keys = Object.keys(obj);
    
    // מחפש מפתח שנראה כמו MainBanner
    const bannerKey = keys.find(key => key.toLowerCase() === 'mainbanner');
    
    // אם מצאנו, מחזירים את הטקסט שבתוכו
    if (bannerKey && (obj[bannerKey]?.Title || obj[bannerKey]?.HeaderText)) {
        return obj[bannerKey].Title || obj[bannerKey].HeaderText;
    }
    
    // אם לא, ממשיכים לחפור
    for (const key of keys) {
      const found = findBannerTitleDeep(obj[key]);
      if (found) return found;
    }
    return null;
  }

  it('Harvests text from Public Security and injects it everywhere in PM Office', () => {
    
    let textToInject = "המשרד לביטחון לאומי";

    // --- שלב 1: גניבת הטקסט (Harvesting) ---
    cy.intercept('**/*', (req) => {
        delete req.headers['if-none-match']; 
        req.continue();
    }).as('sourceRequests');
    
    cy.visit('https://www.gov.il/he/departments/ministry_of_public_security/govil-landing-page', {
        failOnStatusCode: false
    });

    cy.wait(3000); 

    cy.get('@sourceRequests.all').then((interceptions) => {
      interceptions.some((interception) => {
        const body = interception.response?.body;
        if (body && typeof body === 'object') {
             const foundTitle = findBannerTitleDeep(body);
             if (foundTitle) {
                 textToInject = foundTitle; // שומרים את הטקסט האמיתי שמצאנו
                 cy.log('SUCCESS: Stole Title:', textToInject);
                 return true; 
             }
        }
        return false;
      });
    });

    // כאן מחליפים כל זכר ל"משרד ראש הממשלה" בטקסט שלקחתי  
    cy.intercept('GET', '**/*', (req) => {
      req.continue((res) => {
        if (res.body) {
           let bodyStr = JSON.stringify(res.body);
           
           if (bodyStr.includes('משרד ראש הממשלה')) {
               bodyStr = bodyStr.replace(/משרד ראש הממשלה/g, textToInject);
               
               res.body = JSON.parse(bodyStr);
           }
        }
      });
    }).as('globalInject');

    cy.visit('https://www.gov.il/he/departments/prime_ministers_office/govil-landing-page', {
        failOnStatusCode: false
    });

    cy.wait(2000);
    
    cy.then(() => {
cy.contains(':visible', textToInject, { timeout: 15000 }).should('be.visible');    });
  });
});
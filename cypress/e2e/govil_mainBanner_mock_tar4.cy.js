describe('Gov.il MainBanner Test', () => {
  it('should extract mainBanner responseData', () => {
    let mainBannerData;

    cy.intercept('**/*').as('allRequests');
    
    cy.visit('https://www.gov.il/he/departments/prime_ministers_office/govil-landing-page');
    
   cy.wait(3000);
    
    cy.get('@allRequests.all').then((interceptions) => {
      interceptions.forEach((interception) => {
          const body = interception.response?.body;
          if (body && typeof body === 'object') {
            if (body.mainBanner) {
              mainBannerData = body.mainBanner;
              cy.log('Found mainBanner:', JSON.stringify(mainBannerData));
            }
           if (body.data?.mainBanner) {
              mainBannerData = body.data.mainBanner;
              cy.log('Found mainBanner in data:', JSON.stringify(mainBannerData));
            }
            if (body.pageProps?.mainBanner) {
              mainBannerData = body.pageProps.mainBanner;
              cy.log('Found mainBanner in pageProps:', JSON.stringify(mainBannerData));
            }
          }
      });
      
      if (mainBannerData) {
        cy.log('SUCCESS - MainBanner Data:', JSON.stringify(mainBannerData, null, 2));
      } else {
        cy.log('mainBanner not found in any API call');
      }
    });
  });
});
import BasePage from './BasePage';

class AdminHomePage extends BasePage {
  constructor() {
    super('/admin/home');
  }

  get titulo() {
    return cy.get('h1');
  }
}

export default new AdminHomePage();

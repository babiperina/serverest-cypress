import BasePage from "./BasePage";

class ProductListPage extends BasePage {
  constructor() {
    super("/admin/listarprodutos");
  }

  get heading() {
    return cy.get("h1");
  }

  productRow(name) {
    return cy.contains("table tbody tr", name);
  }
}

export default new ProductListPage();

import BasePage from "./BasePage";

/**
 * Column headers of the product list table, as shown by the application.
 */
export const PRODUCT_COLUMNS = Object.freeze({
  NAME: "Nome",
  PRICE: "Preço",
  DESCRIPTION: "Descrição",
  QUANTITY: "Quantidade",
  IMAGE: "Imagem",
});

/**
 * The product list table has no data-testid attributes, so rows are found by the
 * product name and cells by the column header text.
 * Good practice would be to add data-testid attributes to the rows, cells and
 * action buttons (for example, data-testid="product-row" and "edit-product"),
 * which would make these selectors independent of the table text.
 */
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

  productCell(productName, column) {
    return cy
      .contains("table thead th", new RegExp(`^${column}$`))
      .invoke("index")
      .then((columnIndex) => this.productRow(productName).find("td").eq(columnIndex));
  }

  editProduct(name) {
    this.productRow(name).contains("button", "Editar").click();
    return this;
  }
}

export default new ProductListPage();

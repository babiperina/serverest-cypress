import LoginPage from "../../support/pages/LoginPage";
import AdminHomePage from "../../support/pages/AdminHomePage";
import CreateProductPage from "../../support/pages/CreateProductPage";
import ProductListPage from "../../support/pages/ProductListPage";
import ProductsService from "../../support/api/ProductsService";
import { USERS } from "../../support/data/userData";
import { PRODUCTS } from "../../support/data/productData";
import { formatDate } from "../../support/utils/date";

/**
 * Known bug: the "Editar" button on the product list does nothing, so this test
 * fails until the edit flow is implemented. See "Known bugs" in the README.
 */
describe("Frontend | Edit product", () => {
  const product = PRODUCTS.bambuLabA1;

  beforeEach(() => {
    LoginPage.visit().login(USERS.admin);
    cy.location("pathname").should("eq", AdminHomePage.path);
  });

  afterEach(() => {
    // The product is shared data: restore the original description if the test changed it.
    ProductsService.findByName(product.nome).then(({ body }) => {
      const [current] = body.produtos;
      if (!current || current.descricao === product.descricao) return;

      cy.getAuthTokenViaApi(USERS.admin).then((token) => {
        ProductsService.update(current._id, product, token).its("status").should("eq", 200);
      });
    });
  });

  it("should let an admin add an edit note to the end of a product description", () => {
    const editNote = ` Editado em ${formatDate()}`;
    const editedDescription = `${product.descricao}${editNote}`;

    ProductListPage.visit().editProduct(product.nome);

    // There is no edit page yet. The test expects the product form to open
    // pre-filled with the product data.
    CreateProductPage.nameInput.should("have.value", product.nome);
    CreateProductPage.descriptionInput.should("have.value", product.descricao).type(editNote);
    CreateProductPage.submitButton.click();

    cy.location("pathname").should("eq", ProductListPage.path);
    ProductListPage.productRow(product.nome)
      .should("be.visible")
      .within(() => {
        cy.get("td").eq(0).should("have.text", product.nome);
        cy.get("td").eq(1).should("have.text", String(product.preco));
        cy.get("td").eq(2).should("have.text", editedDescription);
        cy.get("td").eq(4).should("have.text", product.imagem);
      });
  });
});

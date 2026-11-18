import LoginPage from "../../support/pages/LoginPage";
import AdminHomePage from "../../support/pages/AdminHomePage";
import EditProductPage from "../../support/pages/EditProductPage";
import ProductListPage, { PRODUCT_COLUMNS } from "../../support/pages/ProductListPage";
import ProductsService from "../../support/api/ProductsService";
import { USERS } from "../../support/data/userData";
import { PRODUCTS } from "../../support/data/productData";
import { formatDate } from "../../support/utils/date";

/**
 * Known bug: the "Editar" button on the product list does nothing, so this test
 * fails when it checks that the edit page opened. See "Known bugs" in the README.
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

    ProductListPage.visit().editProduct(product.nome);

    // Known bug: this is where the test fails today, because "Editar" doesn't open any page.
    cy.location("pathname").should((pathname) => {
      expect(pathname, 'edit page should open after clicking "Editar"').not.to.eq(
        ProductListPage.path,
      );
    });
    EditProductPage.appendToDescription(editNote);

    cy.location("pathname").should("eq", ProductListPage.path);
    ProductListPage.productCell(product.nome, PRODUCT_COLUMNS.NAME).should(
      "have.text",
      product.nome,
    );
    ProductListPage.productCell(product.nome, PRODUCT_COLUMNS.DESCRIPTION).should(
      "have.text",
      `${product.descricao}${editNote}`,
    );
    ProductListPage.productCell(product.nome, PRODUCT_COLUMNS.PRICE).should(
      "have.text",
      String(product.preco),
    );
    ProductListPage.productCell(product.nome, PRODUCT_COLUMNS.IMAGE).should(
      "have.text",
      product.imagem,
    );
  });
});

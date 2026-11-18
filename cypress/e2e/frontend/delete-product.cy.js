import LoginPage from "../../support/pages/LoginPage";
import AdminHomePage from "../../support/pages/AdminHomePage";
import ProductListPage from "../../support/pages/ProductListPage";
import ProductsService from "../../support/api/ProductsService";
import { USERS } from "../../support/data/userData";
import { buildProduct } from "../../support/factories/productFactory";
import { MESSAGES } from "../../support/constants/messages";

describe("Frontend | Delete product", () => {
  let product;
  let productId;

  beforeEach(() => {
    product = buildProduct();
    cy.getAuthTokenViaApi(USERS.admin).then((token) => {
      ProductsService.create(product, token).then((response) => {
        expect(response.status, "precondition: create product").to.eq(201);
        productId = response.body._id;
      });
    });

    LoginPage.visit().login(USERS.admin);
    cy.location("pathname").should("eq", AdminHomePage.path);
  });

  afterEach(() => {
    // Removes the product if the test failed before deleting it.
    // Deleting a product that no longer exists is harmless.
    cy.getAuthTokenViaApi(USERS.admin).then((token) => {
      ProductsService.deleteById(productId, token);
    });
  });

  it("should let an admin delete a product and remove it from the product list", () => {
    ProductListPage.visit();
    ProductListPage.productRow(product.nome).should("be.visible");

    // Registered after the first load, so it only matches the reload that follows the deletion.
    cy.intercept("DELETE", `**/produtos/${productId}`).as("deleteProduct");
    cy.intercept("GET", "**/produtos").as("reloadProductList");

    ProductListPage.deleteProduct(product.nome);

    cy.wait("@deleteProduct").then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      expect(response.body.message).to.eq(MESSAGES.DELETION_SUCCESS);
    });
    cy.wait("@reloadProductList");

    cy.location("pathname").should("eq", ProductListPage.path);
    ProductListPage.heading.should("have.text", MESSAGES.PRODUCT_LIST_HEADING);
    ProductListPage.productRow(product.nome).should("not.exist");
  });
});

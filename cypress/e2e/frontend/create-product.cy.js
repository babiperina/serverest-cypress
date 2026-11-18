import CreateProductPage from "../../support/pages/CreateProductPage";
import ProductListPage from "../../support/pages/ProductListPage";
import ProductsService from "../../support/api/ProductsService";
import { buildAdminUser } from "../../support/factories/userFactory";
import { buildProduct } from "../../support/factories/productFactory";
import { MESSAGES } from "../../support/constants/messages";

describe("Frontend | Create product", () => {
  let admin;
  let adminId;
  let productId;

  beforeEach(() => {
    admin = buildAdminUser();
    productId = undefined;
    cy.createUserViaApi(admin).then((id) => {
      adminId = id;
    });
    cy.visit("/");
    cy.loginViaApi(admin);
  });

  afterEach(() => {
    cy.getAuthTokenViaApi(admin).then((token) => {
      if (productId) ProductsService.deleteById(productId, token);
    });
    cy.deleteUserViaApi(adminId);
  });

  it("should let an admin create a product and see it in the product list", () => {
    const product = buildProduct();
    cy.intercept("POST", "**/produtos").as("createProduct");

    CreateProductPage.visit().createProduct(product);

    cy.wait("@createProduct").then(({ request, response }) => {
      expect(request.body).to.include({
        nome: product.nome,
        preco: product.preco,
        descricao: product.descricao,
        quantidade: product.quantidade,
      });
      expect(response.statusCode).to.eq(201);
      expect(response.body.message).to.eq(MESSAGES.REGISTRATION_SUCCESS);
      productId = response.body._id;
    });

    cy.location("pathname").should("eq", ProductListPage.path);
    ProductListPage.heading.should("have.text", MESSAGES.PRODUCT_LIST_HEADING);
    ProductListPage.productRow(product.nome)
      .should("be.visible")
      .within(() => {
        cy.get("td").eq(0).should("have.text", product.nome);
        cy.get("td").eq(1).should("have.text", String(product.preco));
        cy.get("td").eq(2).should("have.text", product.descricao);
        cy.get("td").eq(3).should("have.text", String(product.quantidade));
      });
  });
});

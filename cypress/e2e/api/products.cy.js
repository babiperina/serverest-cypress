import ProductsService from "../../support/api/ProductsService";
import { USERS } from "../../support/data/userData";
import { buildRegularUser } from "../../support/factories/userFactory";
import { buildProduct } from "../../support/factories/productFactory";
import { buildNonExistentId, buildOversizedBody } from "../../support/factories/requestFactory";
import { MESSAGES, VALIDATION_MESSAGES } from "../../support/constants/messages";

describe("API | Products", () => {
  let adminToken;
  let userIds;
  let productIds;
  let cartTokens;

  /** Creates a product as the admin and registers it for cleanup. */
  const createProduct = (product = buildProduct()) =>
    cy.createProductViaApi(product).then((id) => {
      productIds.push(id);
      return id;
    });

  /** Creates a user without the admin role and returns its token. */
  const getRegularUserToken = () => {
    const user = buildRegularUser();
    return cy.createUserViaApi(user).then((id) => {
      userIds.push(id);
      return cy.getAuthTokenViaApi(user);
    });
  };

  beforeEach(() => {
    userIds = [];
    productIds = [];
    cartTokens = [];
    cy.getAuthTokenViaApi(USERS.admin).then((token) => {
      adminToken = token;
    });
  });

  afterEach(() => {
    // Carts first: ServeRest doesn't delete users or products that are in a cart.
    cartTokens.forEach((token) => cy.cancelCartViaApi(token));
    productIds.forEach((id) => cy.deleteProductViaApi(id));
    userIds.forEach((id) => cy.deleteUserViaApi(id));
  });

  describe("GET /produtos", () => {
    it("200 - should return only the product that matches the name filter", () => {
      const product = buildProduct();
      createProduct(product).then((id) => {
        ProductsService.list({ nome: product.nome }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.equal({
            quantidade: 1,
            produtos: [{ ...product, _id: id }],
          });
        });
      });
    });

    it("400 - should reject a price filter that is not a number", () => {
      ProductsService.list({ preco: "abc" }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.deep.equal({ preco: VALIDATION_MESSAGES.notANumber("preco") });
      });
    });
  });

  describe("POST /produtos", () => {
    it("201 - should let an admin create a product", () => {
      ProductsService.create(buildProduct(), adminToken).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message).to.eq(MESSAGES.REGISTRATION_SUCCESS);
        expect(response.body._id).to.be.a("string").and.have.length(16);
        productIds.push(response.body._id);
      });
    });

    it("400 - should not create a product with a name that is already in use", () => {
      const product = buildProduct();
      createProduct(product);
      ProductsService.create(buildProduct({ nome: product.nome }), adminToken).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.deep.equal({ message: MESSAGES.PRODUCT_NAME_ALREADY_USED });
      });
    });

    it("401 - should not create a product without an access token", () => {
      ProductsService.create(buildProduct()).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body).to.deep.equal({ message: MESSAGES.INVALID_TOKEN });
      });
    });

    it("403 - should not allow a user without the admin role to create products", () => {
      getRegularUserToken()
        .then((token) => ProductsService.create(buildProduct(), token))
        .then((response) => {
          expect(response.status).to.eq(403);
          expect(response.body).to.deep.equal({ message: MESSAGES.ADMIN_ONLY_ROUTE });
        });
    });

    it("413 - should reject a body larger than the API accepts", () => {
      ProductsService.request({
        method: "POST",
        body: buildOversizedBody(),
        token: adminToken,
      }).then((response) => {
        expect(response.status).to.eq(413);
        expect(response.body).to.deep.equal({ message: MESSAGES.PAYLOAD_TOO_LARGE });
      });
    });

    // Known bug: the API returns 400 instead of 415. See "Known bugs" in the README.
    it("415 - should reject a body that is not JSON", () => {
      const product = buildProduct();
      ProductsService.sendWithContentType({
        body: `nome=${product.nome}&preco=${product.preco}&descricao=x&quantidade=1`,
        contentType: "text/plain",
        token: adminToken,
      })
        .its("status")
        .should("eq", 415);
    });
  });

  describe("GET /produtos/{_id}", () => {
    it("200 - should return the product with the same data it was created with", () => {
      const product = buildProduct();
      createProduct(product).then((id) => {
        ProductsService.getById(id).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.equal({ ...product, _id: id });
        });
      });
    });

    it("400 - should return not found for an ID that doesn't exist", () => {
      ProductsService.getById(buildNonExistentId()).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.deep.equal({ message: MESSAGES.PRODUCT_NOT_FOUND });
      });
    });
  });

  describe("PUT /produtos/{_id}", () => {
    it("200 - should let an admin update an existing product", () => {
      const product = buildProduct();
      const updatedProduct = { ...product, preco: product.preco + 1 };

      createProduct(product).then((id) => {
        ProductsService.update(id, updatedProduct, adminToken).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.equal({ message: MESSAGES.UPDATE_SUCCESS });
        });
        ProductsService.getById(id)
          .its("body")
          .should("deep.equal", { ...updatedProduct, _id: id });
      });
    });

    it("201 - should create a new product when the ID doesn't exist", () => {
      ProductsService.update(buildNonExistentId(), buildProduct(), adminToken).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message).to.eq(MESSAGES.REGISTRATION_SUCCESS);
        expect(response.body._id).to.be.a("string").and.have.length(16);
        productIds.push(response.body._id);
      });
    });

    it("400 - should not change the name to one that is already in use", () => {
      const existingProduct = buildProduct();
      const product = buildProduct();
      createProduct(existingProduct);
      createProduct(product).then((id) => {
        ProductsService.update(id, { ...product, nome: existingProduct.nome }, adminToken).then(
          (response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.deep.equal({ message: MESSAGES.PRODUCT_NAME_ALREADY_USED });
          },
        );
      });
    });

    it("401 - should not update a product without an access token", () => {
      const product = buildProduct();
      createProduct(product).then((id) => {
        ProductsService.update(id, product).then((response) => {
          expect(response.status).to.eq(401);
          expect(response.body).to.deep.equal({ message: MESSAGES.INVALID_TOKEN });
        });
      });
    });

    it("403 - should not allow a user without the admin role to update products", () => {
      const product = buildProduct();
      createProduct(product).then((id) => {
        getRegularUserToken()
          .then((token) => ProductsService.update(id, product, token))
          .then((response) => {
            expect(response.status).to.eq(403);
            expect(response.body).to.deep.equal({ message: MESSAGES.ADMIN_ONLY_ROUTE });
          });
      });
    });
  });

  describe("DELETE /produtos/{_id}", () => {
    it("200 - should let an admin delete an existing product", () => {
      createProduct().then((id) => {
        ProductsService.deleteById(id, adminToken).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.equal({ message: MESSAGES.DELETION_SUCCESS });
        });
        ProductsService.getById(id).its("body.message").should("eq", MESSAGES.PRODUCT_NOT_FOUND);
      });
    });

    it("200 - should report that no record was deleted when the ID doesn't exist", () => {
      ProductsService.deleteById(buildNonExistentId(), adminToken).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.deep.equal({ message: MESSAGES.NO_RECORD_DELETED });
      });
    });

    it("400 - should not delete a product that is in a cart", () => {
      createProduct().then((productId) => {
        getRegularUserToken().then((token) => {
          cy.createCartViaApi([productId], token).then(() => {
            cartTokens.push(token);

            ProductsService.deleteById(productId, adminToken).then((response) => {
              expect(response.status).to.eq(400);
              expect(response.body.message).to.eq(MESSAGES.PRODUCT_IN_CART);
            });
          });
        });
      });
    });

    it("401 - should not delete a product without an access token", () => {
      createProduct().then((id) => {
        ProductsService.deleteById(id).then((response) => {
          expect(response.status).to.eq(401);
          expect(response.body).to.deep.equal({ message: MESSAGES.INVALID_TOKEN });
        });
      });
    });

    it("403 - should not allow a user without the admin role to delete products", () => {
      createProduct().then((id) => {
        getRegularUserToken()
          .then((token) => ProductsService.deleteById(id, token))
          .then((response) => {
            expect(response.status).to.eq(403);
            expect(response.body).to.deep.equal({ message: MESSAGES.ADMIN_ONLY_ROUTE });
          });
      });
    });
  });
});

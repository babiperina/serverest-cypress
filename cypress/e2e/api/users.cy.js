import UsersService from "../../support/api/UsersService";
import { USERS } from "../../support/data/userData";
import { buildRegularUser } from "../../support/factories/userFactory";
import { buildProduct } from "../../support/factories/productFactory";
import { buildNonExistentId, buildOversizedBody } from "../../support/factories/requestFactory";
import { MESSAGES, VALIDATION_MESSAGES } from "../../support/constants/messages";

describe("API | Users", () => {
  let userIds;
  let productIds;
  let cartTokens;

  /** Creates a user and registers it for cleanup. */
  const createUser = (user = buildRegularUser()) =>
    cy.createUserViaApi(user).then((id) => {
      userIds.push(id);
      return id;
    });

  beforeEach(() => {
    userIds = [];
    productIds = [];
    cartTokens = [];
  });

  afterEach(() => {
    // Carts first: ServeRest doesn't delete users or products that are in a cart.
    cartTokens.forEach((token) => cy.cancelCartViaApi(token));
    productIds.forEach((id) => cy.deleteProductViaApi(id));
    userIds.forEach((id) => cy.deleteUserViaApi(id));
  });

  describe("GET /usuarios", () => {
    it("200 - should return only the user that matches the email filter", () => {
      const user = buildRegularUser();
      createUser(user).then((id) => {
        UsersService.list({ email: user.email }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.equal({ quantidade: 1, usuarios: [{ ...user, _id: id }] });
        });
      });
    });

    it("400 - should reject an email filter in an invalid format", () => {
      UsersService.list({ email: "not-an-email" }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.deep.equal({ email: VALIDATION_MESSAGES.invalidEmail("email") });
      });
    });
  });

  describe("POST /usuarios", () => {
    it("201 - should create a user and return its ID", () => {
      UsersService.create(buildRegularUser()).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message).to.eq(MESSAGES.REGISTRATION_SUCCESS);
        expect(response.body._id).to.be.a("string").and.have.length(16);
        userIds.push(response.body._id);
      });
    });

    it("400 - should not create a user with an email that is already in use", () => {
      UsersService.create(buildRegularUser({ email: USERS.admin.email })).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.deep.equal({ message: MESSAGES.EMAIL_ALREADY_USED });
      });
    });

    it("400 - should require all fields when the body is empty", () => {
      UsersService.create({}).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.deep.equal({
          nome: VALIDATION_MESSAGES.required("nome"),
          email: VALIDATION_MESSAGES.required("email"),
          password: VALIDATION_MESSAGES.required("password"),
          administrador: VALIDATION_MESSAGES.required("administrador"),
        });
      });
    });

    it("413 - should reject a body larger than the API accepts", () => {
      UsersService.request({ method: "POST", body: buildOversizedBody() }).then((response) => {
        expect(response.status).to.eq(413);
        expect(response.body).to.deep.equal({ message: MESSAGES.PAYLOAD_TOO_LARGE });
      });
    });

    // Known bug: the API returns 400 instead of 415. See "Known bugs" in the README.
    it("415 - should reject a body that is not JSON", () => {
      const user = buildRegularUser();
      UsersService.sendWithContentType({
        body: `nome=${user.nome}&email=${user.email}&password=${user.password}&administrador=false`,
        contentType: "text/plain",
      })
        .its("status")
        .should("eq", 415);
    });
  });

  describe("GET /usuarios/{_id}", () => {
    it("200 - should return the user with the same data it was created with", () => {
      const user = buildRegularUser();
      createUser(user).then((id) => {
        UsersService.getById(id).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.equal({ ...user, _id: id });
        });
      });
    });

    it("400 - should return not found for an ID that doesn't exist", () => {
      UsersService.getById(buildNonExistentId()).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.deep.equal({ message: MESSAGES.USER_NOT_FOUND });
      });
    });
  });

  describe("PUT /usuarios/{_id}", () => {
    it("200 - should update an existing user", () => {
      const user = buildRegularUser();
      const updatedUser = { ...user, nome: buildRegularUser().nome };

      createUser(user).then((id) => {
        UsersService.update(id, updatedUser).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.equal({ message: MESSAGES.UPDATE_SUCCESS });
        });
        UsersService.getById(id)
          .its("body")
          .should("deep.equal", { ...updatedUser, _id: id });
      });
    });

    it("201 - should create a new user when the ID doesn't exist", () => {
      UsersService.update(buildNonExistentId(), buildRegularUser()).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message).to.eq(MESSAGES.REGISTRATION_SUCCESS);
        expect(response.body._id).to.be.a("string").and.have.length(16);
        userIds.push(response.body._id);
      });
    });

    it("400 - should not change the email to one that is already in use", () => {
      const user = buildRegularUser();
      createUser(user).then((id) => {
        UsersService.update(id, { ...user, email: USERS.admin.email }).then((response) => {
          expect(response.status).to.eq(400);
          expect(response.body).to.deep.equal({ message: MESSAGES.EMAIL_ALREADY_USED });
        });
      });
    });
  });

  describe("DELETE /usuarios/{_id}", () => {
    it("200 - should delete an existing user", () => {
      createUser().then((id) => {
        UsersService.deleteById(id).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.deep.equal({ message: MESSAGES.DELETION_SUCCESS });
        });
        UsersService.getById(id).its("body.message").should("eq", MESSAGES.USER_NOT_FOUND);
      });
    });

    it("200 - should report that no record was deleted when the ID doesn't exist", () => {
      UsersService.deleteById(buildNonExistentId()).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.deep.equal({ message: MESSAGES.NO_RECORD_DELETED });
      });
    });

    it("400 - should not delete a user that has a cart", () => {
      const user = buildRegularUser();
      createUser(user).then((userId) => {
        cy.createProductViaApi(buildProduct()).then((productId) => {
          productIds.push(productId);
          cy.getAuthTokenViaApi(user).then((token) => {
            cy.createCartViaApi([productId], token).then((cartId) => {
              cartTokens.push(token);

              UsersService.deleteById(userId).then((response) => {
                expect(response.status).to.eq(400);
                expect(response.body).to.deep.equal({
                  message: MESSAGES.USER_WITH_CART,
                  idCarrinho: cartId,
                });
              });
            });
          });
        });
      });
    });
  });
});

import UsersService from "./api/UsersService";
import LoginService from "./api/LoginService";
import ProductsService from "./api/ProductsService";
import CartsService from "./api/CartsService";
import { USERS } from "./data/userData";

/**
 * Custom commands that set up preconditions through the API.
 * Building state through the API (instead of the UI) keeps the specs
 * faster, more stable and focused only on the behavior under test.
 */

Cypress.Commands.add("createUserViaApi", (user) => {
  return UsersService.create(user).then((response) => {
    expect(response.status, "precondition: create user").to.eq(201);
    return response.body._id;
  });
});

Cypress.Commands.add("getAuthTokenViaApi", ({ email, password }) => {
  return LoginService.login({ email, password }).then((response) => {
    expect(response.status, "precondition: authenticate user").to.eq(200);
    return response.body.authorization;
  });
});

Cypress.Commands.add("deleteUserViaApi", (id) => {
  if (!id) return;
  UsersService.deleteById(id);
});

/** Creates a product as the existing admin user and returns its ID. */
Cypress.Commands.add("createProductViaApi", (product) => {
  return cy.getAuthTokenViaApi(USERS.admin).then((token) => {
    return ProductsService.create(product, token).then((response) => {
      expect(response.status, "precondition: create product").to.eq(201);
      return response.body._id;
    });
  });
});

Cypress.Commands.add("deleteProductViaApi", (id) => {
  if (!id) return;
  cy.getAuthTokenViaApi(USERS.admin).then((token) => {
    ProductsService.deleteById(id, token);
  });
});

/** Creates a cart with the given products for the user that owns the token. */
Cypress.Commands.add("createCartViaApi", (productIds, token) => {
  return CartsService.create(productIds, token).then((response) => {
    expect(response.status, "precondition: create cart").to.eq(201);
    return response.body._id;
  });
});

Cypress.Commands.add("cancelCartViaApi", (token) => {
  if (!token) return;
  CartsService.cancelPurchase(token);
});

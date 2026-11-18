import UsersService from "./api/UsersService";
import LoginService from "./api/LoginService";

/**
 * Custom commands that set up preconditions through the API.
 * Building state through the API (instead of the UI) keeps the frontend specs
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

Cypress.Commands.add("loginViaApi", (user) => {
  cy.getAuthTokenViaApi(user).then((token) => {
    cy.window().then((win) => {
      // Keys used by the ServeRest frontend to keep the session.
      win.localStorage.setItem("serverest/userToken", token);
      win.localStorage.setItem("serverest/userNome", user.nome);
      win.localStorage.setItem("serverest/userEmail", user.email);
    });
  });
});

Cypress.Commands.add("deleteUserViaApi", (id) => {
  if (!id) return;
  UsersService.deleteById(id);
});

import LoginPage from "../../support/pages/LoginPage";
import AdminHomePage from "../../support/pages/AdminHomePage";
import { USERS } from "../../support/data/userData";
import { MESSAGES } from "../../support/constants/messages";

describe("Frontend | Login", () => {
  it("should log in an admin user with valid credentials and redirect them to the admin home page", () => {
    cy.intercept("POST", "**/login").as("login");

    LoginPage.visit().login(USERS.admin);

    cy.wait("@login").then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      expect(response.body.message).to.eq(MESSAGES.LOGIN_SUCCESS);
    });

    cy.location("pathname").should("eq", AdminHomePage.path);
    AdminHomePage.heading
      .should("contain.text", MESSAGES.WELCOME_HEADING)
      .and("contain.text", USERS.admin.nome);
    cy.window()
      .its("localStorage")
      .invoke("getItem", "serverest/userToken")
      .should("match", /^Bearer /);
  });

  it("should show an error message and stay on the login page when the password is wrong", () => {
    LoginPage.visit().login({ email: USERS.admin.email, password: "wrong-password" });

    LoginPage.alert.should("be.visible").and("contain.text", MESSAGES.INVALID_CREDENTIALS);
    cy.location("pathname").should("eq", LoginPage.path);
    cy.window().its("localStorage").invoke("getItem", "serverest/userToken").should("be.null");
  });
});

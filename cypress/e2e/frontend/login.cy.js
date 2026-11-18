import LoginPage from "../../support/pages/LoginPage";
import { USERS } from "../../support/data/userData";
import { MESSAGES } from "../../support/constants/messages";

describe("Frontend | Login", () => {
  it("should show an error message and stay on the login page when the password is wrong", () => {
    LoginPage.visit().login({ email: USERS.admin.email, password: "wrong-password" });

    LoginPage.alert.should("be.visible").and("contain.text", MESSAGES.INVALID_CREDENTIALS);
    cy.location("pathname").should("eq", LoginPage.path);
    cy.window().its("localStorage").invoke("getItem", "serverest/userToken").should("be.null");
  });
});

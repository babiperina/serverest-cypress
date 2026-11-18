import LoginPage from "../../support/pages/LoginPage";
import { buildRegularUser } from "../../support/factories/userFactory";
import { MESSAGES } from "../../support/constants/messages";

describe("Frontend | Login", () => {
  let user;
  let userId;

  beforeEach(() => {
    user = buildRegularUser();
    cy.createUserViaApi(user).then((id) => {
      userId = id;
    });
  });

  afterEach(() => {
    cy.deleteUserViaApi(userId);
  });

  it("should show an error message and stay on the login page when the password is wrong", () => {
    LoginPage.visit().login({ email: user.email, password: "wrong-password" });

    LoginPage.alert.should("be.visible").and("contain.text", MESSAGES.INVALID_CREDENTIALS);
    cy.location("pathname").should("eq", LoginPage.path);
    cy.window().its("localStorage").invoke("getItem", "serverest/userToken").should("be.null");
  });
});

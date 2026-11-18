import SignupPage from "../../support/pages/SignupPage";
import AdminHomePage from "../../support/pages/AdminHomePage";
import { buildAdminUser } from "../../support/factories/userFactory";
import { MESSAGES } from "../../support/constants/messages";

describe("Frontend | User signup", () => {
  let userId;

  afterEach(() => {
    cy.deleteUserViaApi(userId);
  });

  it("should register an admin user and redirect them to the admin home page", () => {
    const user = buildAdminUser();
    cy.intercept("POST", "**/usuarios").as("createUser");

    SignupPage.visit().signup(user);

    cy.wait("@createUser").then(({ response }) => {
      expect(response.statusCode).to.eq(201);
      expect(response.body.message).to.eq(MESSAGES.REGISTRATION_SUCCESS);
      userId = response.body._id;
    });

    SignupPage.alert.should("be.visible").and("contain.text", MESSAGES.REGISTRATION_SUCCESS);
    cy.location("pathname").should("eq", AdminHomePage.path);
    AdminHomePage.heading
      .should("contain.text", MESSAGES.WELCOME_HEADING)
      .and("contain.text", user.nome);
  });
});

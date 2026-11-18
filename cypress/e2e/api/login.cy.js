import LoginService from "../../support/api/LoginService";
import { buildRegularUser } from "../../support/factories/userFactory";
import { MESSAGES } from "../../support/constants/messages";

describe("API | Login", () => {
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

  it("should authenticate a user with valid credentials and return a Bearer token", () => {
    LoginService.login(user).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq(MESSAGES.LOGIN_SUCCESS);
      expect(response.body.authorization).to.match(/^Bearer [\w-]+\.[\w-]+\.[\w-]+$/);
    });
  });
});

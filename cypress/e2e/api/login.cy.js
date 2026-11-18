import LoginService from "../../support/api/LoginService";
import { USERS } from "../../support/data/userData";
import { MESSAGES } from "../../support/constants/messages";

describe("API | Login", () => {
  it("should authenticate a user with valid credentials and return a Bearer token", () => {
    LoginService.login(USERS.admin).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq(MESSAGES.LOGIN_SUCCESS);
      expect(response.body.authorization).to.match(/^Bearer [\w-]+\.[\w-]+\.[\w-]+$/);
    });
  });
});

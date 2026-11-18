import LoginService from "../../support/api/LoginService";
import { USERS } from "../../support/data/userData";
import { buildOversizedBody } from "../../support/factories/requestFactory";
import { MESSAGES, VALIDATION_MESSAGES } from "../../support/constants/messages";

describe("API | Login", () => {
  describe("POST /login", () => {
    it("200 - should authenticate a user with valid credentials and return a Bearer token", () => {
      LoginService.login(USERS.admin).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq(MESSAGES.LOGIN_SUCCESS);
        expect(response.body.authorization).to.match(/^Bearer [\w-]+\.[\w-]+\.[\w-]+$/);
      });
    });

    it("400 - should require email and password when the body is empty", () => {
      LoginService.login({}).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.deep.equal({
          email: VALIDATION_MESSAGES.required("email"),
          password: VALIDATION_MESSAGES.required("password"),
        });
      });
    });

    it("400 - should reject an email in an invalid format", () => {
      LoginService.login({ email: "not-an-email", password: USERS.admin.password }).then(
        (response) => {
          expect(response.status).to.eq(400);
          expect(response.body).to.deep.equal({
            email: VALIDATION_MESSAGES.invalidEmail("email"),
          });
        },
      );
    });

    it("401 - should reject a registered email with a wrong password", () => {
      LoginService.login({ email: USERS.admin.email, password: "wrong-password" }).then(
        (response) => {
          expect(response.status).to.eq(401);
          expect(response.body).to.deep.equal({ message: MESSAGES.INVALID_CREDENTIALS });
        },
      );
    });

    it("413 - should reject a body larger than the API accepts", () => {
      LoginService.request({ method: "POST", body: buildOversizedBody() }).then((response) => {
        expect(response.status).to.eq(413);
        expect(response.body).to.deep.equal({ message: MESSAGES.PAYLOAD_TOO_LARGE });
      });
    });

    // Known bug: the API returns 400 instead of 415. See "Known bugs" in the README.
    it("415 - should reject a body that is not JSON", () => {
      LoginService.sendWithContentType({
        body: `email=${USERS.admin.email}&password=${USERS.admin.password}`,
        contentType: "text/plain",
      })
        .its("status")
        .should("eq", 415);
    });
  });
});

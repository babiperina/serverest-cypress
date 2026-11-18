import UsersService from "../../support/api/UsersService";
import { buildRegularUser } from "../../support/factories/userFactory";
import { MESSAGES } from "../../support/constants/messages";

describe("API | Users", () => {
  let userId;

  afterEach(() => {
    cy.deleteUserViaApi(userId);
  });

  it("should create a user and return the same data when fetching it by ID", () => {
    const user = buildRegularUser();

    UsersService.create(user)
      .then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message).to.eq(MESSAGES.REGISTRATION_SUCCESS);
        expect(response.body._id).to.be.a("string").and.not.be.empty;
        userId = response.body._id;

        return UsersService.getById(userId);
      })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.deep.equal({ ...user, _id: userId });
      });
  });
});

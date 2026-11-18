import ProductsService from "../../support/api/ProductsService";
import { buildRegularUser } from "../../support/factories/userFactory";
import { buildProduct } from "../../support/factories/productFactory";
import { MESSAGES } from "../../support/constants/messages";

describe("API | Products", () => {
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

  it("should not allow a user without the admin role to create products", () => {
    const product = buildProduct();

    cy.getAuthTokenViaApi(user)
      .then((token) => ProductsService.create(product, token))
      .then((response) => {
        expect(response.status).to.eq(403);
        expect(response.body).to.deep.equal({ message: MESSAGES.ADMIN_ONLY_ROUTE });
      });
  });
});

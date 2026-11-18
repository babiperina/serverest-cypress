/**
 * Base class for the Page Objects.
 * The ServeRest frontend exposes `data-testid` attributes, which are the selectors
 * most resilient to layout and style changes.
 */
export default class BasePage {
  constructor(path = "/") {
    this.path = path;
  }

  visit() {
    cy.visit(this.path);
    return this;
  }

  getByTestId(testId) {
    return cy.get(`[data-testid="${testId}"]`);
  }
}

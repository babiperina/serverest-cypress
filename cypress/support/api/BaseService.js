/**
 * Base class for the API Service Objects.
 *
 * Holds the API base URL and sends the requests. `failOnStatusCode: false`
 * lets the specs assert on error status codes (4xx) themselves.
 */
export default class BaseService {
  constructor(resource) {
    this.resource = resource;
  }

  get url() {
    return `${Cypress.expose("apiUrl")}/${this.resource}`;
  }

  request({ method = "GET", path = "", body, token } = {}) {
    return cy.request({
      method,
      url: path ? `${this.url}/${path}` : this.url,
      body,
      headers: token ? { Authorization: token } : {},
      failOnStatusCode: false,
    });
  }
}

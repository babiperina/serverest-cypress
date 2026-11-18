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

  request({ method = "GET", path = "", body, token, qs, headers = {} } = {}) {
    return cy.request({
      method,
      url: path ? `${this.url}/${path}` : this.url,
      body,
      qs,
      headers: token ? { ...headers, Authorization: token } : headers,
      failOnStatusCode: false,
    });
  }

  /**
   * Sends a raw body with a given Content-Type, for testing how the API handles
   * bodies that are not JSON.
   */
  sendWithContentType({ method = "POST", path = "", body, contentType, token }) {
    return this.request({ method, path, body, token, headers: { "Content-Type": contentType } });
  }
}

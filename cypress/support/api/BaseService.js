/**
 * Classe base dos Service Objects da API.
 *
 * Centraliza a URL da API e o envio das requisições. `failOnStatusCode: false`
 * permite que os próprios testes façam as assertivas sobre status de erro (4xx).
 */
export default class BaseService {
  constructor(resource) {
    this.resource = resource;
  }

  get url() {
    return `${Cypress.expose('apiUrl')}/${this.resource}`;
  }

  request({ method = 'GET', path = '', body, token } = {}) {
    return cy.request({
      method,
      url: path ? `${this.url}/${path}` : this.url,
      body,
      headers: token ? { Authorization: token } : {},
      failOnStatusCode: false,
    });
  }
}

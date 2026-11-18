/**
 * Classe base dos Page Objects.
 * O frontend do ServeRest expõe atributos `data-testid`, que são os seletores
 * mais resilientes a mudanças de layout/estilo.
 */
export default class BasePage {
  constructor(path = '/') {
    this.path = path;
  }

  visitar() {
    cy.visit(this.path);
    return this;
  }

  getByTestId(testId) {
    return cy.get(`[data-testid="${testId}"]`);
  }
}

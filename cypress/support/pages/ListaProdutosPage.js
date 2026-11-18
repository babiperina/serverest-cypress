import BasePage from "./BasePage";

class ListaProdutosPage extends BasePage {
  constructor() {
    super("/admin/listarprodutos");
  }

  get titulo() {
    return cy.get("h1");
  }

  linhaDoProduto(nome) {
    return cy.contains("table tbody tr", nome);
  }
}

export default new ListaProdutosPage();

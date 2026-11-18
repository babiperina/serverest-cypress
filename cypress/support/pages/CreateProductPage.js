import BasePage from "./BasePage";

class CreateProductPage extends BasePage {
  constructor() {
    super("/admin/cadastrarprodutos");
  }

  get nameInput() {
    return this.getByTestId("nome");
  }

  get priceInput() {
    return this.getByTestId("preco");
  }

  get descriptionInput() {
    return this.getByTestId("descricao");
  }

  get quantityInput() {
    return this.getByTestId("quantity");
  }

  get submitButton() {
    // The "cadastarProdutos" typo comes from the application's own frontend.
    return this.getByTestId("cadastarProdutos");
  }

  createProduct({ nome, preco, descricao, quantidade }) {
    this.nameInput.type(nome);
    this.priceInput.type(String(preco));
    this.descriptionInput.type(descricao);
    this.quantityInput.type(String(quantidade));
    this.submitButton.click();
    return this;
  }
}

export default new CreateProductPage();

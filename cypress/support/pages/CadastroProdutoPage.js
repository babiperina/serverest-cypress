import BasePage from './BasePage';

class CadastroProdutoPage extends BasePage {
  constructor() {
    super('/admin/cadastrarprodutos');
  }

  get campoNome() {
    return this.getByTestId('nome');
  }

  get campoPreco() {
    return this.getByTestId('preco');
  }

  get campoDescricao() {
    return this.getByTestId('descricao');
  }

  get campoQuantidade() {
    return this.getByTestId('quantity');
  }

  get botaoCadastrar() {
    // O typo "cadastarProdutos" existe no próprio frontend da aplicação.
    return this.getByTestId('cadastarProdutos');
  }

  cadastrar({ nome, preco, descricao, quantidade }) {
    this.campoNome.type(nome);
    this.campoPreco.type(String(preco));
    this.campoDescricao.type(descricao);
    this.campoQuantidade.type(String(quantidade));
    this.botaoCadastrar.click();
    return this;
  }
}

export default new CadastroProdutoPage();

import CadastroProdutoPage from "../../support/pages/CadastroProdutoPage";
import ListaProdutosPage from "../../support/pages/ListaProdutosPage";
import ProdutosService from "../../support/api/ProdutosService";
import { criarUsuarioAdministrador } from "../../support/factories/usuarioFactory";
import { criarProduto } from "../../support/factories/produtoFactory";
import { MENSAGENS } from "../../support/constants/mensagens";

describe("Frontend | Cadastro de produto", () => {
  let administrador;
  let administradorId;
  let produtoId;

  beforeEach(() => {
    administrador = criarUsuarioAdministrador();
    produtoId = undefined;
    cy.cadastrarUsuarioViaApi(administrador).then((id) => {
      administradorId = id;
    });
    cy.visit("/");
    cy.logarNoFrontendViaApi(administrador);
  });

  afterEach(() => {
    cy.autenticarViaApi(administrador).then((token) => {
      if (produtoId) ProdutosService.excluir(produtoId, token);
    });
    cy.excluirUsuarioViaApi(administradorId);
  });

  it("deve permitir que um administrador cadastre um produto e visualize-o na listagem", () => {
    const produto = criarProduto();
    cy.intercept("POST", "**/produtos").as("cadastrarProduto");

    CadastroProdutoPage.visitar().cadastrar(produto);

    cy.wait("@cadastrarProduto").then(({ request, response }) => {
      expect(request.body).to.include({
        nome: produto.nome,
        preco: produto.preco,
        descricao: produto.descricao,
        quantidade: produto.quantidade,
      });
      expect(response.statusCode).to.eq(201);
      expect(response.body.message).to.eq(MENSAGENS.CADASTRO_SUCESSO);
      produtoId = response.body._id;
    });

    cy.location("pathname").should("eq", ListaProdutosPage.path);
    ListaProdutosPage.titulo.should("have.text", "Lista dos Produtos");
    ListaProdutosPage.linhaDoProduto(produto.nome)
      .should("be.visible")
      .within(() => {
        cy.get("td").eq(0).should("have.text", produto.nome);
        cy.get("td").eq(1).should("have.text", String(produto.preco));
        cy.get("td").eq(2).should("have.text", produto.descricao);
        cy.get("td").eq(3).should("have.text", String(produto.quantidade));
      });
  });
});

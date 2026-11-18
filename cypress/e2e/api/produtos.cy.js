import ProdutosService from "../../support/api/ProdutosService";
import { criarUsuarioComum } from "../../support/factories/usuarioFactory";
import { criarProduto } from "../../support/factories/produtoFactory";
import { MENSAGENS } from "../../support/constants/mensagens";

describe("API | Produtos", () => {
  let usuario;
  let usuarioId;

  beforeEach(() => {
    usuario = criarUsuarioComum();
    cy.cadastrarUsuarioViaApi(usuario).then((id) => {
      usuarioId = id;
    });
  });

  afterEach(() => {
    cy.excluirUsuarioViaApi(usuarioId);
  });

  it("não deve permitir que um usuário sem perfil de administrador cadastre produtos", () => {
    const produto = criarProduto();

    cy.autenticarViaApi(usuario)
      .then((token) => ProdutosService.cadastrar(produto, token))
      .then((response) => {
        expect(response.status).to.eq(403);
        expect(response.body).to.deep.equal({ message: MENSAGENS.ROTA_EXCLUSIVA_ADMIN });
      });
  });
});

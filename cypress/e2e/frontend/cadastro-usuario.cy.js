import CadastroUsuarioPage from "../../support/pages/CadastroUsuarioPage";
import AdminHomePage from "../../support/pages/AdminHomePage";
import { criarUsuarioAdministrador } from "../../support/factories/usuarioFactory";
import { MENSAGENS } from "../../support/constants/mensagens";

describe("Frontend | Cadastro de usuário", () => {
  let usuarioId;

  afterEach(() => {
    cy.excluirUsuarioViaApi(usuarioId);
  });

  it("deve cadastrar um usuário administrador e redirecioná-lo para a home de administrador", () => {
    const usuario = criarUsuarioAdministrador();
    cy.intercept("POST", "**/usuarios").as("cadastrarUsuario");

    CadastroUsuarioPage.visitar().cadastrar(usuario);

    cy.wait("@cadastrarUsuario").then(({ response }) => {
      expect(response.statusCode).to.eq(201);
      expect(response.body.message).to.eq(MENSAGENS.CADASTRO_SUCESSO);
      usuarioId = response.body._id;
    });

    CadastroUsuarioPage.alerta.should("be.visible").and("contain.text", MENSAGENS.CADASTRO_SUCESSO);
    cy.location("pathname").should("eq", AdminHomePage.path);
    AdminHomePage.titulo.should("contain.text", `Bem Vindo ${usuario.nome}`);
  });
});

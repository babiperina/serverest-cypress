import LoginPage from "../../support/pages/LoginPage";
import { criarUsuarioComum } from "../../support/factories/usuarioFactory";
import { MENSAGENS } from "../../support/constants/mensagens";

describe("Frontend | Login", () => {
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

  it("deve exibir mensagem de erro e permanecer na tela de login ao informar senha incorreta", () => {
    LoginPage.visitar().entrar({ email: usuario.email, password: "senha-incorreta" });

    LoginPage.alerta.should("be.visible").and("contain.text", MENSAGENS.LOGIN_INVALIDO);
    cy.location("pathname").should("eq", LoginPage.path);
    cy.window().its("localStorage").invoke("getItem", "serverest/userToken").should("be.null");
  });
});

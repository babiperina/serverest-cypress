import UsuariosService from "./api/UsuariosService";
import LoginService from "./api/LoginService";

/**
 * Comandos customizados para preparar pré-condições via API.
 * Montar o estado pela API (e não pela UI) deixa os testes de frontend
 * mais rápidos, estáveis e focados apenas no comportamento sob teste.
 */

Cypress.Commands.add("cadastrarUsuarioViaApi", (usuario) => {
  return UsuariosService.cadastrar(usuario).then((response) => {
    expect(response.status, "pré-condição: cadastro do usuário").to.eq(201);
    return response.body._id;
  });
});

Cypress.Commands.add("autenticarViaApi", ({ email, password }) => {
  return LoginService.autenticar({ email, password }).then((response) => {
    expect(response.status, "pré-condição: autenticação do usuário").to.eq(200);
    return response.body.authorization;
  });
});

Cypress.Commands.add("logarNoFrontendViaApi", (usuario) => {
  cy.autenticarViaApi(usuario).then((token) => {
    cy.window().then((win) => {
      win.localStorage.setItem("serverest/userToken", token);
      win.localStorage.setItem("serverest/userNome", usuario.nome);
      win.localStorage.setItem("serverest/userEmail", usuario.email);
    });
  });
});

Cypress.Commands.add("excluirUsuarioViaApi", (id) => {
  if (!id) return;
  UsuariosService.excluir(id);
});

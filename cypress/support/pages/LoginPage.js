import BasePage from "./BasePage";

class LoginPage extends BasePage {
  constructor() {
    super("/login");
  }

  get campoEmail() {
    return this.getByTestId("email");
  }

  get campoSenha() {
    return this.getByTestId("senha");
  }

  get botaoEntrar() {
    return this.getByTestId("entrar");
  }

  get alerta() {
    return cy.get(".alert");
  }

  entrar({ email, password }) {
    this.campoEmail.type(email);
    this.campoSenha.type(password, { log: false });
    this.botaoEntrar.click();
    return this;
  }
}

export default new LoginPage();

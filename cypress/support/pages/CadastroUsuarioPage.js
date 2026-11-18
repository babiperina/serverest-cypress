import BasePage from "./BasePage";

class CadastroUsuarioPage extends BasePage {
  constructor() {
    super("/cadastrarusuarios");
  }

  get campoNome() {
    return this.getByTestId("nome");
  }

  get campoEmail() {
    return this.getByTestId("email");
  }

  get campoSenha() {
    return this.getByTestId("password");
  }

  get checkboxAdministrador() {
    return this.getByTestId("checkbox");
  }

  get botaoCadastrar() {
    return this.getByTestId("cadastrar");
  }

  get alerta() {
    return cy.get(".alert");
  }

  cadastrar({ nome, email, password, administrador }) {
    this.campoNome.type(nome);
    this.campoEmail.type(email);
    this.campoSenha.type(password, { log: false });
    if (administrador === "true") {
      this.checkboxAdministrador.check();
    }
    this.botaoCadastrar.click();
    return this;
  }
}

export default new CadastroUsuarioPage();

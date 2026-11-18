import BasePage from "./BasePage";

class SignupPage extends BasePage {
  constructor() {
    super("/cadastrarusuarios");
  }

  get nameInput() {
    return this.getByTestId("nome");
  }

  get emailInput() {
    return this.getByTestId("email");
  }

  get passwordInput() {
    return this.getByTestId("password");
  }

  get adminCheckbox() {
    return this.getByTestId("checkbox");
  }

  get signupButton() {
    return this.getByTestId("cadastrar");
  }

  get alert() {
    return cy.get(".alert");
  }

  signup({ nome, email, password, administrador }) {
    this.nameInput.type(nome);
    this.emailInput.type(email);
    this.passwordInput.type(password, { log: false });
    if (administrador === "true") {
      this.adminCheckbox.check();
    }
    this.signupButton.click();
    return this;
  }
}

export default new SignupPage();

import BasePage from "./BasePage";

class LoginPage extends BasePage {
  constructor() {
    super("/login");
  }

  get emailInput() {
    return this.getByTestId("email");
  }

  get passwordInput() {
    return this.getByTestId("senha");
  }

  get loginButton() {
    return this.getByTestId("entrar");
  }

  get alert() {
    return cy.get(".alert");
  }

  login({ email, password }) {
    this.emailInput.type(email);
    this.passwordInput.type(password, { log: false });
    this.loginButton.click();
    return this;
  }
}

export default new LoginPage();

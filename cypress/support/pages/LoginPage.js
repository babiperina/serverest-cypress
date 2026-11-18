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

  /**
   * Fills in only the fields that were given, so the same action also covers
   * the scenarios that leave fields empty.
   */
  login({ email, password } = {}) {
    if (email) this.emailInput.type(email);
    if (password) this.passwordInput.type(password, { log: false });
    this.loginButton.click();
    return this;
  }
}

export default new LoginPage();

/**
 * Texts returned by the ServeRest API and frontend.
 * The values are in Portuguese because that is what the application under test returns.
 * Keeping them here means assertions don't scatter hard-coded strings across the specs.
 */
export const MESSAGES = Object.freeze({
  REGISTRATION_SUCCESS: "Cadastro realizado com sucesso",
  DELETION_SUCCESS: "Registro excluído com sucesso",
  LOGIN_SUCCESS: "Login realizado com sucesso",
  INVALID_CREDENTIALS: "Email e/ou senha inválidos",
  EMAIL_REQUIRED: "Email é obrigatório",
  PASSWORD_REQUIRED: "Password é obrigatório",
  ADMIN_ONLY_ROUTE: "Rota exclusiva para administradores",
  WELCOME_HEADING: "Bem Vindo",
  PRODUCT_LIST_HEADING: "Lista dos Produtos",
});

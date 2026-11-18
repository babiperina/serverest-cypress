/**
 * Texts returned by the ServeRest API and frontend.
 * The values are in Portuguese because that is what the application under test returns.
 * Keeping them here means assertions don't scatter hard-coded strings across the specs.
 */
export const MESSAGES = Object.freeze({
  REGISTRATION_SUCCESS: "Cadastro realizado com sucesso",
  UPDATE_SUCCESS: "Registro alterado com sucesso",
  DELETION_SUCCESS: "Registro excluído com sucesso",
  NO_RECORD_DELETED: "Nenhum registro excluído",
  LOGIN_SUCCESS: "Login realizado com sucesso",
  INVALID_CREDENTIALS: "Email e/ou senha inválidos",
  EMAIL_REQUIRED: "Email é obrigatório",
  PASSWORD_REQUIRED: "Password é obrigatório",
  EMAIL_ALREADY_USED: "Este email já está sendo usado",
  PRODUCT_NAME_ALREADY_USED: "Já existe produto com esse nome",
  USER_NOT_FOUND: "Usuário não encontrado",
  PRODUCT_NOT_FOUND: "Produto não encontrado",
  USER_WITH_CART: "Não é permitido excluir usuário com carrinho cadastrado",
  PRODUCT_IN_CART: "Não é permitido excluir produto que faz parte de carrinho",
  INVALID_TOKEN: "Token de acesso ausente, inválido, expirado ou usuário do token não existe mais",
  ADMIN_ONLY_ROUTE: "Rota exclusiva para administradores",
  PAYLOAD_TOO_LARGE: "Payload too large",
  WELCOME_HEADING: "Bem Vindo",
  PRODUCT_LIST_HEADING: "Lista dos Produtos",
});

/**
 * Field validation messages returned by the API, keyed by the field name in the response body.
 */
export const VALIDATION_MESSAGES = Object.freeze({
  required: (field) => `${field} é obrigatório`,
  invalidEmail: (field) => `${field} deve ser um email válido`,
  notANumber: (field) => `${field} deve ser um número`,
});

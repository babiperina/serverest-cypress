/**
 * Mensagens retornadas pela API/Frontend do ServeRest.
 * Centralizadas para que as assertivas não dependam de strings espalhadas pelos testes.
 */
export const MENSAGENS = Object.freeze({
  CADASTRO_SUCESSO: 'Cadastro realizado com sucesso',
  LOGIN_SUCESSO: 'Login realizado com sucesso',
  LOGIN_INVALIDO: 'Email e/ou senha inválidos',
  ROTA_EXCLUSIVA_ADMIN: 'Rota exclusiva para administradores',
});

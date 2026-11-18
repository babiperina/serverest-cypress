import { faker } from '@faker-js/faker';

/**
 * Factory de usuários: gera massa de dados única a cada execução,
 * evitando conflitos (ex.: e-mail duplicado) no ambiente compartilhado do ServeRest.
 *
 * @param {Partial<{nome: string, email: string, password: string, administrador: 'true'|'false'}>} overrides
 */
export const criarUsuario = (overrides = {}) => ({
  nome: faker.person.fullName(),
  email: faker.internet.email({ provider: 'qa.serverest.dev' }).toLowerCase(),
  password: faker.internet.password({ length: 12 }),
  administrador: 'true',
  ...overrides,
});

export const criarUsuarioAdministrador = (overrides = {}) =>
  criarUsuario({ administrador: 'true', ...overrides });

export const criarUsuarioComum = (overrides = {}) =>
  criarUsuario({ administrador: 'false', ...overrides });

import { faker } from "@faker-js/faker";

/**
 * Builds unique user data on every run, avoiding conflicts (such as duplicate e-mails)
 * in the shared ServeRest environment.
 * Field names follow the ServeRest API contract.
 *
 * @param {Partial<{nome: string, email: string, password: string, administrador: 'true'|'false'}>} overrides
 */
export const buildUser = (overrides = {}) => ({
  nome: faker.person.fullName(),
  email: faker.internet.email({ provider: "qa.serverest.dev" }).toLowerCase(),
  password: faker.internet.password({ length: 12 }),
  administrador: "true",
  ...overrides,
});

export const buildAdminUser = (overrides = {}) =>
  buildUser({ administrador: "true", ...overrides });

export const buildRegularUser = (overrides = {}) =>
  buildUser({ administrador: "false", ...overrides });

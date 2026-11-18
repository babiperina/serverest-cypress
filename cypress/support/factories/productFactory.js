import { faker } from "@faker-js/faker";

/**
 * Builds unique product data. The name gets a random suffix because
 * ServeRest does not allow two products with the same name.
 * Field names follow the ServeRest API contract.
 *
 * @param {Partial<{nome: string, preco: number, descricao: string, quantidade: number}>} overrides
 */
export const buildProduct = (overrides = {}) => ({
  nome: `${faker.commerce.productName()} ${faker.string.alphanumeric(8)}`,
  preco: faker.number.int({ min: 1, max: 5000 }),
  descricao: faker.commerce.productDescription().slice(0, 100),
  quantidade: faker.number.int({ min: 1, max: 500 }),
  ...overrides,
});

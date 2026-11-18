import { faker } from '@faker-js/faker';

/**
 * Factory de produtos. O nome recebe um sufixo único porque o ServeRest
 * não permite dois produtos com o mesmo nome.
 *
 * @param {Partial<{nome: string, preco: number, descricao: string, quantidade: number}>} overrides
 */
export const criarProduto = (overrides = {}) => ({
  nome: `${faker.commerce.productName()} ${faker.string.alphanumeric(8)}`,
  preco: faker.number.int({ min: 1, max: 5000 }),
  descricao: faker.commerce.productDescription().slice(0, 100),
  quantidade: faker.number.int({ min: 1, max: 500 }),
  ...overrides,
});

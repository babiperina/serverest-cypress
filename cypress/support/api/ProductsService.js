import BaseService from "./BaseService";

class ProductsService extends BaseService {
  constructor() {
    super("produtos");
  }

  create(product, token) {
    return this.request({ method: "POST", body: product, token });
  }

  findByName(name) {
    return cy.request({ url: this.url, qs: { nome: name } });
  }

  update(id, product, token) {
    return this.request({ method: "PUT", path: id, body: product, token });
  }

  deleteById(id, token) {
    return this.request({ method: "DELETE", path: id, token });
  }
}

export default new ProductsService();

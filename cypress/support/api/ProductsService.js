import BaseService from "./BaseService";

class ProductsService extends BaseService {
  constructor() {
    super("produtos");
  }

  list(filters) {
    return this.request({ qs: filters });
  }

  findByName(name) {
    return this.list({ nome: name });
  }

  create(product, token) {
    return this.request({ method: "POST", body: product, token });
  }

  getById(id) {
    return this.request({ path: id });
  }

  update(id, product, token) {
    return this.request({ method: "PUT", path: id, body: product, token });
  }

  deleteById(id, token) {
    return this.request({ method: "DELETE", path: id, token });
  }
}

export default new ProductsService();

import BaseService from "./BaseService";

class ProductsService extends BaseService {
  constructor() {
    super("produtos");
  }

  create(product, token) {
    return this.request({ method: "POST", body: product, token });
  }

  deleteById(id, token) {
    return this.request({ method: "DELETE", path: id, token });
  }
}

export default new ProductsService();

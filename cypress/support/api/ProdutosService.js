import BaseService from "./BaseService";

class ProdutosService extends BaseService {
  constructor() {
    super("produtos");
  }

  cadastrar(produto, token) {
    return this.request({ method: "POST", body: produto, token });
  }

  excluir(id, token) {
    return this.request({ method: "DELETE", path: id, token });
  }
}

export default new ProdutosService();

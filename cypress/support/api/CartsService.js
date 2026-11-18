import BaseService from "./BaseService";

/**
 * Carts are only used to set up preconditions: ServeRest doesn't allow deleting
 * a user that has a cart, or a product that is in a cart.
 */
class CartsService extends BaseService {
  constructor() {
    super("carrinhos");
  }

  create(productIds, token) {
    const produtos = productIds.map((idProduto) => ({ idProduto, quantidade: 1 }));
    return this.request({ method: "POST", body: { produtos }, token });
  }

  /** Deletes the cart of the token's user and returns the products to stock. */
  cancelPurchase(token) {
    return this.request({ method: "DELETE", path: "cancelar-compra", token });
  }
}

export default new CartsService();

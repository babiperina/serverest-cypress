import BaseService from "./BaseService";

class UsersService extends BaseService {
  constructor() {
    super("usuarios");
  }

  create(user) {
    return this.request({ method: "POST", body: user });
  }

  getById(id) {
    return this.request({ path: id });
  }

  deleteById(id) {
    return this.request({ method: "DELETE", path: id });
  }
}

export default new UsersService();

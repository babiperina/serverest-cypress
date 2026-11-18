import BaseService from "./BaseService";

class UsersService extends BaseService {
  constructor() {
    super("usuarios");
  }

  list(filters) {
    return this.request({ qs: filters });
  }

  create(user) {
    return this.request({ method: "POST", body: user });
  }

  getById(id) {
    return this.request({ path: id });
  }

  update(id, user) {
    return this.request({ method: "PUT", path: id, body: user });
  }

  deleteById(id) {
    return this.request({ method: "DELETE", path: id });
  }
}

export default new UsersService();

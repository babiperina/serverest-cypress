import BaseService from "./BaseService";

class LoginService extends BaseService {
  constructor() {
    super("login");
  }

  login({ email, password }) {
    return this.request({ method: "POST", body: { email, password } });
  }
}

export default new LoginService();

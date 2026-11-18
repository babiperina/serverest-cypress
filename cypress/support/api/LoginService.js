import BaseService from "./BaseService";

class LoginService extends BaseService {
  constructor() {
    super("login");
  }

  autenticar({ email, password }) {
    return this.request({ method: "POST", body: { email, password } });
  }
}

export default new LoginService();

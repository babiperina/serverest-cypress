import BaseService from './BaseService';

class UsuariosService extends BaseService {
  constructor() {
    super('usuarios');
  }

  cadastrar(usuario) {
    return this.request({ method: 'POST', body: usuario });
  }

  buscarPorId(id) {
    return this.request({ path: id });
  }

  excluir(id) {
    return this.request({ method: 'DELETE', path: id });
  }
}

export default new UsuariosService();

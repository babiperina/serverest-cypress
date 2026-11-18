import UsuariosService from '../../support/api/UsuariosService';
import { criarUsuarioComum } from '../../support/factories/usuarioFactory';
import { MENSAGENS } from '../../support/constants/mensagens';

describe('API | Usuários', () => {
  let usuarioId;

  afterEach(() => {
    cy.excluirUsuarioViaApi(usuarioId);
  });

  it('deve cadastrar um usuário e retorná-lo com os mesmos dados na consulta por ID', () => {
    const usuario = criarUsuarioComum();

    UsuariosService.cadastrar(usuario)
      .then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message).to.eq(MENSAGENS.CADASTRO_SUCESSO);
        expect(response.body._id).to.be.a('string').and.not.be.empty;
        usuarioId = response.body._id;

        return UsuariosService.buscarPorId(usuarioId);
      })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.deep.equal({ ...usuario, _id: usuarioId });
      });
  });
});

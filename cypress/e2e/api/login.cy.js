import LoginService from '../../support/api/LoginService';
import { criarUsuarioComum } from '../../support/factories/usuarioFactory';
import { MENSAGENS } from '../../support/constants/mensagens';

describe('API | Login', () => {
  let usuario;
  let usuarioId;

  beforeEach(() => {
    usuario = criarUsuarioComum();
    cy.cadastrarUsuarioViaApi(usuario).then((id) => {
      usuarioId = id;
    });
  });

  afterEach(() => {
    cy.excluirUsuarioViaApi(usuarioId);
  });

  it('deve autenticar um usuário com credenciais válidas e retornar um token Bearer', () => {
    LoginService.autenticar(usuario).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq(MENSAGENS.LOGIN_SUCESSO);
      expect(response.body.authorization).to.match(/^Bearer [\w-]+\.[\w-]+\.[\w-]+$/);
    });
  });
});

# ServeRest – Testes automatizados com Cypress

Testes E2E do **frontend** ([front.serverest.dev](https://front.serverest.dev/)) e testes da **API** ([serverest.dev](https://serverest.dev/)) do ServeRest, escritos com Cypress e JavaScript.

## Cenários

### Frontend (E2E)

| # | Spec | Cenário |
|---|------|---------|
| 1 | `frontend/cadastro-usuario.cy.js` | Deve cadastrar um usuário administrador e redirecioná-lo para a home de administrador |
| 2 | `frontend/login.cy.js` | Deve exibir mensagem de erro e permanecer na tela de login ao informar senha incorreta |
| 3 | `frontend/cadastro-produto.cy.js` | Deve permitir que um administrador cadastre um produto e visualize-o na listagem |

### API

| # | Spec | Cenário |
|---|------|---------|
| 1 | `api/usuarios.cy.js` | Deve cadastrar um usuário e retorná-lo com os mesmos dados na consulta por ID |
| 2 | `api/login.cy.js` | Deve autenticar um usuário com credenciais válidas e retornar um token Bearer |
| 3 | `api/produtos.cy.js` | Não deve permitir que um usuário sem perfil de administrador cadastre produtos |

Os cenários misturam caminhos de sucesso e de erro, e cobrem cadastro, autenticação e autorização.

## Estrutura

```
cypress/
├── e2e/
│   ├── api/                 # Specs de API
│   └── frontend/            # Specs E2E do frontend
└── support/
    ├── api/                 # Service Objects (um por recurso da API)
    ├── pages/               # Page Objects (um por tela)
    ├── factories/           # Geração de massa de dados com Faker
    ├── constants/           # Mensagens esperadas da aplicação
    ├── commands.js          # Comandos customizados (pré-condições via API)
    └── e2e.js
```

## Padrões e decisões

- **Page Objects** (`support/pages`): cada tela encapsula seus seletores e ações. Os testes descrevem *o que* é feito; os Page Objects definem *como*. Todos herdam de `BasePage`.
- **Service Objects** (`support/api`): cada recurso da API (`/usuarios`, `/login`, `/produtos`) tem uma classe que herda de `BaseService`, que centraliza URL base, headers e o tratamento de status code.
- **Factories** (`support/factories`): massa de dados gerada com `@faker-js/faker` a cada execução. Assim os testes não dependem de dados fixos e não conflitam no ambiente público e compartilhado do ServeRest (e-mails e nomes de produto duplicados).
- **Pré-condições via API**: usuários e sessões são criados pela API (`cy.cadastrarUsuarioViaApi`, `cy.logarNoFrontendViaApi`). A UI só é usada para o comportamento que está sendo testado, o que deixa os testes mais rápidos e menos frágeis.
- **Independência e limpeza**: cada teste cria a própria massa e a remove no `afterEach`, então os testes podem rodar isolados e em qualquer ordem.
- **Seletores estáveis**: só `data-testid` (exceto alertas e títulos, que não têm esse atributo).
- **Assertivas sobre comportamento**: os testes de frontend validam a UI (mensagem, rota, conteúdo da tabela) e também o contrato da requisição interceptada com `cy.intercept`, sem nenhum `cy.wait(<ms>)` fixo.
- **Mensagens centralizadas** (`support/constants/mensagens.js`), para que as assertivas não espalhem strings mágicas.

## Pré-requisitos

- Node.js 20+ (a versão usada está em `.nvmrc`)

## Como executar

```bash
npm install

npm test                # todos os testes (headless)
npm run test:api        # apenas API
npm run test:frontend   # apenas frontend
npm run cy:open         # modo interativo

npm run lint            # ESLint (com eslint-plugin-cypress)
```

As URLs podem ser trocadas por variáveis de ambiente:

```bash
FRONT_URL=http://localhost:3000 API_URL=http://localhost:3000 npm test
```

> **Dica:** se o Cypress falhar com `bad option: --smoke-test` ao rodar pelo terminal integrado do VS Code, execute `unset ELECTRON_RUN_AS_NODE` antes.

## CI

O workflow em `.github/workflows/ci.yml` roda o lint e depois as suítes de API e frontend em paralelo a cada push/PR na `main`. Se algo falhar, os screenshots são publicados como artefato.

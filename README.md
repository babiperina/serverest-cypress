# ServeRest – Automated tests with Cypress

End-to-end tests for the ServeRest **frontend** ([front.serverest.dev](https://front.serverest.dev/)) and tests for its **API** ([serverest.dev](https://serverest.dev/)), written with Cypress and JavaScript.

## Scenarios

### Frontend (E2E)

| #   | Spec                            | Scenario                                                                         |
| --- | ------------------------------- | -------------------------------------------------------------------------------- |
| 1   | `frontend/user-signup.cy.js`    | Registers an admin user through the UI and redirects them to the admin home page |
| 2   | `frontend/login.cy.js`          | Shows an error message and stays on the login page when the password is wrong    |
| 3   | `frontend/create-product.cy.js` | Lets an admin create a product and shows it in the product list                  |

### API

| #   | Spec                 | Scenario                                                                |
| --- | -------------------- | ----------------------------------------------------------------------- |
| 1   | `api/users.cy.js`    | Creates a user and returns the same data when the user is fetched by ID |
| 2   | `api/login.cy.js`    | Authenticates a user with valid credentials and returns a Bearer token  |
| 3   | `api/products.cy.js` | Rejects product creation by a user without the admin role (`403`)       |

The scenarios mix success and error paths and cover registration, authentication and authorization.

## Project structure

```
cypress/
├── e2e/
│   ├── api/                 # API specs
│   └── frontend/            # Frontend E2E specs
└── support/
    ├── api/                 # Service Objects (one per API resource)
    ├── pages/               # Page Objects (one per screen)
    ├── data/                # Existing users reused by read-only scenarios
    ├── factories/           # Test data generation with Faker
    ├── constants/           # Messages returned by the application
    ├── commands.js          # Custom commands (setting up preconditions via the API)
    └── e2e.js
```

## Patterns and design decisions

- **Page Objects** (`support/pages`): each screen wraps its own selectors and actions. Tests describe _what_ happens; Page Objects define _how_. All of them extend `BasePage`.
- **Service Objects** (`support/api`): each API resource (`/usuarios`, `/login`, `/produtos`) has a class that extends `BaseService`, which holds the base URL, headers and status code handling in one place.
- **Factories** (`support/factories`): test data is generated with `@faker-js/faker` on every run. Tests don't depend on fixed data and don't collide with other users of the public, shared ServeRest environment (duplicate e-mails or product names).
- **Existing test data** (`support/data/userData.js`): users that already exist in ServeRest. Scenarios that only read data, such as login, reuse them instead of creating a user. Tests never update or delete these users.
- **Preconditions through the API**: users and sessions are created through the API (`cy.createUserViaApi`, `cy.loginViaApi`). The UI is only used for the behavior under test, which keeps the tests fast and less brittle.
- **Isolation and cleanup**: each test creates its own data and deletes it in `afterEach`, so tests can run alone and in any order.
- **Stable selectors**: only `data-testid` attributes are used (except for alerts and headings, which don't have one).
- **Behavior-focused assertions**: frontend tests check the UI (message, route, table content) and also the intercepted request and response with `cy.intercept`. There are no fixed `cy.wait(<ms>)` calls.
- **Centralized messages** (`support/constants/messages.js`), so assertions don't scatter magic strings.
- **Language**: the code is written in English. The only Portuguese text is what belongs to the application under test: the messages it returns, API field names (`nome`, `preco`, ...), routes and `data-testid` values.

## Requirements

- Node.js 20+ (the version used is in `.nvmrc`)

## Running the tests

```bash
npm install

npm test                # all tests (headless)
npm run test:api        # API tests only
npm run test:frontend   # frontend tests only
npm run cy:open         # interactive mode (watch the tests run in the browser)

npm run lint            # ESLint (with eslint-plugin-cypress)
npm run format          # Prettier
```

The URLs can be overridden with environment variables:

```bash
FRONT_URL=http://localhost:3000 API_URL=http://localhost:3000 npm test
```

> **Tip:** if Cypress fails with `bad option: --smoke-test` when started from the VS Code integrated terminal, run `unset ELECTRON_RUN_AS_NODE` first.

## CI

The workflow in `.github/workflows/ci.yml` runs ESLint and the Prettier check, and then the API and frontend suites in parallel on every push and pull request to `main`. If something fails, the screenshots are uploaded as a build artifact.

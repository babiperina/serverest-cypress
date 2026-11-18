# ServeRest – Automated tests with Cypress

End-to-end tests for the ServeRest **frontend** ([front.serverest.dev](https://front.serverest.dev/)) and tests for its **API** ([serverest.dev](https://serverest.dev/)), written with Cypress and JavaScript.

## Scenarios

### Frontend (E2E)

| #   | Spec                            | Scenario                                                                                                                                           |
| --- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `frontend/user-signup.cy.js`    | Registers an admin user through the UI and redirects them to the admin home page                                                                   |
| 2   | `frontend/login.cy.js`          | Logs in an admin user with valid credentials and redirects them to the admin home page                                                             |
| 3   | `frontend/login.cy.js`          | Shows an error message and stays on the login page when the password is wrong                                                                      |
| 4   | `frontend/login.cy.js`          | Shows a required message for each field when both are empty                                                                                        |
| 5   | `frontend/login.cy.js`          | Shows only the password required message when the password is empty                                                                                |
| 6   | `frontend/login.cy.js`          | Shows only the email required message when the email is empty                                                                                      |
| 7   | `frontend/create-product.cy.js` | Lets an admin create a product and shows it in the product list                                                                                    |
| 8   | `frontend/edit-product.cy.js`   | Lets an admin add `Editado em <today>` to the end of a product description (**fails: [known bug](#edit-button-on-the-product-list-does-nothing)**) |
| 9   | `frontend/delete-product.cy.js` | Lets an admin delete a product (created through the API) and removes it from the product list                                                      |

### API

The API specs cover the status codes documented in the [Swagger](https://serverest.dev/) for the login, users and products endpoints. Each test title starts with the status code it checks, and the tests are grouped by endpoint.

| Endpoint                 | Spec                 | Status codes covered                                                                                                 |
| ------------------------ | -------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `POST /login`            | `api/login.cy.js`    | 200, 400 (empty body, invalid email), 401, 413, 415 (**[known bug](#api-never-returns-415-unsupported-media-type)**) |
| `GET /usuarios`          | `api/users.cy.js`    | 200 (email filter), 400 (invalid filter)                                                                             |
| `POST /usuarios`         | `api/users.cy.js`    | 201, 400 (email in use, empty body), 413, 415 (**[known bug](#api-never-returns-415-unsupported-media-type)**)       |
| `GET /usuarios/{_id}`    | `api/users.cy.js`    | 200, 400 (not found)                                                                                                 |
| `PUT /usuarios/{_id}`    | `api/users.cy.js`    | 200, 201 (ID doesn't exist), 400 (email in use)                                                                      |
| `DELETE /usuarios/{_id}` | `api/users.cy.js`    | 200 (deleted), 200 (no record deleted), 400 (user has a cart)                                                        |
| `GET /produtos`          | `api/products.cy.js` | 200 (name filter), 400 (invalid filter)                                                                              |
| `POST /produtos`         | `api/products.cy.js` | 201, 400 (name in use), 401, 403, 413, 415 (**[known bug](#api-never-returns-415-unsupported-media-type)**)          |
| `GET /produtos/{_id}`    | `api/products.cy.js` | 200, 400 (not found)                                                                                                 |
| `PUT /produtos/{_id}`    | `api/products.cy.js` | 200, 201 (ID doesn't exist), 400 (name in use), 401, 403                                                             |
| `DELETE /produtos/{_id}` | `api/products.cy.js` | 200 (deleted), 200 (no record deleted), 400 (product in a cart), 401, 403                                            |

`429 Too Many Requests` is documented for every endpoint but is not automated (see [Technical questions](#429-too-many-requests-is-not-automated)).

## Project structure

```
cypress/
├── e2e/
│   ├── api/                 # API specs
│   └── frontend/            # Frontend E2E specs
└── support/
    ├── api/                 # Service Objects (one per API resource, plus carts for preconditions)
    ├── pages/               # Page Objects (one per screen)
    ├── data/                # Existing users and products reused by the tests
    ├── factories/           # Test data generation with Faker
    ├── constants/           # Messages returned by the application
    ├── utils/               # Small helpers (date formatting)
    ├── commands.js          # Custom commands (setting up preconditions via the API)
    └── e2e.js
```

## Patterns and design decisions

- **Page Objects** (`support/pages`): each screen wraps its own selectors and actions. Tests describe _what_ happens; Page Objects define _how_. All of them extend `BasePage`.
- **Service Objects** (`support/api`): each API resource (`/usuarios`, `/login`, `/produtos`) has a class that extends `BaseService`, which holds the base URL, headers and status code handling in one place.
- **Factories** (`support/factories`): test data is generated with `@faker-js/faker` on every run. Tests don't depend on fixed data and don't collide with other users of the public, shared ServeRest environment (duplicate e-mails or product names).
- **Existing test data** (`support/data`): users and products that already exist in ServeRest. Scenarios such as login reuse them instead of creating new data. Tests never delete this data, and a test that changes it (such as editing a product) restores the original values in `afterEach`.
- **Preconditions through the API**: users that a test needs are created through the API (`cy.createUserViaApi`), which keeps the tests fast and less brittle. Logging in on the frontend is always done through the login page, as a real user would.
- **Isolation and cleanup**: tests that need new data create it themselves and delete it in `afterEach`, so tests can run alone and in any order.
- **Stable selectors**: `data-testid` attributes are used wherever the application provides them. Alerts, headings and the product list don't have them (see [Technical questions](#product-list-has-no-data-testid-attributes)).
- **Behavior-focused assertions**: frontend tests check the UI (message, route, table content) and also the intercepted request and response with `cy.intercept`. There are no fixed `cy.wait(<ms>)` calls.
- **Centralized messages** (`support/constants/messages.js`), so assertions don't scatter magic strings.
- **Language**: the code is written in English. The only Portuguese text is what belongs to the application under test: the messages it returns, API field names (`nome`, `preco`, ...), routes and `data-testid` values.

## Technical questions

### Required password message on the login page

The password field is the only field on the login page that doesn't follow the same naming pattern as the others:

| Field    | `data-testid` | Placeholder        | `name`     | Message shown            |
| -------- | ------------- | ------------------ | ---------- | ------------------------ |
| Email    | `email`       | `Digite seu email` | `email`    | `Email é obrigatório`    |
| Password | `senha`       | `Digite sua senha` | `password` | `Password é obrigatório` |

The required message is built from the field's `name` attribute, so the password message says "Password" while the rest of the field says "senha".

**Decision:** the tests assert the message the application shows today, `Password é obrigatório` (`MESSAGES.PASSWORD_REQUIRED`), matching the field's `name`.

**Open question:** the expected message may be `Senha é obrigatória` instead. This needs to be confirmed with the product team. If it is confirmed, the current behavior is a bug, and only `MESSAGES.PASSWORD_REQUIRED` in `support/constants/messages.js` needs to change.

### Product list has no `data-testid` attributes

The product list table (`/admin/listarprodutos`) has no `data-testid` attributes on its rows, cells or "Editar"/"Excluir" buttons, unlike the forms in the application.

**Decision:** `ProductListPage` finds a row by the product name and a cell by the text of its column header (`PRODUCT_COLUMNS`: "Nome", "Preço", "Descrição", "Quantidade", "Imagem"), instead of a fixed column position. The tests stay readable and keep working if the column order changes.

**Recommendation:** good practice would be to add `data-testid` attributes to the rows, cells and action buttons (for example `data-testid="product-row"` and `data-testid="edit-product"`). The selectors would then no longer depend on the text shown in the table.

### `429 Too Many Requests` is not automated

The Swagger documents `429` for every endpoint. Triggering it means flooding the API with requests until the rate limit is reached.

**Decision:** not automated. ServeRest is a free, public environment shared by other people, and a test that floods it would affect everyone using it. This status code should be tested in a dedicated environment, where the rate limit can be lowered or the test can't affect other users.

### Preconditions that need a cart

ServeRest doesn't allow deleting a user that has a cart (`DELETE /usuarios/{_id}`) or a product that is in a cart (`DELETE /produtos/{_id}`). To cover these `400` responses, the tests create a cart through `CartsService` as a precondition. In `afterEach`, the cart is cancelled first, so the product and user created for the test can then be deleted.

## Known bugs

### "Editar" button on the product list does nothing

**Where:** `/admin/listarprodutos`, "Editar" button on each product row.

**Steps to reproduce:**

1. Log in as an admin.
2. Open the product list ("Listar Produtos").
3. Click "Editar" on any product.

**Expected:** a form opens with the product data, so the admin can change it and save.

**Actual:** nothing happens. The button has no click handler in the frontend code, there is no edit route, and the frontend never calls `PUT /produtos/{id}` (the API itself supports editing). The same happens with the "Editar" button on the user list.

**Test:** `frontend/edit-product.cy.js` covers this flow and fails on purpose until the bug is fixed. It fails right after clicking "Editar", with the message `edit page should open after clicking "Editar"`, because the page stays on the product list. Everything before that step (login, finding the product in the list) works.

Since the edit page doesn't exist yet, `EditProductPage` assumes it will reuse the `data-testid` attributes of the create product form. Good practice would be for the new page to expose its own `data-testid` attributes for its fields and save button, so these selectors can be confirmed once the page exists.

### API never returns `415 Unsupported Media Type`

**Where:** the Swagger documents `415` for `POST /login`, `POST /usuarios`, `POST /produtos` and `PUT` on users and products. The tests check the three `POST` endpoints.

**Steps to reproduce:**

```bash
curl -i -X POST https://serverest.dev/login \
  -H "Content-Type: text/plain" \
  -d "email=fulano@qa.com&password=teste"
```

**Expected:** `415 Unsupported Media Type`, as documented in the Swagger.

**Actual:** `400 Bad Request` with the required field messages (`email é obrigatório`, `password é obrigatório`). The API ignores the body instead of rejecting its type. The same happens with `application/xml`, `text/html`, `application/octet-stream`, `multipart/form-data` and `image/png`.

**Test:** the `415` tests in `api/login.cy.js`, `api/users.cy.js` and `api/products.cy.js` fail on purpose with `expected 400 to equal 415` until the API returns the documented status code (or the Swagger is corrected).

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

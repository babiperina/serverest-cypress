/**
 * Users that already exist in the ServeRest environment.
 *
 * Use them in scenarios that only read data (such as login), so the test doesn't
 * need to create a user first. Never update or delete these users in a test.
 * Field names follow the ServeRest API contract, so they can be passed directly
 * to the page objects and API services.
 */
export const USERS = Object.freeze({
  admin: Object.freeze({
    nome: "barbara",
    email: "bperinaadmin@uorak.com",
    password: "123456",
    administrador: "true",
  }),
});

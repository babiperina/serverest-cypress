import { faker } from "@faker-js/faker";

/**
 * Builds an ID in the format ServeRest accepts (16 alphanumeric characters)
 * that doesn't belong to any record.
 */
export const buildNonExistentId = () => faker.string.alphanumeric(16);

/**
 * Builds a body larger than the size the API accepts, to trigger 413 Payload Too Large.
 */
export const buildOversizedBody = () => ({ data: "x".repeat(1024 * 1024) });

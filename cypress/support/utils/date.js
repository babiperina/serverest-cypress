/**
 * Formats a date as dd/mm/yyyy, the format used by the application.
 */
export const formatDate = (date = new Date()) => date.toLocaleDateString("pt-BR");

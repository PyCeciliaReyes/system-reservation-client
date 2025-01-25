const username = import.meta.env.VITE_USERNAME;
const password = import.meta.env.VITE_PASSWORD;

export const API_URL = import.meta.env.VITE_URL;

// Función para obtener el encabezado con Basic Auth
export const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Basic ${btoa(`${username}:${password}`)}`,
});
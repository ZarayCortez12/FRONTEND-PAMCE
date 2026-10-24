// URL del backend. En producción se define VITE_API_URL al construir
// (ver .env.example y el Dockerfile); en desarrollo usa el backend local.
export const base_url = import.meta.env.VITE_API_URL || "http://localhost:4000";

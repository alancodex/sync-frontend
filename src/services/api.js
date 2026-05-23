// src/services/api.js
import axios from "axios";

// ATUALIZADO: Trocado -4ylo por -tvnd para bater no servidor certo
const BASE_URL = process.env.REACT_APP_API_URL || "https://sync-backend-tvnd.onrender.com/api";
// const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Interceptor de erros global
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ||
      err.message ||
      "Erro de comunicação com o servidor";
    return Promise.reject(new Error(message));
  }
);

// ─── Endpoints ───────────────────────────────────────────────────────────────

export const fetchHealth = () => api.get("/health").then((r) => r.data);

export const fetchStatus = () => api.get("/status").then((r) => r.data);

export const fetchStats = () => api.get("/stats").then((r) => r.data);

export const fetchLoja = (grupoLoja) =>
  api.get(`/loja/${grupoLoja}`).then((r) => r.data);

export const fetchCharts = (grupoLoja = null) =>
  api
    .get("/charts", { params: grupoLoja ? { grupo_loja: grupoLoja } : {} })
    .then((r) => r.data);

export default api;

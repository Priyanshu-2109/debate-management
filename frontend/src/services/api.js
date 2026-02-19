import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach admin JWT token if available
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("adminToken");
  if (
    (adminToken && config.url?.startsWith("/admin")) ||
    config.url?.startsWith("/topics") ||
    config.url?.startsWith("/debates")
  ) {
    // Only set if not already set (e.g., Clerk header)
    if (!config.headers["x-clerk-user-id"]) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  }
  return config;
});

export default api;

// ─── Admin API ──────────────────────────────────────────────
export const adminApi = {
  login: (data) => api.post("/admin/login", data),
  getStats: () =>
    api.get("/admin/stats", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    }),
  getUsers: () =>
    api.get("/admin/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    }),
};

// ─── Topic API ──────────────────────────────────────────────
export const topicApi = {
  create: (data) =>
    api.post("/topics", data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    }),
  getAll: () =>
    api.get("/topics", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    }),
  delete: (id) =>
    api.delete(`/topics/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    }),
};

// ─── Debate API ─────────────────────────────────────────────
export const debateApi = {
  getAll: () => api.get("/debates"),
  getById: (id) => api.get(`/debates/${id}`),
  create: (data) =>
    api.post("/debates", data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    }),
  update: (id, data) =>
    api.patch(`/debates/${id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    }),
  reveal: (id) =>
    api.patch(
      `/debates/reveal/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      },
    ),
  delete: (id) =>
    api.delete(`/debates/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    }),
  join: (debateId, clerkUserId) =>
    api.post(
      "/debates/join",
      { debateId },
      { headers: { "x-clerk-user-id": clerkUserId } },
    ),
  leave: (debateId, clerkUserId) =>
    api.post(
      "/debates/leave",
      { debateId },
      { headers: { "x-clerk-user-id": clerkUserId } },
    ),
};

// ─── User API ───────────────────────────────────────────────
export const userApi = {
  sync: (data) => api.post("/users/sync", data),
  getProfile: (clerkUserId) =>
    api.get("/users/me", { headers: { "x-clerk-user-id": clerkUserId } }),
};

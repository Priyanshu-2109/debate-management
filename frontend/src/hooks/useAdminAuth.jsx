import { createContext, useContext, useState, useEffect } from "react";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("adminToken"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminInfo");
    if (token && storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
    setLoading(false);
  }, [token]);

  const login = (tokenValue, adminInfo) => {
    localStorage.setItem("adminToken", tokenValue);
    localStorage.setItem("adminInfo", JSON.stringify(adminInfo));
    setToken(tokenValue);
    setAdmin(adminInfo);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    setToken(null);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{ admin, token, loading, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context)
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return context;
}

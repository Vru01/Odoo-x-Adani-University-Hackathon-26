import React, { createContext, useEffect, useState } from "react";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Load auth data safely on app start
  useEffect(() => { 
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
      }

      if (storedToken && storedToken !== "undefined") {
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Corrupted localStorage. Clearing auth data.");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, []);

  // ✅ Login
  const login = (userData, token) => {
    setUser(userData);
    setToken(token);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  // ✅ Logout
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, loading, setLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

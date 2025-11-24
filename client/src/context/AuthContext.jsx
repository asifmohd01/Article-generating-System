import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("healthy_gut_user");
    if (data) {
      const parsed = JSON.parse(data);
      setUser(parsed.user);
      setToken(parsed.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${parsed.token}`;
    }
  }, []);

  const save = (user, token) => {
    setUser(user);
    setToken(token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("healthy_gut_user", JSON.stringify({ user, token }));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("healthy_gut_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, save, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

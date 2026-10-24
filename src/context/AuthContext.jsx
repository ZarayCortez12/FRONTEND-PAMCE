// src/context/AuthContext.jsx
import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [usuario, setUsuario] = useState(null);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, usuario, setUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

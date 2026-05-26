import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (data) => {
    setUserData(data);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUserData(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ userData, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
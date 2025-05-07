import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("access_token");
      const currentId = localStorage.getItem("user_id");

      if (token) {
        setAuthToken(token);
      }

      if (currentId) {
        setUserId(currentId);
      }
    } catch (error) {
      console.error("Error retrieving from localStorage:", error);
    }
  }, []);

  const login = (token, userId) => {
    try {
      setAuthToken(token);
      setUserId(userId);
      localStorage.setItem("access_token", token);
      localStorage.setItem("user_id", userId);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const logout = () => {
    try {
      setAuthToken(null);
      setUserId(null);
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_id");
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ authToken, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

import axios from "axios";
import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setUser(null);
  };
  const fetchUser = async () => {
    if (!token) return;

    try {
      const res = await axiosInstance("/auth");

      if (!res) throw new Error("Failed to fetch user");

      setUser(res);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    fetchUser();
  }, [token]);

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, logout }}>
      {children}
    </UserContext.Provider>
  );
};

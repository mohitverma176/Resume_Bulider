import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosinstance.js";
import { API_PATHS } from "../utils/apipath.js";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user details on app load
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user profile:", error?.response?.data?.message || error.message);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Login handler
  const login = (userData, token) => {
    if (token) {
      localStorage.setItem("token", token);
    }
    setUser(userData);
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Update user state handler
  const updateUser = (updatedData) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : updatedData));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        isAuthenticated: !!user,
        login,
        logout,
        clearuser: logout,
        updateUser,
        fetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for consuming user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Aliases for compatibility
export const Usercontext = UserContext;
export const userProvider = UserProvider;

export default UserContext;
"use client";
import api from "@/api/axios";
import React, { createContext, useContext, useState, useEffect } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  email: string | null;
  setEmail: (value: string) => void;
  userId: string | null;
  setUserId: (value: string) => void;
  authToken?: string;
  setAuthToken?: (value: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    const token = localStorage.getItem("authTokenSkillCred");
    if (token) {
      setIsAuthenticated(true);
      setAuthToken(token);

      const response = api
        .post(
          "/api/auth/verify",
          {},
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then((res) => {
          if (res.data.userData) {
            setEmail(res.data.user_data.email);
            setUserId(res.data.user_data.user_id);
          }
        });
    } else {
      setIsAuthenticated(false);
    }
  }, []);
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        email,
        setEmail,
        userId,
        setUserId,
        authToken,
        setAuthToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;

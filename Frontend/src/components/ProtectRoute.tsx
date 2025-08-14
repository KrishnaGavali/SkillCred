"use client";
import api from "@/api/axios";
import { useAuth } from "@/context/authContext";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

const ProtectRoute = ({ children }: { children: React.ReactNode }) => {
  const { setIsAuthenticated, setEmail, setUserId } = useAuth();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await api.post("/auth/verify");
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
        console.log("User is authenticated :", response);

        setEmail(response.data.email);
        setUserId(response.data.user_id);
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
        redirect("/login");
      }
    };

    verifyAuth();
  }, []);

  return <>{children}</>;
};

export default ProtectRoute;

"use client";

import React, { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/api/axios";
import { useAuth } from "@/context/authContext";

type Message = {
  type: "processing" | "error" | "success";
  text: string;
  icon?: LucideIcon;
};

const GithubCallback: React.FC = () => {
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();

  const [message, setMessage] = useState<Message>({
    type: "processing",
    text: "Processing your request...",
  });

  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const authenticateWithGithub = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const error = urlParams.get("error");

      if (error) {
        const errorDescription =
          urlParams.get("error_description") || "Unknown error";
        setMessage({
          type: "error",
          text: `GitHub authentication failed: ${errorDescription}`,
          icon: X,
        });
        console.error("GitHub OAuth error:", error);
        return;
      }

      if (!code) {
        setMessage({
          type: "error",
          text: "GitHub code not found in URL.",
          icon: X,
        });
        console.error("No code found in the URL.");
        return;
      }

      setMessage({
        type: "processing",
        text: "Exchanging code and fetching profile...",
      });

      try {
        const res = await api.post(
          `/auth/github/set-token?token=${encodeURIComponent(code)}`
        );

        if (res.status === 200) {
          const userId: string | undefined =
            res.data?.user_data?.user_id || res.data?.user_data?.userId;

          if (!userId) {
            console.warn("user_id missing in response", res.data);
          }

          setIsAuthenticated(true);
          setMessage({
            type: "success",
            text: "GitHub authentication successful! Redirecting shortly...",
            icon: Check,
          });

          // Start countdown
          let counter = 5;
          setCountdown(counter);
          const interval = setInterval(() => {
            counter -= 1;
            setCountdown(counter);
            if (counter <= 0) {
              clearInterval(interval);
              if (userId) {
                router.push(`/applicant/${userId}/complete-profile`);
              }
            }
          }, 1000);
        } else {
          setMessage({
            type: "error",
            text: "GitHub authentication failed.",
            icon: X,
          });
          console.error("Unexpected backend response:", res.status, res.data);
        }
      } catch (err: any) {
        console.error("Error during GitHub token exchange:", err);
        const msg =
          err?.response?.data?.detail?.message ||
          err?.response?.data?.detail ||
          "Something went wrong during GitHub authentication.";

        setMessage({
          type: "error",
          text: msg,
          icon: X,
        });
      }
    };

    authenticateWithGithub();
  }, [setIsAuthenticated, router]);

  const colorClass =
    message.type === "error"
      ? "text-red-500"
      : message.type === "processing"
      ? "text-gray-500"
      : "text-green-500";

  return (
    <div className="h-96 w-full flex flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-4">
        {message.type === "processing" ? (
          <div
            className="h-8 w-8 border-4 border-t-transparent border-gray-300 rounded-full animate-spin"
            aria-label="Loading spinner"
          />
        ) : (
          message.icon && (
            <message.icon
              className={`h-8 w-8 ${colorClass}`}
              aria-label={message.type}
            />
          )
        )}

        <p className={`text-lg font-medium ${colorClass}`}>{message.text}</p>
      </div>

      {message.type === "success" && (
        <p className="text-sm text-gray-400">
          Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}...
        </p>
      )}

      {message.type === "error" && (
        <div className="mt-2 text-center max-w-md">
          <p className="text-sm">If this keeps happening, contact support.</p>
        </div>
      )}
    </div>
  );
};

export default GithubCallback;

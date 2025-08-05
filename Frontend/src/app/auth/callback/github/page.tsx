"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Message = {
  type: "processing" | "error" | "success";
  text: string;
  icon?: LucideIcon;
};

const GithubCallback = () => {
  const [message, setMessage] = useState<Message>({
    type: "processing",
    text: "Processing your request...",
  });

  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
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

    if (code) {
      console.log("GitHub OAuth code received:", code);
      // TODO: Send `code` to backend to complete OAuth flow
      setMessage({
        type: "processing",
        text: "Received code. Redirecting...",
      });
    } else {
      console.error("No code found in the URL.");
      setMessage({
        type: "error",
        text: "GitHub code not found in URL.",
        icon: X,
      });
    }
  }, []);

  return (
    <div className="h-96 w-full flex items-center justify-center">
      <div className="flex items-center gap-4">
        {message.type === "processing" ? (
          <div
            className="h-8 w-8 border-4 border-t-transparent border-white rounded-full animate-spin"
            aria-label="Loading spinner"
          />
        ) : (
          message.icon && <message.icon className="h-8 w-8 text-red-500" />
        )}

        <p
          className={`text-lg font-medium ${
            message.type === "error"
              ? "text-red-500"
              : message.type === "processing"
              ? "text-gray-500"
              : "text-green-500"
          }`}
        >
          {message.text}
        </p>
      </div>
    </div>
  );
};

export default GithubCallback;

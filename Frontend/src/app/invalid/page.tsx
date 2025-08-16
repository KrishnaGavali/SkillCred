"use client";
import React from "react";
import { redirect } from "next/navigation";

const InvalidTokenPage = () => {
  const handleLogin = () => {
    redirect("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center bg-background text-center h-72">
      <h1 className="text-4xl font-bold text-red-600">
        Invalid or Expired Token
      </h1>
      <p className="mt-4 text-lg text-gray-700">
        Your session has expired or the token is invalid. Please log in again to
        continue.
      </p>
      <button
        onClick={handleLogin}
        className="mt-6 px-6 py-2 text-background bg-foreground rounded hover:bg-foreground/75"
      >
        Login Again
      </button>
    </div>
  );
};

export default InvalidTokenPage;

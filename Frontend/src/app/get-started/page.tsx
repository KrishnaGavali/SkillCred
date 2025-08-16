"use client";

import ThemeChanger from "@/components/ThemeChanger";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";
import api from "@/api/axios";
import SignUpGithub from "@/components/GetStarted/SignUpGithub";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

enum MessageStatus {
  Loading = "loading",
  Success = "success",
  Error = "error",
  None = "none",
}

type Message = {
  status: MessageStatus;
  message: string | null;
};

interface SignupResponse {
  message: string;
  user_data: {
    email: string;
    user_id: string;
  };
}

const GetStartedPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<Message>({
    status: MessageStatus.None,
    message: null,
  });

  const { setIsAuthenticated, setEmail: setAuthEmail, setUserId } = useAuth();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ status: MessageStatus.Loading, message: "Signing up..." });

    try {
      const response = await api.post<SignupResponse>("/auth/signup", {
        email: email.trim(),
        password,
      });

      setMessage({
        status: MessageStatus.Success,
        message: response.data.message || "Signup successful!",
      });

      // Set authentication context
      setIsAuthenticated(true);
      setAuthEmail(response.data.user_data.email);
      setUserId(response.data.user_data.user_id);

      setTimeout(() => {
        router.push(
          `/applicant/${response.data.user_data.user_id}/complete-profile`
        );
      }, 2000);
    } catch (err: unknown) {
      let errorMsg = "An error occurred";
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        (err as any).response?.data?.detail?.message
      ) {
        errorMsg = (err as any).response.data.detail.message;
      }
      setMessage({
        status: MessageStatus.Error,
        message: errorMsg,
      });
    }
  };

  // Toast auto-hide logic
  useEffect(() => {
    if (message.status === MessageStatus.None) return;
    const timer = setTimeout(() => {
      setMessage({ status: MessageStatus.None, message: null });
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <>
      {/* Header */}
      <div className="w-full h-12 border border-border-color sticky top-0 bg-background flex items-center justify-between px-6">
        <Link href="/" className="text-2xl font-extrabold text-primary">
          SkillCred
        </Link>
        <ThemeChanger />
      </div>

      {/* Main Section */}
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between w-full bg-background border-x border-b border-border-color md:h-[calc(100vh-110px)] gap-y-5 pt-5 md:pt-0">
        {/* Left Text */}
        <div className="md:flex flex-col justify-center items-start w-full md:w-fit h-full px-8 space-y-6">
          <h1 className="text-5xl font-extrabold text-black dark:text-white">
            Get Started
          </h1>
          <p className="text-lg text-muted-foreground max-w-md">
            Join SkillCred — build your profile, beat the competition, rise in
            the leaderboard, and get referred to top companies.
          </p>
          <p className="text-sm text-muted-foreground">
            🚀 Already helping 50+ students improve their profiles.
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-border-color md:w-px md:h-full" />

        {/* Signup Form */}
        <div className="flex flex-col justify-center items-start w-full md:w-1/2 px-4 sm:px-8 py-8 space-y-6 mx-auto">
          <h2 className="text-3xl font-bold text-black dark:text-white">
            Sign Up to SkillCred
          </h2>

          <form onSubmit={handleSignup} className="w-full space-y-4">
            {/* Toast */}
            <AnimatePresence>
              {message.status !== MessageStatus.None && (
                <motion.div
                  key="toast"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.3 }}
                  className="fixed bottom-3 right-1.5 md:right-5 bg-background p-2 rounded-lg text-black dark:text-white flex items-center gap-x-2 w-fit border border-border-color shadow-lg"
                >
                  {message.status === MessageStatus.Loading ? (
                    <>
                      <div
                        className="h-5 w-5 border-4 border-t-transparent border-gray-700 rounded-full animate-spin"
                        aria-label="Loading spinner"
                      />
                      <p className="text-black dark:text-white">
                        {message.message}
                      </p>
                    </>
                  ) : message.status === MessageStatus.Success ? (
                    <>
                      <Check className="h-5 w-5 text-green-500" />
                      <p className="text-green-500">{message.message}</p>
                    </>
                  ) : (
                    <>
                      <X className="h-5 w-5 text-red-500" />
                      <p className="text-red-500">{message.message}</p>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Input */}
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 border border-border-color rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-2 border border-border-color rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-6 bg-foreground text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300"
            >
              Sign Up
            </button>
          </form>

          <SignUpGithub />

          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Login Here
            </Link>
          </p>
        </div>
      </section>
    </>
  );
};

export default GetStartedPage;

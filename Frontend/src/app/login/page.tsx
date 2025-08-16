"use client";
import ThemeChanger from "@/components/ThemeChanger";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Github, Check, X } from "lucide-react";
import api from "@/api/axios";
import { AnimatePresence, motion } from "motion/react";
import { redirect } from "next/navigation";
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

const LoginPage = () => {
  const [emailText, setEmailText] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<Message>({
    status: MessageStatus.None,
    message: null,
  });
  const { setIsAuthenticated, setEmail, setUserId, setAuthToken } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent reload first

    setMessage({
      status: MessageStatus.Loading,
      message: "Please wait...",
    });

    try {
      console.log("Logging in with:", { email: emailText, password });

      const response = await api.post("/auth/login", {
        email: emailText.trim(),
        password: password,
      });

      console.log(response.data);

      setMessage({
        status: MessageStatus.Success,
        message: "Login successful!",
      });

      setIsAuthenticated(true);
      setEmail(response.data.email);
      setUserId(response.data.user_id);
      setAuthToken?.(response.data.auth_token);

      localStorage.setItem("authTokenSkillCred", response.data.auth_token);

      const timeout = setTimeout(() => {
        redirect(`/applicant/${response.data.user_id}/complete-profile`);
      }, 2000);

      return () => clearTimeout(timeout); // cleanup on unmount or re-run

      // TODO: Handle navigation or token storage
    } catch (err: unknown) {
      console.error(err);

      let errorMsg = "An error occurred";

      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        (err as any).response?.data?.detail
      ) {
        errorMsg =
          (err as any).response.data.detail.message || "An error occurred";
      }

      setMessage({
        status: MessageStatus.Error,
        message: errorMsg,
      });
    }
  };

  const handleGithubLogin = () => {
    // TODO: Implement GitHub OAuth login
    console.log("Login with GitHub");
  };

  // Toast auto-hide logic
  useEffect(() => {
    if (message.status === MessageStatus.None) return;

    const timer = setTimeout(() => {
      setMessage({
        status: MessageStatus.None,
        message: null,
      });
    }, 3000);

    return () => clearTimeout(timer); // cleanup on re-run or unmount
  }, [message]);

  return (
    <>
      <div className="w-full h-12 border border-border-color sticky top-0 bg-background flex items-center justify-between px-6">
        <Link href="/" className="text-2xl font-extrabold text-primary">
          SkillCred
        </Link>
        <ThemeChanger />
      </div>
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between w-full bg-background border-x border-b border-border-color md:h-[calc(100vh-110px)] gap-y-5 pt-5 md:pt-0">
        <div className="md:flex flex-col justify-center items-start w-full md:w-fit h-full px-8 space-y-6">
          <h1 className="text-5xl font-extrabold text-black dark:text-white">
            Welcome Back
          </h1>
          <p className="text-lg text-muted-foreground max-w-md">
            Log in to SkillCred — track your growth, climb the leaderboard, and
            unlock real opportunities.
          </p>
          <p className="text-sm text-muted-foreground">
            🚀 Already helping 50+ students improve their profiles.
          </p>
        </div>
        <div className="w-full h-px bg-border-color md:w-px md:h-full" />

        {/* Login Form */}
        <div className="flex flex-col justify-center items-start w-full md:w-1/2 px-4 sm:px-8 py-8 space-y-6 mx-auto">
          <h2 className="text-3xl font-bold text-black dark:text-white">
            Login to SkillCred
          </h2>

          <form onSubmit={handleLogin} className="w-full space-y-4">
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
                value={emailText}
                required
                onChange={(e) => setEmailText(e.target.value)}
                className="px-4 py-2 border border-border-color rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

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

            <button
              type="submit"
              className="w-full py-3 px-6 bg-foreground text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300"
            >
              Log In
            </button>
          </form>

          <div className="w-full flex items-center justify-center">
            <button
              onClick={handleGithubLogin}
              className="flex items-center justify-center w-full py-3 px-6 border border-border-color rounded-lg bg-background text-foreground hover:bg-primary/10 transition-all duration-300"
            >
              <Github className="w-5 h-5 mr-2" />
              Login with GitHub
            </button>
          </div>

          <p className="text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <a
              href="/get-started"
              className="text-primary font-medium hover:underline"
            >
              Get started
            </a>
          </p>
        </div>
      </section>

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
                <p className="text-black">{message.message}</p>
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
    </>
  );
};

export default LoginPage;

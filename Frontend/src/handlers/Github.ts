// app/actions/redirectToGithub.ts
"use server";

import { redirect } from "next/navigation";

export const handleGithubSignIn = async () => {
  const githubAuthUrl = process.env.GITHUB_AUTH_URL;
  if (!githubAuthUrl) throw new Error("GitHub URL missing");
  redirect(githubAuthUrl);
};

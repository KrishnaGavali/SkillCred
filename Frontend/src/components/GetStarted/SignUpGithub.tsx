import { handleGithubSignIn } from "@/handlers/Github";
import { Github } from "lucide-react";
import React from "react";

const SignUpGithub = () => {
  return (
    <div className="w-full flex items-center justify-center">
      <form
        action={() => {
          handleGithubSignIn();
        }}
        className="w-full"
      >
        <button
          className="flex items-center justify-center w-full py-3 px-6 border border-border-color rounded-lg bg-background text-foreground hover:bg-primary/10 transition-all duration-300"
          type="submit"
        >
          <Github className="w-5 h-5 mr-2" />
          SignUp with GitHub
        </button>
      </form>
    </div>
  );
};

export default SignUpGithub;

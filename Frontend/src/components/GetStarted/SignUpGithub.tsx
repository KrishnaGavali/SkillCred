import { Github } from "lucide-react";
import React from "react";

const SignUpGithub = () => {
  const handleGithubSignUp = () => {
    console.log("GitHub sign up clicked - Implementation pending");
    // TODO: Implement your custom GitHub authentication logic here
  };

  return (
    <div className="w-full flex items-center justify-center">
      <button
        onClick={handleGithubSignUp}
        className="flex items-center justify-center w-full py-3 px-6 border border-border-color rounded-lg bg-background text-foreground hover:bg-primary/10 transition-all duration-300"
      >
        <Github className="w-5 h-5 mr-2" />
        SignUp with GitHub
      </button>
    </div>
  );
};

export default SignUpGithub;

"use client";
import React from "react";
import { useTheme } from "../context/themToggle";
import { Moon, Sun } from "lucide-react";

const ThemeChanger = () => {
  const { theme, toggleTheme } = useTheme();

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <>
      <button
        onClick={toggleTheme}
        className="group p-2 rounded-lg bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition border border-border-color"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-amber-500 group-hover:rotate-12 group-hover:scale-110 transition-all" />
        ) : (
          <Moon className="w-5 h-5 text-blue-700 group-hover:-rotate-12 group-hover:scale-110 transition-all" />
        )}
      </button>
    </>
  );
};

export default ThemeChanger;

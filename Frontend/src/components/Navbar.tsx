"use client";

import React from "react";
import { Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "../../context/themToggle";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [selectedSection, setSelectedSection] = React.useState("applicants");

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <nav className="backdrop-blur-xl bg-background dark:bg-background border border-border-color p-2 flex items-center justify-between transition-all duration-500 ease-out w-[90%] sticky top-0 z-50">
      <div className="flex items-center">
        <span className="relative text-2xl font-bold tracking-tight">
          <span className="text-primary-500 dark:text-primary-400">
            SkillCred
          </span>
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="group relative p-3 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-300 ease-out hover:scale-105 border border-border-color"
          aria-label="Toggle theme"
        >
          <div className="relative w-5 h-5">
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-amber-500 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700 transition-all duration-300 group-hover:-rotate-12 group-hover:scale-110" />
            )}
          </div>
        </button>

        {/* Menu Icon */}
        <button
          className="group relative p-3 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-all duration-300 border border-border-color"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300 group-hover:scale-125 transition-transform duration-300" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

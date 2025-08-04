"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import ThemeChanger from "./ThemeChanger";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const hiddenRoutes = ["/login", "/get-started"];

  if (hiddenRoutes.includes(pathname)) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/45 backdrop-blur-md border border-border-color px-2.5 py-3 flex items-center justify-between w-[90%]">
      {/* Brand Logo */}
      <Link href="/" className="text-lg font-extrabold text-primary">
        SkillCred
        <span className="text-xs text-primary"> [Applicants]</span>
      </Link>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center gap-x-14 text-sm font-medium text-primary">
        <Link
          href="/how-it-works"
          className="relative group inline-block text-primary"
        >
          <span className="relative z-10">How it Works</span>
          <span
            className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"
            aria-hidden="true"
          />
        </Link>
        <Link
          href="/sample-report"
          className="relative group inline-block text-primary"
        >
          <span className="relative z-10">Sample Report</span>
          <span
            className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"
            aria-hidden="true"
          />
        </Link>
        <Link
          href="/pricing"
          className="relative group inline-block text-primary"
        >
          <span className="relative z-10">Pricing</span>
          <span
            className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full"
            aria-hidden="true"
          />
        </Link>
      </div>

      {/* Right Controls (Theme + Mobile Menu) */}
      <div className="flex items-center space-x-3 md:space-x-4">
        <ThemeChanger />
        <Link
          href="/login"
          className="px-4 py-2 border border-primary rounded-md hover:bg-primary hover:text-white dark:hover:text-primary-foreground transition duration-200 hidden md:inline-block text-primary font-medium"
        >
          Login
        </Link>

        {/* Mobile Menu Icon */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden group p-2 rounded-lg bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition border border-border-color"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5 text-primary-700 group-hover:scale-125 transition-transform" />
          ) : (
            <Menu className="w-5 h-5 text-primary-700 group-hover:scale-125 transition-transform" />
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isMobileMenuOpen && (
          <motion.div
            className="absolute top-full left-0 w-full bg-background dark:bg-background border-t border-border-color shadow-md md:hidden z-40 dark:shadow-gray-800"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className="flex flex-col divide-y divide-border-color text-sm font-medium text-primary">
              {/* Menu Links */}
              <Link
                href="/how-it-works"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-6 py-4 w-full text-left hover:bg-accent transition-colors"
              >
                How it Works
              </Link>
              <Link
                href="/sample-report"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-6 py-4 w-full text-left hover:bg-accent transition-colors"
              >
                Sample Report
              </Link>
              <Link
                href="/pricing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-6 py-4 w-full text-left hover:bg-accent transition-colors"
              >
                Pricing
              </Link>

              {/* Login Button */}
              <div className="px-6 py-4 border-b border-border-color">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center border border-primary rounded-md px-4 py-2 hover:bg-primary hover:text-white dark:hover:text-primary-foreground transition font-medium"
                >
                  Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

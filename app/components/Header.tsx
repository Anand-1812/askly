"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/Auth";
import slugify from "@/utils/slugify";
import { IconMenu2, IconX, IconMoon, IconSun } from "@tabler/icons-react";

export default function Header() {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const prefersDark = !!document.documentElement.classList.contains("dark");
    setIsDark(prefersDark);
  }, []);

  const toggleTheme = () => {
    const isDarkNow = document.documentElement.classList.contains("dark");
    if (isDarkNow) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-primary transition-opacity hover:opacity-80"
          >
            Askly
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/questions"
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              Questions
            </Link>
            {user ? (
              <>
                <Link
                  href="/questions/ask"
                  className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                >
                  Ask Question
                </Link>
                <Link
                  href={`/users/${user.$id}/${slugify(user.name)}`}
                  className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                >
                  Profile
                </Link>
              </>
            ) : (
              <Link
                href="/(auth)/login"
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-foreground"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <IconSun className="w-5 h-5" />
              ) : (
                <IconMoon className="w-5 h-5" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <IconX className="w-5 h-5" />
              ) : (
                <IconMenu2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden border-t border-border py-4 space-y-2">
            <Link
              href="/questions"
              className="block px-4 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:bg-muted transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Questions
            </Link>
            {user ? (
              <>
                <Link
                  href="/questions/ask"
                  className="block px-4 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Ask Question
                </Link>
                <Link
                  href={`/users/${user.$id}/${slugify(user.name)}`}
                  className="block px-4 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:bg-muted transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
              </>
            ) : (
              <Link
                href="/(auth)/login"
                className="block px-4 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:bg-muted transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

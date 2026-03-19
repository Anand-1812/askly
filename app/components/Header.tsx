"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { useAuthStore } from "@/store/Auth";
import slugify from "@/utils/slugify";
import {
  IconMenu2,
  IconX,
  IconMoon,
  IconSun,
  IconUser,
  IconStarFilled,
  IconLogout,
  IconChevronDown,
} from "@tabler/icons-react";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Questions", href: "/questions" },
  { name: "Ask", href: "/questions/ask" },
];

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [stars, setStars] = useState(() => {
    if (typeof window !== "undefined") {
      return parseInt(localStorage.getItem("askly-stars") || "0", 10);
    }
    return 0;
  });
  const [hasStarred, setHasStarred] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("askly-starred") === "true";
    }
    return false;
  });
  const [showStarAnimation, setShowStarAnimation] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const currentlyDark = document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", !currentlyDark);
    localStorage.setItem("theme", currentlyDark ? "light" : "dark");
    setIsDark(!currentlyDark);
  };

  const profileHref = user ? `/users/${user.$id}/${slugify(user.name)}` : "/login";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/82 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between gap-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-3 py-1.5 text-base font-semibold text-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-primary"
            >
              <span className="font-serif text-lg leading-none text-primary">A</span>
              <span className="text-sm tracking-wide">Askly</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1 rounded-full border border-border/70 bg-card/80 p-1.5 shadow-sm">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                if (!hasStarred) {
                  const newStars = stars + 1;
                  setStars(newStars);
                  setHasStarred(true);
                  localStorage.setItem("askly-stars", newStars.toString());
                  localStorage.setItem("askly-starred", "true");
                  setShowStarAnimation(true);
                  setTimeout(() => setShowStarAnimation(false), 600);
                }
              }}
              disabled={hasStarred}
              className={`group relative hidden lg:inline-flex h-10 items-center gap-1.5 overflow-hidden rounded-full border border-border bg-card/90 px-4 text-sm font-semibold transition-all ${
                hasStarred
                  ? "cursor-not-allowed opacity-60 text-muted-foreground"
                  : "text-foreground hover:-translate-y-0.5 hover:border-primary/45 hover:text-primary"
              }`}
              title={hasStarred ? "You've already starred!" : "Star this site"}
            >
              <span className="absolute -left-10 top-0 h-full w-8 -skew-x-12 bg-white/25 opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100" />
              {showStarAnimation && (
                <span className="absolute animate-bounce text-lg">⭐</span>
              )}
              <IconStarFilled className="h-4 w-4" />
              <span className="font-mono">{stars}</span>
            </button>

            <button
              onClick={toggleTheme}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/90 text-foreground transition-all hover:border-primary/35 hover:text-primary"
              aria-label="Toggle theme"
            >
              {isDark ? <IconSun className="h-4 w-4" /> : <IconMoon className="h-4 w-4" />}
            </button>

            {user ? (
              <>
                {/* User Menu Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-card/90 px-3.5 text-sm font-semibold text-foreground transition-all hover:border-primary/35 hover:text-primary"
                  >
                    <IconUser className="h-4 w-4" />
                    <span className="hidden sm:inline">Menu</span>
                    <IconChevronDown className={`h-4 w-4 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-card/95 shadow-lg backdrop-blur-sm">
                      <Link
                        href={profileHref}
                        className="block px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary/50 hover:text-primary rounded-t-xl"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                          <IconUser className="h-4 w-4" />
                          Profile
                        </div>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-3 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 text-left rounded-b-xl"
                      >
                        <div className="flex items-center gap-2">
                          <IconLogout className="h-4 w-4" />
                          Logout
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="inline-flex h-10 items-center rounded-full border border-border bg-card/90 px-4 text-sm font-semibold text-foreground transition-all hover:border-primary/35 hover:text-primary"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-95"
                >
                  Join
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/90 text-foreground transition-all hover:border-primary/35 hover:text-primary md:hidden"
              aria-label="Toggle menu"
            >
              {isOpen ? <IconX className="h-5 w-5" /> : <IconMenu2 className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <nav className="mb-3 rounded-2xl border border-border bg-card/95 p-3 shadow-lg md:hidden">
            <div className="space-y-2">
              {navItems.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-xl px-4 py-2.5 text-sm font-semibold text-center transition-all ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/70 text-foreground hover:bg-secondary"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <button
                onClick={() => {
                  if (!hasStarred) {
                    const newStars = stars + 1;
                    setStars(newStars);
                    setHasStarred(true);
                    localStorage.setItem("askly-stars", newStars.toString());
                    localStorage.setItem("askly-starred", "true");
                    setShowStarAnimation(true);
                    setTimeout(() => setShowStarAnimation(false), 600);
                  }
                }}
                disabled={hasStarred}
                className={`w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold transition-all ${
                  hasStarred
                    ? "cursor-not-allowed opacity-60 text-muted-foreground"
                    : "text-foreground hover:border-primary/30 hover:text-primary"
                }`}
                title={hasStarred ? "You've already starred!" : "Star this site"}
              >
                {showStarAnimation && <span className="animate-bounce text-lg">⭐</span>}
                <IconStarFilled className="h-4 w-4" />
                Stars ({stars})
              </button>
              {user ? (
                <>
                  <Link
                    href={profileHref}
                    className="block rounded-xl border border-border bg-card px-4 py-2.5 text-center text-sm font-semibold text-foreground hover:border-primary/30 hover:text-primary transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-center text-sm font-semibold text-destructive hover:border-destructive/35 hover:bg-destructive/10 transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block rounded-xl border border-border bg-card px-4 py-2.5 text-center text-sm font-semibold text-foreground hover:border-primary/30 hover:text-primary transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground hover:brightness-95 transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { useAuthStore } from "@/store/Auth";
import slugify from "@/utils/slugify";
import { cn } from "@/lib/utils";
import {
  IconMenu2,
  IconX,
  IconMoon,
  IconSun,
  IconUser,
  IconStarFilled,
  IconLogout,
  IconChevronDown,
  IconBolt,
} from "@tabler/icons-react";

const navItems = [
  { name: "Feed", href: "/" },
  { name: "Explore", href: "/questions" },
  { name: "Ask", href: "/questions/ask" },
];

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [stars, setStars] = useState(0);
  const [hasStarred, setHasStarred] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const savedStars = localStorage.getItem("askly-stars");
    if (savedStars) setStars(parseInt(savedStars, 10));
    setHasStarred(localStorage.getItem("askly-starred") === "true");
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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

  const handleStar = () => {
    if (!hasStarred) {
      const newStars = stars + 1;
      setStars(newStars);
      setHasStarred(true);
      localStorage.setItem("askly-stars", newStars.toString());
      localStorage.setItem("askly-starred", "true");
    }
  };

  const profileHref = user ? `/users/${user.$id}/${slugify(user.name)}` : "/login";

  return (
    <header className="fixed inset-x-0 top-0 z-50 py-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-14 items-center justify-between rounded-full border border-border/60 bg-background/70 px-4 shadow-sm backdrop-blur-xl transition-all">
          
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
                <IconBolt className="h-5 w-5" />
              </div>
              <span className="hidden font-mono text-sm font-bold tracking-tighter text-foreground sm:block">
                ASKLY<span className="text-primary">.dev</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 rounded-full border border-border/40 bg-muted/30 p-1">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-4 py-1.5 font-mono text-xs font-semibold transition-all",
                    active 
                      ? "bg-background text-primary shadow-sm ring-1 ring-border/20" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Star Counter */}
            <button
              onClick={handleStar}
              disabled={hasStarred}
              className={cn(
                "hidden items-center gap-1.5 rounded-full border border-border px-3 py-1.5 transition-all hover:bg-muted lg:flex",
                hasStarred ? "opacity-60" : "hover:border-primary/50"
              )}
            >
              <IconStarFilled className={cn("h-3.5 w-3.5", hasStarred ? "text-primary" : "text-muted-foreground")} />
              <span className="font-mono text-[10px] font-bold">{stars}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition-all hover:bg-muted"
              aria-label="Toggle theme"
            >
              {isDark ? <IconSun className="h-4 w-4 text-primary" /> : <IconMoon className="h-4 w-4 text-muted-foreground" />}
            </button>

            {/* Auth State */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex h-9 items-center gap-2 rounded-full border border-border bg-background px-3 transition-all hover:border-primary/50"
                >
                  <IconUser className="h-4 w-4 text-muted-foreground" />
                  <IconChevronDown className={cn("h-3 w-3 transition-transform", isUserMenuOpen && "rotate-180")} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-48 overflow-hidden rounded-2xl border border-border bg-popover shadow-lg">
                    <Link
                      href={profileHref}
                      className="flex items-center gap-2 px-4 py-3 font-mono text-xs font-semibold text-foreground hover:bg-muted"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <IconUser className="h-4 w-4" /> Profile
                    </Link>
                    <button
                      onClick={() => { logout(); setIsUserMenuOpen(false); }}
                      className="flex w-full items-center gap-2 px-4 py-3 font-mono text-xs font-semibold text-destructive hover:bg-destructive/10"
                    >
                      <IconLogout className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 font-mono text-xs font-bold text-muted-foreground hover:text-foreground"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-primary px-4 py-2 font-mono text-xs font-bold text-primary-foreground shadow-sm hover:brightness-110"
                >
                  Join
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background md:hidden"
            >
              {isOpen ? <IconX className="h-5 w-5" /> : <IconMenu2 className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <nav className="mt-3 space-y-2 rounded-2xl border border-border bg-background/90 p-3 backdrop-blur-lg md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl px-4 py-3 font-mono text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {item.name}
              </Link>
            ))}
            {!user && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link href="/login" className="rounded-xl border border-border py-2 text-center font-mono text-xs font-bold">Login</Link>
                <Link href="/register" className="rounded-xl bg-primary py-2 text-center font-mono text-xs font-bold text-primary-foreground">Join</Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

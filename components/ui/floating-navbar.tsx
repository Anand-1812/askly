"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuthStore } from "@/store/Auth";
import { IconSparkles } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}) => {
  const { scrollYProgress, scrollY } = useScroll();
  const { session, logout } = useAuthStore();
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (scrollY.get() === 0) {
      setVisible(true);
      return;
    }
    if (typeof current === "number") {
      const direction = current - scrollYProgress.getPrevious()!;
      if (scrollYProgress.get() < 0.05) {
        // Stay visible near the top of the page
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1, y: -100 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className={cn(
          "fixed inset-x-0 top-5 z-50 mx-auto flex max-w-[calc(100vw-1rem)] items-center justify-center gap-1 overflow-x-auto rounded-full border border-border/70 bg-background/85 px-2 py-1.5 shadow-lg backdrop-blur-xl",
          className,
        )}
      >
        {/* Brand */}
        <Link
          href="/"
          className="mr-2 flex shrink-0 items-center gap-1.5 rounded-full border border-transparent px-3 py-1.5 text-sm font-semibold tracking-tight text-foreground transition-all hover:border-border hover:bg-secondary"
        >
          <IconSparkles className="h-4 w-4 text-primary" />
          <span className="bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
            Askly
          </span>
        </Link>

        {/* Divider */}
        <div className="mr-1 h-4 w-px bg-border" />

        {/* Nav items */}
        {navItems.map((navItem, idx) => {
          const isActive =
            navItem.link === "/"
              ? pathname === "/"
              : pathname.startsWith(navItem.link);

          return (
            <Link
              key={`nav-${idx}`}
              href={navItem.link}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all duration-150",
                isActive
                  ? "bg-primary/14 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <span className={isActive ? "text-primary" : "opacity-70"}>
                {navItem.icon}
              </span>
              <span className="hidden sm:block">{navItem.name}</span>
            </Link>
          );
        })}

        {/* Auth buttons */}
        <div className="ml-1 flex shrink-0 items-center gap-1">
          {session ? (
            <button
              onClick={logout}
              className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground transition-all duration-150 hover:border-primary/50 hover:text-primary"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-all duration-150 hover:bg-secondary hover:text-foreground"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-150 hover:brightness-95"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

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
        transition={{ duration: 0.2 }}
        className={cn(
          "fixed inset-x-0 top-6 z-50 mx-auto flex max-w-fit items-center justify-center gap-1 rounded-full border border-white/10 bg-black/80 px-2 py-1.5 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl",
          className,
        )}
      >
        {/* Brand */}
        <Link
          href="/"
          className="mr-2 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold tracking-tight text-white transition-opacity hover:opacity-80"
        >
          <IconSparkles className="h-4 w-4 text-orange-500" />
          <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Askly
          </span>
        </Link>

        {/* Divider */}
        <div className="mr-1 h-4 w-px bg-white/10" />

        {/* Nav items */}
        {navItems.map((navItem, idx) => (
          <Link
            key={`nav-${idx}`}
            href={navItem.link}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-white/70 transition-all duration-150 hover:bg-white/8 hover:text-white"
          >
            <span className="opacity-70">{navItem.icon}</span>
            <span className="hidden sm:block">{navItem.name}</span>
          </Link>
        ))}

        {/* Auth buttons */}
        <div className="ml-1 flex items-center gap-1">
          {session ? (
            <button
              onClick={logout}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/80 transition-all duration-150 hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-1.5 text-sm font-medium text-white/70 transition-all duration-150 hover:bg-white/8 hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-orange-500 px-4 py-1.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(249,115,22,0.35)] transition-all duration-150 hover:bg-orange-400 hover:shadow-[0_0_24px_rgba(249,115,22,0.5)]"
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

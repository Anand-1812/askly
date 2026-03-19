"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import {
  IconLayoutDashboard,
  IconMessageCircle,
  IconQuestionMark,
  IconArrowUp,
} from "@tabler/icons-react";

const Navbar = () => {
  const { userId, userSlug } = useParams();
  const pathname = usePathname();

  const items = [
    {
      name: "Summary",
      href: `/users/${userId}/${userSlug}`,
      icon: <IconLayoutDashboard className="h-4 w-4" />,
    },
    {
      name: "Questions",
      href: `/users/${userId}/${userSlug}/questions`,
      icon: <IconQuestionMark className="h-4 w-4" />,
    },
    {
      name: "Answers",
      href: `/users/${userId}/${userSlug}/answers`,
      icon: <IconMessageCircle className="h-4 w-4" />,
    },
    {
      name: "Votes",
      href: `/users/${userId}/${userSlug}/votes`,
      icon: <IconArrowUp className="h-4 w-4" />,
    },
  ];

  return (
    <nav className="w-full shrink-0 sm:w-44">
      {/* Mobile: horizontal scrollable tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 sm:hidden">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-primary/15 text-primary shadow-[inset_0_0_0_1px_rgba(249,184,79,0.3)]"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <span className={isActive ? "text-primary" : "text-muted-foreground"}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Desktop: vertical nav */}
      <div className="hidden overflow-hidden rounded-xl border border-border bg-card/70 p-1.5 sm:block">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-primary/15 text-primary shadow-[inset_0_0_0_1px_rgba(249,184,79,0.28)]"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <span
                className={`transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
              >
                {item.icon}
              </span>
              {item.name}
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;

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
    <nav className="w-full shrink-0 sm:w-52">
      <div className="flex gap-2 overflow-x-auto pb-1 sm:hidden">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-background/75 text-muted-foreground"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="hidden rounded-2xl border border-border/80 bg-card/80 p-2 sm:block">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;

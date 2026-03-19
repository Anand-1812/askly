import React from "react";
import AnimatedGridPattern from "@/components/magicui/animated-grid-pattern";
import { cn } from "@/utils/cn";
import Link from "next/link";
import {
  IconSparkles,
  IconBrandGithub,
  IconBrandTwitter,
} from "@tabler/icons-react";

const Footer = () => {
  const links = [
    {
      heading: "Platform",
      items: [
        { title: "Home", href: "/" },
        { title: "Questions", href: "/questions" },
        { title: "Ask a Question", href: "/questions/ask" },
      ],
    },
    {
      heading: "Account",
      items: [
        { title: "Login", href: "/login" },
        { title: "Register", href: "/register" },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-white/[6%]">
      <div className="container relative z-10 mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-[1fr_auto_auto]">
          {/* Brand */}
          <div className="max-w-xs space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <IconSparkles className="h-5 w-5 text-orange-500" />
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-lg font-bold tracking-tight text-transparent">
                Askly
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/40">
              A place to ask questions, share knowledge, and grow together as
              developers.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 bg-white/[3%] text-white/40 transition-all duration-150 hover:border-white/15 hover:bg-white/[6%] hover:text-white/80"
              >
                <IconBrandGithub className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 bg-white/[3%] text-white/40 transition-all duration-150 hover:border-white/15 hover:bg-white/[6%] hover:text-white/80"
              >
                <IconBrandTwitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {links.map((group) => (
            <div key={group.heading} className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/30">
                {group.heading}
              </h3>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/50 transition-colors duration-150 hover:text-white/90"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/[6%] pt-8 sm:flex-row">
          <p className="text-xs text-white/25">
            &copy; {new Date().getFullYear()} Askly. All rights reserved.
          </p>
          <p className="text-xs text-white/20">
            Built with Next.js &amp; Appwrite
          </p>
        </div>
      </div>

      <AnimatedGridPattern
        numSquares={20}
        maxOpacity={0.25}
        duration={4}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(2400px_circle_at_center,white,transparent)]",
          "inset-y-[-30%] h-[160%] skew-y-6 opacity-60",
        )}
      />
    </footer>
  );
};

export default Footer;

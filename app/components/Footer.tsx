import React from "react";
import Link from "next/link";
import {
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
        { title: "Login", href: "/(auth)/login" },
        { title: "Register", href: "/(auth)/register" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-card/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="text-lg font-bold text-primary">
              Askly
            </Link>
            <p className="text-sm text-foreground/60 max-w-xs">
              A community platform for developers to ask questions, share knowledge, and grow together.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors text-foreground/70 hover:text-primary"
              >
                <IconBrandGithub className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors text-foreground/70 hover:text-primary"
              >
                <IconBrandTwitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {links.map((group) => (
            <div key={group.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/70 mb-4">
                {group.heading}
              </h3>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-foreground/60 hover:text-primary transition-colors"
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
        <div className="border-t border-border/50 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-foreground/50">
          <p>&copy; {new Date().getFullYear()} Askly. All rights reserved.</p>
          <p>Made with Next.js &amp; Appwrite</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

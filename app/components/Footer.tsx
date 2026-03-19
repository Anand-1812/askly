import Link from "next/link";
import { IconBrandGithub, IconBrandTwitter, IconMail } from "@tabler/icons-react";
import { GITHUB_REPO_URL, GITHUB_STAR_URL } from "@/lib/github";

const footerLinks = [
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
      { title: "Ask a Question", href: "/questions/ask" },
    ],
  },
  {
    heading: "Resources",
    items: [
      { title: "Top Contributors", href: "/" },
      { title: "Latest Questions", href: "/questions" },
      { title: "Community Guidelines", href: "/questions" },
    ],
  },
];

const socials = [
  { label: "GitHub", href: GITHUB_REPO_URL, icon: IconBrandGithub },
  { label: "Twitter", href: "https://twitter.com", icon: IconBrandTwitter },
  { label: "Email", href: "mailto:hello@askly.dev", icon: IconMail },
];

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-border/80 bg-card/70 backdrop-blur-sm">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div className="space-y-5">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-semibold">
              <span className="font-serif text-3xl text-primary">A</span>
              <span>Askly</span>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              A classic developer community where questions get answered clearly,
              ideas improve fast, and learning never stops.
            </p>

            <a
              href={GITHUB_STAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-full border border-primary/35 bg-primary/10 px-5 text-sm font-semibold text-primary transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
            >
              <span className="absolute -left-10 top-0 h-full w-8 -skew-x-12 bg-white/30 opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100" />
              <IconBrandGithub className="h-4 w-4" />
              Star this project on GitHub
            </a>

            <div className="flex items-center gap-2">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground transition-all hover:border-primary/45 hover:text-primary"
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerLinks.map((group) => (
              <div key={group.heading}>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-foreground/70">
                  {group.heading}
                </h3>
                <ul className="space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item.href + item.title}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border/80 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright {new Date().getFullYear()} Askly. All rights reserved.</p>
          <p>Built with Next.js and Appwrite for builders who ship.</p>
        </div>
      </div>
    </footer>
  );
}

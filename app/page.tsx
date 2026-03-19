import Link from "next/link";
import HeroSection from "./components/HeroSection";
import LatestQuestions from "./components/LatestQuestions";
import TopContributers from "./components/TopContributers";
import { GITHUB_REPO_URL } from "@/lib/github";
import {
  IconArrowRight,
  IconTrendingUp,
  IconUsers,
  IconMessageCircle,
  IconBrandGithub,
} from "@tabler/icons-react";

export default function Home() {
  return (
    <div className="page-shell">
      <HeroSection />

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/80 bg-card/75 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Focused Discussions
            </p>
            <p className="mt-2 text-sm text-foreground/80">
              Questions stay readable, searchable, and practical.
            </p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-card/75 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Fast Feedback
            </p>
            <p className="mt-2 text-sm text-foreground/80">
              Helpful answers from developers across stacks.
            </p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-card/75 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Built To Learn
            </p>
            <p className="mt-2 text-sm text-foreground/80">
              Improve your debugging, architecture, and code clarity.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              <IconTrendingUp className="h-3.5 w-3.5" />
              Latest
            </div>
            <h2 className="font-serif text-3xl font-semibold text-foreground">
              Recent Questions
            </h2>
          </div>
          <Link
            href="/questions"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:brightness-110"
          >
            Explore all
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <LatestQuestions />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-accent/35 bg-accent/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            <IconUsers className="h-3.5 w-3.5" />
            Community
          </div>
          <h2 className="font-serif text-3xl font-semibold text-foreground">
            Top Contributors
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Members sharing consistent, high quality help this week.
          </p>
        </div>

        <TopContributers />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 pt-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border/85 bg-card/75 p-8 text-center shadow-sm">
          <div className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
            <IconMessageCircle className="h-5 w-5" />
          </div>
          <h3 className="font-serif text-2xl font-semibold text-foreground">
            Have a question right now?
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Post it once with clear context and get practical help from real builders.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/questions/ask"
              className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-95"
            >
              Start a Question
            </Link>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-full border border-border bg-background/80 px-6 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
            >
              <span className="absolute -left-9 top-0 h-full w-7 -skew-x-12 bg-white/20 opacity-0 transition-all duration-700 group-hover:left-[110%] group-hover:opacity-100" />
              <IconBrandGithub className="h-4 w-4" />
              View on GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

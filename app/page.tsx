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
    <div className="page-shell space-y-16 pb-20">
      {/* 1. Hero Section: The main entry point for the community */}
      <HeroSection />

      {/* 2. Feature Highlights: Styled as a clean, interactive grid using existing CSS variables */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="group rounded-2xl border border-border/80 bg-card/60 p-6 shadow-sm transition-all hover:border-primary/40 hover:bg-card/80">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Focused Discussions
            </p>
            <h3 className="mt-3 font-serif text-xl font-medium text-foreground">Clarity First</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Questions stay readable, searchable, and strictly practical. No noise, just engineering depth.
            </p>
          </div>
          <div className="group rounded-2xl border border-border/80 bg-card/60 p-6 shadow-sm transition-all hover:border-accent/40 hover:bg-card/80">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Fast Feedback
            </p>
            <h3 className="mt-3 font-serif text-xl font-medium text-foreground">Active Experts</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Get helpful answers from developers across different stacks. Build and ship faster together.
            </p>
          </div>
          <div className="group rounded-2xl border border-border/80 bg-card/60 p-6 shadow-sm transition-all hover:border-primary/40 hover:bg-card/80">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Built To Learn
            </p>
            <h3 className="mt-3 font-serif text-xl font-medium text-foreground">Skill Evolution</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Improve your debugging, architectural thinking, and code clarity with every interaction.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Main Content: A split layout for better visual hierarchy */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Primary Question Feed */}
        <section className="lg:col-span-8">
          <div className="mb-8 flex items-end justify-between gap-4">
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

          <div className="space-y-4">
            <LatestQuestions />
          </div>
        </section>

        {/* Right Column: Community Sidebar */}
        <aside className="lg:col-span-4 space-y-10">
          <div className="rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur-sm">
            <div className="mb-6">
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-accent/35 bg-accent/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                <IconUsers className="h-3.5 w-3.5" />
                Community
              </div>
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                Top Contributors
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Members sharing high-quality help this week.
              </p>
            </div>

            <TopContributers />
          </div>

          {/* Secondary CTA Card */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 relative overflow-hidden">
             <h4 className="font-serif text-lg font-semibold text-foreground mb-2">Build Your Reputation</h4>
             <p className="text-xs text-muted-foreground mb-4">
               Earn rep points by answering community questions and helping others ship better code.
             </p>
             <Link href="/questions" className="text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all">
               Browse Open Issues <IconArrowRight className="h-4 w-4" />
             </Link>
          </div>
        </aside>
      </div>

      {/* 4. Final CTA: Centered conversion section */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/85 bg-card/80 p-10 md:p-16 text-center shadow-sm relative overflow-hidden">
          {/* Subtle decorative background element using existing variables */}
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
          
          <div className="mx-auto mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <IconMessageCircle className="h-6 w-6" />
          </div>
          <h3 className="font-serif text-3xl font-semibold text-foreground">
            Have a question right now?
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Post it once with clear context and get practical help from real builders who ship products daily.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/questions/ask"
              className="inline-flex h-12 items-center rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:translate-y-[-2px] hover:brightness-95"
            >
              Start a Question
            </Link>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-background/80 px-8 text-sm font-semibold text-foreground transition-all hover:border-primary/40 hover:text-primary"
            >
              <IconBrandGithub className="h-4 w-4" />
              View on GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

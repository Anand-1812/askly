import Link from "next/link";
import LatestQuestions from "./components/LatestQuestions";
import TopContributers from "./components/TopContributers";
import { GITHUB_REPO_URL, GITHUB_STAR_URL } from "@/lib/github";
import {
  IconArrowRight,
  IconTrendingUp,
  IconUsers,
  IconMessageCircle,
  IconBrandGithub,
  IconSparkles,
  IconBolt,
  IconCode,
  IconShieldCheck,
  IconSearch,
  IconRocket,
  IconStarFilled,
} from "@tabler/icons-react";

export default function Home() {
  return (
    <div className="page-shell pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient Orbs */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-32 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-500/[0.08] blur-[120px]" />
          <div className="absolute right-[10%] top-[15%] h-[400px] w-[400px] rounded-full bg-violet-500/[0.06] blur-[100px]" />
          <div className="absolute bottom-[20%] left-[15%] h-[350px] w-[350px] rounded-full bg-cyan-500/[0.05] blur-[90px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6 lg:px-8 lg:pt-40">
          <div className="text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/[0.08] px-4 py-1.5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400">
                Community-Powered Q&A Platform
              </span>
            </div>

            {/* Headline */}
            <h1 className="mx-auto max-w-4xl font-serif text-5xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Ask better questions.
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-violet-400 dark:to-cyan-400">
                Build better software.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Join thousands of developers who ask, answer, and level up together. Get practical help, share knowledge, and ship faster.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/questions/ask"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-8 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30 dark:from-blue-500 dark:to-violet-500"
              >
                <IconSparkles className="h-4 w-4" />
                Ask a Question
                <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/questions"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card/80 px-8 text-sm font-semibold text-foreground backdrop-blur-sm transition-all duration-200 hover:border-blue-500/40 hover:bg-card"
              >
                Browse Questions
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["bg-blue-500", "bg-violet-500", "bg-cyan-500", "bg-emerald-500"].map((color, i) => (
                    <div key={i} className={`flex h-8 w-8 items-center justify-center rounded-full ${color} text-xs font-bold text-white ring-2 ring-background`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-muted-foreground">
                  <span className="font-semibold text-foreground">5,000+</span> developers
                </span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1.5">
                <IconCode className="h-4 w-4 text-blue-500" />
                <span className="text-muted-foreground">
                  <span className="font-semibold text-foreground">10,000+</span> questions answered
                </span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1.5">
                <IconBolt className="h-4 w-4 text-violet-500" />
                <span className="text-muted-foreground">
                  <span className="font-semibold text-foreground">98%</span> response rate
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="group relative overflow-hidden rounded-2xl border border-blue-500/10 bg-gradient-to-br from-blue-500/[0.05] to-transparent p-8 transition-all duration-300 hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/5">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl transition-all duration-300 group-hover:bg-blue-500/20" />
            <div className="relative">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <IconSearch className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-serif text-xl font-semibold text-foreground">Find Answers Fast</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Search through thousands of answered questions or ask your own. Get responses from experienced developers in minutes.
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-violet-500/10 bg-gradient-to-br from-violet-500/[0.05] to-transparent p-8 transition-all duration-300 hover:border-violet-500/20 hover:shadow-lg hover:shadow-violet-500/5">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl transition-all duration-300 group-hover:bg-violet-500/20" />
            <div className="relative">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                <IconRocket className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-serif text-xl font-semibold text-foreground">Ship Faster</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Don't get stuck on roadblocks. Our community helps you debug issues and find solutions so you can keep building.
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-cyan-500/10 bg-gradient-to-br from-cyan-500/[0.05] to-transparent p-8 transition-all duration-300 hover:border-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/5">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl transition-all duration-300 group-hover:bg-cyan-500/20" />
            <div className="relative">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <IconShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-serif text-xl font-semibold text-foreground">Quality First</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Upvote helpful answers, build reputation, and trust the wisdom of the community. Quality content rises to the top.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Questions Feed */}
          <section className="lg:col-span-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-blue-600 dark:text-blue-400">
                  <IconTrendingUp className="h-3.5 w-3.5" />
                  Latest Activity
                </div>
                <h2 className="font-serif text-2xl font-semibold text-foreground">Recent Questions</h2>
              </div>
              <Link
                href="/questions"
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View all
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-4">
              <LatestQuestions />
            </div>
          </section>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Top Contributors */}
            <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/80">
              <div className="border-b border-border/80 p-5">
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-violet-600 dark:text-violet-400">
                  <IconUsers className="h-3.5 w-3.5" />
                  Community Stars
                </div>
                <h2 className="font-serif text-lg font-semibold text-foreground">Top Contributors</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Members helping the community this week
                </p>
              </div>
              <div className="p-4">
                <TopContributers />
              </div>
            </div>

            {/* GitHub Star CTA */}
            <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-card to-card/50 p-6">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />
              <div className="relative">
                <IconStarFilled className="mb-3 h-8 w-8 text-blue-500" />
                <h3 className="mb-2 font-serif text-lg font-semibold text-foreground">Love Askly?</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Star us on GitHub and help spread the word to other developers.
                </p>
                <a
                  href={GITHUB_STAR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-all hover:opacity-90"
                >
                  <IconBrandGithub className="h-4 w-4" />
                  Star on GitHub
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-blue-500/[0.08] via-violet-500/[0.05] to-cyan-500/[0.08] p-12 text-center md:p-16">
          <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative">
            <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-lg shadow-blue-500/25">
              <IconMessageCircle className="h-8 w-8" />
            </div>

            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Join our community of developers helping each other solve problems and build amazing things. It's free, forever.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/questions/ask"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-8 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30"
              >
                Ask Your First Question
                <IconArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/questions"
                className="inline-flex h-12 items-center rounded-full border border-border bg-background/80 px-8 text-sm font-semibold text-foreground backdrop-blur-sm transition-all hover:border-blue-500/40"
              >
                Explore Questions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

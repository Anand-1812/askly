import Link from "next/link";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import LatestQuestions from "./components/LatestQuestions";
import TopContributers from "./components/TopContributers";
import { IconArrowRight, IconTrendingUp, IconUsers } from "@tabler/icons-react";

export default function Home() {
  return (
    <>
      <main className="w-full">
        <HeroSection />

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Section divider */}
          <div className="mb-16 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium uppercase tracking-wider text-foreground/50 whitespace-nowrap">
              Community Highlights
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
            {/* Latest Questions */}
            <div className="space-y-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <IconTrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary/80">
                      Latest
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-foreground">
                    Recent Questions
                  </h2>
                </div>
                <Link
                  href="/questions"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  View all
                  <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <LatestQuestions />
            </div>

            {/* Top Contributors */}
            <div className="space-y-8">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <IconUsers className="h-4 w-4 text-accent" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent/80">
                    Leaderboard
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-foreground">
                  Top Contributors
                </h2>
              </div>
              <TopContributers />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

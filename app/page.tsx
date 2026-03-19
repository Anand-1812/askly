import Link from "next/link";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import LatestQuestions from "./components/LatestQuestions";
import TopContributers from "./components/TopContributers";
import { IconArrowRight, IconTrendingUp, IconUsers } from "@tabler/icons-react";

export default function Home() {
  return (
    <>
      <main className="overflow-hidden">
        <HeroSection />

        <section className="container mx-auto px-4 pb-24">
          {/* Section divider */}
          <div className="mb-14 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-xs font-medium tracking-widest uppercase text-white/25">
              Community Activity
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
            {/* Latest Questions */}
            <div className="space-y-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <IconTrendingUp className="h-4 w-4 text-orange-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-orange-400/80">
                      Recent
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    Latest Questions
                  </h2>
                </div>
                <Link
                  href="/questions"
                  className="group flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[3%] px-4 py-2 text-sm text-white/60 transition-all duration-150 hover:border-white/20 hover:bg-white/[6%] hover:text-white/90"
                >
                  View all
                  <IconArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                </Link>
              </div>
              <LatestQuestions />
            </div>

            {/* Top Contributors */}
            <div className="space-y-6">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <IconUsers className="h-4 w-4 text-purple-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-purple-400/80">
                    Leaderboard
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
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

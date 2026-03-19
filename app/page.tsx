import Link from "next/link";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import LatestQuestions from "./components/LatestQuestions";
import TopContributers from "./components/TopContributers";

export default function Home() {
  return (
    <>
      <main className="overflow-hidden">
        <HeroSection />
        <section className="container mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">Latest Questions</h2>
                <Link
                  href="/questions"
                  className="rounded-full border border-white/20 px-4 py-2 text-sm duration-200 hover:bg-white/10"
                >
                  View all
                </Link>
              </div>
              <LatestQuestions />
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Top Contributors</h2>
              <TopContributers />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

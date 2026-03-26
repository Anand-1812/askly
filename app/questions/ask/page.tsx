import QuestionForm from "@/components/QuestionForm";
import React from "react";
import { IconBulb, IconSparkles, IconShieldCheck } from "@tabler/icons-react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import ShineBorder from "@/components/magicui/shine-border";

const Page = () => {
  return (
    <div className="page-shell min-h-screen relative overflow-hidden">
      {/* Subtle background animation */}
      <BackgroundBeams className="opacity-40" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Form Area */}
          <div className="lg:col-span-8 space-y-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                <IconSparkles className="h-3.5 w-3.5" />
                Knowledge Base
              </div>

              <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Ask a public question
              </h1>

              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
                Join our developer community. Share your challenge, provide context, and get solutions from builders who ship.
              </p>
            </div>

            <ShineBorder 
              className="relative w-full rounded-3xl border border-border/50 bg-card/40 p-1 backdrop-blur-sm shadow-2xl"
            >
              <div className="p-6 sm:p-10">
                <QuestionForm />
              </div>
            </ShineBorder>
          </div>

          {/* Sidebar Instructions */}
          <aside className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <IconBulb className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground">Tips for success</h3>
                </div>
                
                <ul className="space-y-5 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary text-center">1</span>
                    <p><strong>Be specific.</strong> Summarize the exact issue in your title.</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary text-center">2</span>
                    <p><strong>Optional Media.</strong> Images help, but aren&apos;t required. Focus on clear code samples.</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary text-center">3</span>
                    <p><strong>Minimal Reproducible Example.</strong> Share the smallest code snippet needed to trigger the bug.</p>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card/30 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3">
                  <IconShieldCheck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Safety First</span>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground/80">
                  Avoid sharing sensitive data like API keys or passwords. All questions are indexed publicly.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Page;

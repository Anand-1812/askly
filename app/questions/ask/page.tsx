import QuestionForm from "@/components/QuestionForm";
import React from "react";
import { IconBulb, IconSparkles } from "@tabler/icons-react";

const Page = () => {
  return (
    <div className="page-shell min-h-screen">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/80 bg-card/75 p-6 shadow-sm sm:p-8">
          <div className="mb-9">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              <IconSparkles className="h-3.5 w-3.5" />
              Community Q and A
            </div>

            <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Ask a public question
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Give context, include what you tried, and make the problem easy to reproduce.
              Better structure means faster, better answers.
            </p>
          </div>

          <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/8 p-5">
            <div className="flex items-start gap-3">
              <IconBulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <h3 className="mb-2 text-sm font-semibold text-primary">Writing a great question</h3>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>Use a specific title with the exact issue.</li>
                  <li>Explain expected result versus actual result.</li>
                  <li>Share a minimal code sample that reproduces the bug.</li>
                  <li>Add relevant tags so experts can find your post quickly.</li>
                </ul>
              </div>
            </div>
          </div>

          <QuestionForm />
        </div>
      </div>
    </div>
  );
};

export default Page;

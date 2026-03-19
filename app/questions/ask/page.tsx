import QuestionForm from "@/components/QuestionForm";
import React from "react";
import { IconBulb, IconSparkles } from "@tabler/icons-react";

const Page = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 pb-24 pt-32">
        {/* Header */}
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <IconSparkles className="h-3 w-3" />
              Community Q&A
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ask a public question
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Get help from thousands of developers. Be specific, provide context,
            and include what you&apos;ve already tried.
          </p>
        </div>

        {/* Tips card */}
        <div className="mb-8 overflow-hidden rounded-xl border border-primary/20 bg-primary/8 p-5">
          <div className="flex items-start gap-3">
            <IconBulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <h3 className="mb-2 text-sm font-semibold text-primary">
                Writing a great question
              </h3>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li className="flex items-start gap-1.5">
                  <span className="mt-0.5 text-primary/70">▸</span>
                  Summarize your problem in a clear, concise title.
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="mt-0.5 text-primary/70">▸</span>
                  Describe exactly what you expected to happen vs. what actually
                  happened.
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="mt-0.5 text-primary/70">▸</span>
                  Include the smallest reproducible code snippet that
                  demonstrates the issue.
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="mt-0.5 text-primary/70">▸</span>
                  Add relevant tags so the right people find your question
                  quickly.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form */}
        <QuestionForm />
      </div>
    </div>
  );
};

export default Page;

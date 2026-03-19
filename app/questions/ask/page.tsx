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
            <span className="flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-400">
              <IconSparkles className="h-3 w-3" />
              Community Q&A
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ask a public question
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/50">
            Get help from thousands of developers. Be specific, provide context,
            and include what you&apos;ve already tried.
          </p>
        </div>

        {/* Tips card */}
        <div className="mb-8 overflow-hidden rounded-xl border border-orange-500/15 bg-orange-500/5 p-5">
          <div className="flex items-start gap-3">
            <IconBulb className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
            <div>
              <h3 className="mb-2 text-sm font-semibold text-orange-300">
                Writing a great question
              </h3>
              <ul className="space-y-1 text-xs text-white/50">
                <li className="flex items-start gap-1.5">
                  <span className="mt-0.5 text-orange-500/60">▸</span>
                  Summarize your problem in a clear, concise title.
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="mt-0.5 text-orange-500/60">▸</span>
                  Describe exactly what you expected to happen vs. what actually
                  happened.
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="mt-0.5 text-orange-500/60">▸</span>
                  Include the smallest reproducible code snippet that
                  demonstrates the issue.
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="mt-0.5 text-orange-500/60">▸</span>
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

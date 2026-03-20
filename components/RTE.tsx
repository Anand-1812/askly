"use client";

import React from "react";
import dynamic from "next/dynamic";
import "@uiw/react-markdown-preview/markdown.css";
import { cn } from "@/lib/utils";

// Only used for READ-ONLY preview rendering (question/answer display pages)
const MarkdownPreviewComponent = dynamic(
  () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
  { ssr: false }
);

// ─── Read-only preview (used in Answers.tsx, page.tsx, etc.) ────────────────
export const MarkdownPreview = ({
  source,
  className,
}: {
  source: string;
  className?: string;
}) => {
  const [colorMode, setColorMode] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    const check = () =>
      setColorMode(
        document.documentElement.classList.contains("dark") ? "dark" : "light"
      );
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div data-color-mode={colorMode} className={className}>
      <MarkdownPreviewComponent source={source ?? ""} />
    </div>
  );
};

// ─── Editor (used in QuestionForm.tsx, Answers.tsx write form) ───────────────
interface RTEProps {
  value?: string;
  onChange?: (value?: string) => void;
  className?: string;
}

const RTE = ({ className, value, onChange }: RTEProps) => {
  return (
    <textarea
      className={cn(
        "w-full min-h-[350px] resize-y rounded-none border-0 bg-transparent px-4 py-3",
        "font-mono text-sm text-foreground outline-none",
        "placeholder:text-muted-foreground/60",
        "focus:outline-none focus:ring-0",
        className
      )}
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={`Describe your problem in detail. Markdown is supported.\n\nExample:\n\`\`\`js\nconsole.log('hello world');\n\`\`\``}
      spellCheck={false}
    />
  );
};

export default RTE;

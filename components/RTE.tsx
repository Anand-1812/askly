"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Editor from "@uiw/react-md-editor";
import MDPreview from "@uiw/react-markdown-preview";
import { cn } from "@/lib/utils";

const EditorComponent = dynamic(
    () => import("@uiw/react-md-editor").then(mod => mod.default),
    { ssr: false }
);

type EditorProps = React.ComponentProps<typeof Editor>;

function useColorMode() {
  const [colorMode, setColorMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    const update = () => {
      setColorMode(document.documentElement.classList.contains("dark") ? "dark" : "light");
    };
    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return colorMode;
}

const RTE = ({ className, ...props }: EditorProps) => {
  const colorMode = useColorMode();

  return (
    <div
      className={cn("w-full bg-transparent", className)}
      data-color-mode={colorMode}
    >
      <EditorComponent {...props} preview="edit" />
    </div>
  );
};

export default RTE;

// MarkdownPreview component — used across question/answer pages
export const MarkdownPreview = ({
  source,
  className,
}: {
  source: string;
  className?: string;
}) => {
  const colorMode = useColorMode();

  return (
    <div
      className={cn("wmde-markdown-var", className)}
      data-color-mode={colorMode}
    >
      <MDPreview source={source} />
    </div>
  );
};

"use client";

import React from "react";
import dynamic from "next/dynamic";
import Editor from "@uiw/react-md-editor";
import { cn } from "@/lib/utils";

// This is the only place InitializedMDXEditor is imported directly.
const EditorComponent = dynamic(
    () =>
        import("@uiw/react-md-editor").then(mod => {
            return mod.default;
        }),
    { ssr: false }
);

type EditorProps = React.ComponentProps<typeof Editor>;
type MarkdownPreviewProps = React.ComponentProps<typeof Editor.Markdown>;

const RTE = ({ className, ...props }: EditorProps) => {
  return (
    <div className={cn("w-full bg-transparent", className)}>
      <EditorComponent {...props} />
    </div>
  );
};

export const MarkdownPreview = ({
  className,
  ...props
}: MarkdownPreviewProps) => (
  <Editor.Markdown
    className={cn("wmde-markdown !bg-transparent", className)}
    {...props}
  />
);

export default RTE;

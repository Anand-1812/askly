"use client";

import React from "react";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const EditorComponent = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

interface RTEProps {
  value?: string;
  onChange?: (value?: string) => void;
  className?: string;
}

const RTE = ({ className, value, onChange }: RTEProps) => {
  const { theme } = useTheme();

  return (
    <div 
      className={cn("w-full bg-transparent", className)} 
      // This ensures the editor UI flips colors with your theme
      data-color-mode={theme === "dark" ? "dark" : "light"}
    >
      <EditorComponent
        value={value}
        onChange={onChange}
        // UI/UX FIX: Set preview to "edit" to remove the double text/preview area
        preview="edit" 
        height={350}
        visibleDragbar={false}
        // Customizing the toolbar to keep it clean
        commandsFilter={(cmd) => {
            // Optional: Filter out specific commands if you want a minimal look
            return cmd;
        }}
      />
    </div>
  );
};

export default RTE;

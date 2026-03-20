"use client";

import React from "react";
import dynamic from "next/dynamic";
import Editor from "@uiw/react-md-editor";
import { cn } from "@/lib/utils";

const EditorComponent = dynamic(
    () => import("@uiw/react-md-editor").then(mod => mod.default),
    { ssr: false }
);

type EditorProps = React.ComponentProps<typeof Editor>;

const RTE = ({ className, ...props }: EditorProps) => {
  return (
    <div className={cn("w-full bg-transparent", className)}>
      <EditorComponent {...props} preview="edit" />
    </div>
  );
};

export default RTE;

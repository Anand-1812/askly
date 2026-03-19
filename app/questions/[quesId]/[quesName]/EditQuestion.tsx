"use client";

import { useAuthStore } from "@/store/Auth";
import slugify from "@/utils/slugify";
import { IconPencil } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

const EditQuestion = ({
  questionId,
  questionTitle,
  authorId,
}: {
  questionId: string;
  questionTitle: string;
  authorId: string;
}) => {
  const { user } = useAuthStore();

  if (user?.$id !== authorId) return null;

  return (
    <Link
      href={`/questions/${questionId}/${slugify(questionTitle)}/edit`}
      title="Edit question"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[3%] text-white/40 transition-all duration-150 hover:border-white/20 hover:bg-white/[6%] hover:text-white/80"
    >
      <IconPencil className="h-4 w-4" />
    </Link>
  );
};

export default EditQuestion;

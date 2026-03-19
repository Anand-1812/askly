"use client";

import QuestionForm from "@/components/QuestionForm";
import { useAuthStore } from "@/store/Auth";
import slugify from "@/utils/slugify";
import { Models } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";

type QuestionDocument = Models.Document & {
  authorId: string;
  title: string;
};

const EditQues = ({ question }: { question: QuestionDocument }) => {
  const { user } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    if (question.authorId !== user?.$id) {
      router.push(`/questions/${question.$id}/${slugify(question.title)}`);
    }
  }, [question, router, user?.$id]);

  if (user?.$id !== question.authorId) return null;

  return (
    <div className="page-shell min-h-screen pb-20 pt-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/80 bg-card/75 p-6 shadow-sm sm:p-8">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Edit your question
          </h1>
          <p className="mb-8 mt-2 text-sm text-muted-foreground sm:text-base">
            Improve the title, add missing context, and make the issue easier to reproduce.
          </p>

          <QuestionForm question={question} />
        </div>
      </div>
    </div>
  );
};

export default EditQues;

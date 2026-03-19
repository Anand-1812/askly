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
    <div className="block pb-20 pt-32">
      <div className="container mx-auto px-4">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
          Edit your public question
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Improve clarity, add missing context, and keep your question updated.
        </p>

        <div className="mx-auto w-full max-w-4xl">
          <QuestionForm question={question} />
        </div>
      </div>
    </div>
  );
};

export default EditQues;

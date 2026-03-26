"use client";

import React from "react";
import VoteButtons from "./VoteButtons";
import { useAuthStore } from "@/store/Auth";
import { avatars } from "@/models/client/config";

import RTE, { MarkdownPreview } from "./RTE";
import Comments from "./Comments";
import slugify from "@/utils/slugify";
import Link from "next/link";
import { IconTrash, IconMessageDots } from "@tabler/icons-react";
import convertDateToRelativeTime from "@/utils/relativeTime";

const Answers = ({
  answers: _answers,
  questionId,
}: {
  answers: any;
  questionId: string;
}) => {
  const [answers, setAnswers] = React.useState(_answers);
  const [newAnswer, setNewAnswer] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newAnswer.trim() || !user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/answer", {
        method: "POST",
        body: JSON.stringify({
          questionId,
          answer: newAnswer,
          authorId: user.$id,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw data;

      setNewAnswer("");
      setAnswers((prev: any) => ({
        total: prev.total + 1,
        documents: [
          {
            ...data,
            author: user,
            upvotesDocuments: { documents: [], total: 0 },
            downvotesDocuments: { documents: [], total: 0 },
            comments: { documents: [], total: 0 },
          },
          ...prev.documents,
        ],
      }));
    } catch (error: any) {
      window.alert(error?.message || "Error creating answer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteAnswer = async (answerId: string) => {
    if (!confirm("Delete this answer?")) return;
    try {
      const response = await fetch("/api/answer", {
        method: "DELETE",
        body: JSON.stringify({ answerId }),
      });

      const data = await response.json();
      if (!response.ok) throw data;

      setAnswers((prev: any) => ({
        total: prev.total - 1,
        documents: prev.documents.filter((a: any) => a.$id !== answerId),
      }));
    } catch (error: any) {
      window.alert(error?.message || "Error deleting answer");
    }
  };

  return (
    <div className="mt-2">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="mb-6 flex items-center gap-3">
        <IconMessageDots className="h-5 w-5 text-primary/80" />
        <h2 className="text-lg font-semibold text-foreground">
          {answers.total} {answers.total === 1 ? "Answer" : "Answers"}
        </h2>
        <div className="flex-1 border-t border-border" />
      </div>

      {/* ── Answer list ────────────────────────────────────────── */}
      <div className="space-y-6">
        {answers.documents.map((answer: any) => (
          <div
            key={answer.$id}
            className="group relative flex gap-4 rounded-2xl border border-border bg-background/75 p-5 transition-colors hover:border-primary/30"
          >
            {/* Vote column */}
            <div className="flex shrink-0 flex-col items-center pt-1">
              <VoteButtons
                type="answer"
                id={answer.$id}
                upvotes={answer.upvotesDocuments}
                downvotes={answer.downvotesDocuments}
              />
            </div>

            {/* Content column */}
            <div className="min-w-0 flex-1">
              <MarkdownPreview className="rounded-xl border border-border bg-card/70 p-4 text-sm" source={answer.content} />

              {/* Author row */}
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  answered{" "}
                  {convertDateToRelativeTime(new Date(answer.$createdAt))}
                </span>

                <div className="flex items-center gap-2">
                  {user?.$id === answer.authorId && (
                    <button
                      onClick={() => deleteAnswer(answer.$id)}
                      title="Delete answer"
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-destructive/25 text-destructive/70 opacity-0 transition-all duration-150 hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                    >
                      <IconTrash className="h-3.5 w-3.5" />
                    </button>
                  )}

                  <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
                    <picture>
                      <img
                        src={avatars.getInitials(answer.author.name, 24, 24)}
                        alt={answer.author.name}
                        className="rounded-md"
                      />
                    </picture>
                    <div className="leading-none">
                      <Link
                        href={`/users/${answer.author.$id}/${slugify(
                          answer.author.name,
                        )}`}
                        className="block text-xs font-medium text-primary/90 transition-colors hover:text-primary"
                      >
                        {answer.author.name}
                      </Link>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {answer.author.reputation} rep
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments */}
              <Comments
                comments={answer.comments}
                className="mt-4"
                type="answer"
                typeId={answer.$id}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Post your answer ───────────────────────────────────── */}
      <div className="mt-10">
        <div className="mb-5 flex items-center gap-3">
          <h2 className="text-lg font-semibold text-foreground">Your Answer</h2>
          <div className="flex-1 border-t border-border" />
        </div>

        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-border bg-background/75 transition-colors focus-within:border-primary/40">
              <RTE
                value={newAnswer}
                onChange={(value) => setNewAnswer(value || "")}
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">
                Use Markdown for code blocks, links, and formatting.
              </p>
              <button
                type="submit"
                disabled={isSubmitting || !newAnswer.trim()}
                className="flex h-10 shrink-0 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-150 hover:brightness-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Posting...
                  </>
                ) : (
                  "Post Your Answer"
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="rounded-2xl border border-border bg-background/75 p-8 text-center">
            <p className="mb-4 text-sm text-muted-foreground">
              You need to be logged in to post an answer.
            </p>
            <Link
              href="/login"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:brightness-95"
            >
              Sign in to answer
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Answers;

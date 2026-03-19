"use client";

import { databases } from "@/models/client/config";
import { commentCollection, db } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { cn } from "@/lib/utils";
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "@/utils/slugify";
import { IconTrash, IconMessageCircle, IconSend } from "@tabler/icons-react";
import { ID } from "appwrite";
import Link from "next/link";
import React from "react";

const Comments = ({
  comments: _comments,
  type,
  typeId,
  className,
}: {
  comments: any;
  type: "question" | "answer";
  typeId: string;
  className?: string;
}) => {
  const [comments, setComments] = React.useState(_comments);
  const [newComment, setNewComment] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);
  const { user } = useAuthStore();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newComment.trim() || !user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await databases.createDocument(
        db,
        commentCollection,
        ID.unique(),
        {
          content: newComment.trim(),
          authorId: user.$id,
          type,
          typeId,
        },
      );

      setNewComment("");
      setShowForm(false);
      setComments((prev: any) => ({
        total: prev.total + 1,
        documents: [{ ...response, author: user }, ...prev.documents],
      }));
    } catch (error: any) {
      window.alert(error?.message || "Error creating comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;
    try {
      await databases.deleteDocument(db, commentCollection, commentId);
      setComments((prev: any) => ({
        total: prev.total - 1,
        documents: prev.documents.filter((c: any) => c.$id !== commentId),
      }));
    } catch (error: any) {
      window.alert(error?.message || "Error deleting comment");
    }
  };

  const handleShowForm = () => {
    setShowForm(true);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  return (
    <div className={cn("mt-4", className)}>
      {/* Comment thread */}
      {comments.documents.length > 0 && (
        <div className="mb-3 divide-y divide-border/70 rounded-lg border border-border bg-card/70">
          {comments.documents.map((comment: any) => (
            <div
              key={comment.$id}
              className="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-secondary/50"
            >
              <IconMessageCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
              <p className="min-w-0 flex-1 text-sm leading-relaxed text-foreground/80">
                {comment.content} <span className="mx-1 text-muted-foreground">-</span>
                <Link
                  href={`/users/${comment.authorId}/${slugify(
                    comment.author.name,
                  )}`}
                  className="font-medium text-primary/90 transition-colors hover:text-primary"
                >
                  {comment.author.name}
                </Link>
                <span className="ml-2 text-xs text-muted-foreground">
                  {convertDateToRelativeTime(new Date(comment.$createdAt))}
                </span>
              </p>
              {user?.$id === comment.authorId && (
                <button
                  onClick={() => deleteComment(comment.$id)}
                  className="mt-0.5 shrink-0 text-muted-foreground opacity-0 transition-all duration-150 hover:text-destructive group-hover:opacity-100"
                  title="Delete comment"
                >
                  <IconTrash className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add comment */}
      {showForm ? (
        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-border bg-card p-3"
        >
          <textarea
            ref={textareaRef}
            className="w-full resize-none rounded-md border-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus:outline-none"
            rows={3}
            placeholder="Write a comment…"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              }
              if (e.key === "Escape") {
                setShowForm(false);
                setNewComment("");
              }
            }}
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Ctrl/Cmd + Enter to submit - Esc to cancel
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setNewComment("");
                }}
                className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="flex items-center gap-1.5 rounded-md bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary transition-all duration-150 hover:bg-primary/25 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <IconSend className="h-3 w-3" />
                {isSubmitting ? "Posting…" : "Post"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <button
          onClick={handleShowForm}
          className="text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          + Add a comment
        </button>
      )}
    </div>
  );
};

export default Comments;

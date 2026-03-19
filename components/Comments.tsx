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
        <div className="mb-3 divide-y divide-white/5 rounded-lg border border-white/8 bg-white/[2%]">
          {comments.documents.map((comment: any) => (
            <div
              key={comment.$id}
              className="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-white/[2%]"
            >
              <IconMessageCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/20" />
              <p className="min-w-0 flex-1 text-sm leading-relaxed text-white/65">
                {comment.content} <span className="mx-1 text-white/20">—</span>
                <Link
                  href={`/users/${comment.authorId}/${slugify(
                    comment.author.name,
                  )}`}
                  className="font-medium text-orange-400/80 transition-colors hover:text-orange-400"
                >
                  {comment.author.name}
                </Link>
                <span className="ml-2 text-xs text-white/25">
                  {convertDateToRelativeTime(new Date(comment.$createdAt))}
                </span>
              </p>
              {user?.$id === comment.authorId && (
                <button
                  onClick={() => deleteComment(comment.$id)}
                  className="mt-0.5 shrink-0 text-white/20 opacity-0 transition-all duration-150 hover:text-red-400 group-hover:opacity-100"
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
          className="rounded-lg border border-white/10 bg-white/[3%] p-3"
        >
          <textarea
            ref={textareaRef}
            className="w-full resize-none rounded-md border-0 bg-transparent text-sm text-white/85 outline-none placeholder:text-white/25 focus:outline-none"
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
            <span className="text-xs text-white/25">
              ⌘ + Enter to submit · Esc to cancel
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setNewComment("");
                }}
                className="rounded-md px-3 py-1.5 text-xs font-medium text-white/40 transition-colors hover:text-white/70"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="flex items-center gap-1.5 rounded-md bg-orange-500/20 px-3 py-1.5 text-xs font-semibold text-orange-400 transition-all duration-150 hover:bg-orange-500/30 disabled:cursor-not-allowed disabled:opacity-40"
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
          className="text-xs text-white/30 transition-colors hover:text-orange-400"
        >
          + Add a comment
        </button>
      )}
    </div>
  );
};

export default Comments;

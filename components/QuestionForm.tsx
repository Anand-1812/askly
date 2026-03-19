"use client";

import RTE from "@/components/RTE";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/Auth";
import { cn } from "@/lib/utils";
import slugify from "@/utils/slugify";
import { IconPlus, IconX } from "@tabler/icons-react";
import { ID } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";
import { databases, storage } from "@/models/client/config";
import {
  db,
  questionAttachmentBucket,
  questionCollection,
} from "@/models/name";
import { Confetti } from "@/components/magicui/confetti";

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col gap-2 rounded-2xl border border-border/80 bg-background/70 p-5 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
};

/**
 * ******************************************************************************
 * ![INFO]: for buttons, refer to https://ui.aceternity.com/components/tailwindcss-buttons
 * ******************************************************************************
 */
const QuestionForm = ({ question }: { question?: any }) => {
  const { user } = useAuthStore();
  const [tag, setTag] = React.useState("");
  const router = useRouter();

  const [formData, setFormData] = React.useState({
    title: String(question?.title || ""),
    content: String(question?.content || ""),
    authorId: user?.$id,
    tags: new Set((question?.tags || []) as string[]),
    attachment: null as File | null,
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const loadConfetti = (timeInMS = 3000) => {
    const end = Date.now() + timeInMS; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      Confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      Confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  const create = async () => {
    let attachmentId: string | null = null;

    if (formData.attachment) {
      const storageResponse = await storage.createFile(
        questionAttachmentBucket,
        ID.unique(),
        formData.attachment,
      );
      attachmentId = storageResponse.$id;
    }

    const response = await databases.createDocument(
      db,
      questionCollection,
      ID.unique(),
      {
        title: formData.title,
        content: formData.content,
        authorId: formData.authorId,
        tags: Array.from(formData.tags),
        attachmentId: attachmentId,
      },
    );

    loadConfetti();

    return response;
  };

  const update = async () => {
    if (!question) throw new Error("Please provide a question");

    const attachmentId = await (async () => {
      if (!formData.attachment) return question?.attachmentId as string;

      await storage.deleteFile(questionAttachmentBucket, question.attachmentId);

      const file = await storage.createFile(
        questionAttachmentBucket,
        ID.unique(),
        formData.attachment,
      );

      return file.$id;
    })();

    const response = await databases.updateDocument(
      db,
      questionCollection,
      question.$id,
      {
        title: formData.title,
        content: formData.content,
        authorId: formData.authorId,
        tags: Array.from(formData.tags),
        attachmentId: attachmentId,
      },
    );

    return response;
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // didn't check for attachment because it's optional in updating
    if (!formData.title || !formData.content || !formData.authorId) {
      setError(() => "Please fill out all fields");
      return;
    }

    setLoading(() => true);
    setError(() => "");

    try {
      const response = question ? await update() : await create();

      router.push(`/questions/${response.$id}/${slugify(formData.title)}`);
    } catch (error: any) {
      setError(() => error.message);
    }

    setLoading(() => false);
  };

  return (
    <form className="space-y-4" onSubmit={submit}>
      {error && (
        <LabelInputContainer>
          <div className="rounded-xl border border-destructive/25 bg-destructive/10 p-3 text-sm text-destructive-foreground/90">
            {error}
          </div>
        </LabelInputContainer>
      )}
      <LabelInputContainer>
        <Label htmlFor="title" className="text-sm text-foreground">
          Title
          <br />
          <small className="text-xs font-normal text-muted-foreground">
            Be specific and imagine you&apos;re asking a question to another
            person.
          </small>
        </Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
          type="text"
          maxLength={220}
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <span className="text-right text-xs text-muted-foreground">
          {formData.title.length}/220
        </span>
      </LabelInputContainer>
      <LabelInputContainer>
        <Label htmlFor="content" className="text-sm text-foreground">
          What are the details of your problem?
          <br />
          <small className="text-xs font-normal text-muted-foreground">
            Introduce the problem and expand on what you put in the title.
            Minimum 20 characters.
          </small>
        </Label>
        <div className="overflow-hidden rounded-lg border border-border">
          <RTE
            value={formData.content}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, content: value || "" }))
            }
          />
        </div>
      </LabelInputContainer>
      <LabelInputContainer>
        <Label htmlFor="image" className="text-sm text-foreground">
          Attachment
          <br />
          <small className="text-xs font-normal text-muted-foreground">
            Add image to your question to make it more clear and easier to
            understand.
          </small>
        </Label>
        <Input
          id="image"
          name="image"
          accept="image/*"
          placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
          type="file"
          onChange={(e) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;
            setFormData((prev) => ({
              ...prev,
              attachment: files[0],
            }));
          }}
        />
      </LabelInputContainer>
      <LabelInputContainer>
        <Label htmlFor="tag" className="text-sm text-foreground">
          Tags
          <br />
          <small className="text-xs font-normal text-muted-foreground">
            Add tags to describe what your question is about. Start typing to
            see suggestions.
          </small>
        </Label>
        <div className="flex w-full gap-3">
          <div className="w-full">
            <Input
              id="tag"
              name="tag"
              placeholder="e.g. (java c objective-c)"
              type="text"
              value={tag}
              onChange={(e) => setTag(() => e.target.value)}
            />
          </div>
          <button
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-border bg-secondary px-4 text-sm font-semibold text-foreground transition-all hover:border-primary/40 hover:text-primary"
            type="button"
            onClick={() => {
              if (tag.trim().length === 0) return;
              setFormData((prev) => ({
                ...prev,
                tags: new Set([...Array.from(prev.tags), tag.trim()]),
              }));
              setTag(() => "");
            }}
          >
            <IconPlus className="h-4 w-4" />
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from(formData.tags).map((tag, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
            >
              <span>{tag}</span>
              <button
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    tags: new Set(Array.from(prev.tags).filter((t) => t !== tag)),
                  }));
                }}
                type="button"
                className="rounded-full p-0.5 transition-colors hover:bg-primary/20"
                aria-label={`Remove tag ${tag}`}
              >
                <IconX size={12} />
              </button>
            </div>
          ))}
        </div>
      </LabelInputContainer>
      <button
        className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 font-semibold text-primary-foreground shadow-md transition-all hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={loading}
      >
        {loading ? (question ? "Updating..." : "Publishing...") : question ? "Update Question" : "Publish Question"}
      </button>
    </form>
  );
};

export default QuestionForm;

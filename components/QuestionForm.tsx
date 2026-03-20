"use client";

import RTE from "@/components/RTE";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/Auth";
import { cn } from "@/lib/utils";
import slugify from "@/utils/slugify";
import { IconPlus, IconX, IconLoader2 } from "@tabler/icons-react";
import { ID } from "appwrite";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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

const QuestionForm = ({ question }: { question?: any }) => {
  const { user } = useAuthStore();
  const [tag, setTag] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: String(question?.title || ""),
    content: String(question?.content || ""),
    authorId: user?.$id || "",
    tags: new Set((question?.tags || []) as string[]),
    attachment: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // CRITICAL FIX: Sync authorId when user becomes available
  useEffect(() => {
    if (user?.$id && !formData.authorId) {
      setFormData((prev) => ({ ...prev, authorId: user.$id }));
    }
  }, [user, formData.authorId]);

  const loadConfetti = (timeInMS = 3000) => {
    const end = Date.now() + timeInMS;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;
      Confetti({
        particleCount: 2, angle: 60, spread: 55, startVelocity: 60,
        origin: { x: 0, y: 0.5 }, colors: colors,
      });
      Confetti({
        particleCount: 2, angle: 120, spread: 55, startVelocity: 60,
        origin: { x: 1, y: 0.5 }, colors: colors,
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

    return await databases.createDocument(
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
  };

  const update = async () => {
    if (!question) throw new Error("Please provide a question");

    const attachmentId = await (async () => {
      if (!formData.attachment) return question?.attachmentId as string;
      if (question.attachmentId) {
        await storage.deleteFile(questionAttachmentBucket, question.attachmentId);
      }
      const file = await storage.createFile(
        questionAttachmentBucket,
        ID.unique(),
        formData.attachment,
      );
      return file.$id;
    })();

    return await databases.updateDocument(
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
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.authorId) {
      setError("Please ensure you are logged in and all fields are filled.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = question ? await update() : await create();
      if (!question) loadConfetti();
      
      router.push(`/questions/${response.$id}/${slugify(formData.title)}`);
    } catch (err: any) {
      console.error("Form Submission Error:", err);
      setError(err.message || "An unexpected error occurred. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={submit}>
      {error && (
        <div className="rounded-xl border border-destructive/25 bg-destructive/10 p-4 text-sm text-destructive-foreground">
          {error}
        </div>
      )}

      <LabelInputContainer>
        <Label htmlFor="title" className="text-sm font-semibold">
          Question Title
        </Label>
        <p className="text-xs text-muted-foreground mb-1">Summarize your problem in one sentence.</p>
        <Input
          id="title"
          placeholder="e.g. How to handle state in Next.js 15 server components?"
          type="text"
          maxLength={220}
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          className="bg-background/50"
        />
      </LabelInputContainer>

      <LabelInputContainer>
        <Label htmlFor="content" className="text-sm font-semibold">
          Details & Context
        </Label>
        <p className="text-xs text-muted-foreground mb-1">Explain your problem and what you&apos;ve already tried.</p>
        <div className="overflow-hidden rounded-xl border border-border bg-background/50">
          <RTE
            value={formData.content}
            onChange={(value) => setFormData((prev) => ({ ...prev, content: value || "" }))}
          />
        </div>
      </LabelInputContainer>

      <LabelInputContainer>
        <Label htmlFor="image" className="text-sm font-semibold text-foreground">
          Add an Attachment (Optional)
        </Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          className="bg-background/50 cursor-pointer"
          onChange={(e) => {
            const files = e.target.files;
            if (files?.[0]) setFormData((prev) => ({ ...prev, attachment: files[0] }));
          }}
        />
      </LabelInputContainer>

      <LabelInputContainer>
        <Label htmlFor="tag" className="text-sm font-semibold">Tags</Label>
        <div className="flex w-full gap-2">
          <Input
            id="tag"
            placeholder="e.g. react, nodejs"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="bg-background/50"
          />
          <button
            type="button"
            onClick={() => {
              if (!tag.trim()) return;
              setFormData((p) => ({ ...p, tags: new Set([...Array.from(p.tags), tag.trim()]) }));
              setTag("");
            }}
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-secondary px-4 text-xs font-bold transition-all hover:bg-primary hover:text-white"
          >
            <IconPlus size={16} /> Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {Array.from(formData.tags).map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              {t}
              <button type="button" onClick={() => setFormData(p => ({
                ...p, tags: new Set(Array.from(p.tags).filter(x => x !== t))
              }))}><IconX size={12} /></button>
            </span>
          ))}
        </div>
      </LabelInputContainer>

      <button
        className="w-full inline-flex h-12 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground shadow-lg transition-all hover:brightness-110 disabled:opacity-50"
        type="submit"
        disabled={loading}
      >
        {loading ? <IconLoader2 className="animate-spin mr-2" /> : null}
        {loading ? "Processing..." : question ? "Update Question" : "Publish Question"}
      </button>
    </form>
  );
};

export default QuestionForm;

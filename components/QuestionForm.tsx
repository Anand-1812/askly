"use client";

import RTE from "@/components/RTE";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/Auth";
import { cn } from "@/lib/utils";
import slugify from "@/utils/slugify";
import { IconPlus, IconX, IconUpload } from "@tabler/icons-react";
import { ID } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";
import { databases, storage } from "@/models/client/config";
import {
  TAG_MAX_LENGTH,
  isTagTypeMismatchError,
  normalizeTags,
  splitTagInput,
} from "@/utils/tags";
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
}) => (
  <div
    className={cn(
      "relative flex w-full flex-col gap-3 rounded-2xl border border-border/60 bg-background/50 p-6 shadow-sm",
      className,
    )}
  >
    {children}
  </div>
);

const QuestionForm = ({ question }: { question?: any }) => {
  const { user } = useAuthStore();
  const [tag, setTag] = React.useState("");
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const [formData, setFormData] = React.useState({
    title: String(question?.title || ""),
    content: String(question?.content || ""),
    authorId: user?.$id,
    tags: new Set(normalizeTags(question?.tags)),
    attachment: null as File | null,
  });

  const loadConfetti = () => {
    const end = Date.now() + 3000;
    const colors = ["#c86a2b", "#0f7a6a", "#5f8f3f", "#f8deb1"];
    const frame = () => {
      if (Date.now() > end) return;
      Confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.5 },
        colors,
      });
      Confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.5 },
        colors,
      });
      requestAnimationFrame(frame);
    };
    frame();
  };

  const create = async (tags: string[]) => {
    let attachmentId: string | null = null;
    if (formData.attachment) {
      const storageResponse = await storage.createFile(
        questionAttachmentBucket,
        ID.unique(),
        formData.attachment,
      );
      attachmentId = storageResponse.$id;
    }
    const payload = {
      title: formData.title,
      content: formData.content,
      authorId: formData.authorId,
      tags,
      attachmentId: attachmentId,
    };

    try {
      return await databases.createDocument(
        db,
        questionCollection,
        ID.unique(),
        payload,
      );
    } catch (err: any) {
      const message = String(err?.message || "");
      if (!isTagTypeMismatchError(message)) throw err;

      if (tags.length > 1) {
        throw new Error(
          'Your Appwrite "tags" field currently accepts only one string. Keep one tag for now, or change schema to String[] (max 50).',
        );
      }

      return await databases.createDocument(db, questionCollection, ID.unique(), {
        ...payload,
        tags: tags[0],
      });
    }
  };

  const update = async (tags: string[]) => {
    if (!question) throw new Error("Question context missing.");
    const attachmentId = await (async () => {
      if (!formData.attachment) return question?.attachmentId;
      if (question.attachmentId) {
        await storage
          .deleteFile(questionAttachmentBucket, question.attachmentId)
          .catch(console.error);
      }
      const file = await storage.createFile(
        questionAttachmentBucket,
        ID.unique(),
        formData.attachment,
      );
      return file.$id;
    })();

    const payload = {
        title: formData.title,
        content: formData.content,
        tags,
        attachmentId: attachmentId,
      };

    try {
      return await databases.updateDocument(
        db,
        questionCollection,
        question.$id,
        payload,
      );
    } catch (err: any) {
      const message = String(err?.message || "");
      if (!isTagTypeMismatchError(message)) throw err;

      if (tags.length > 1) {
        throw new Error(
          'Your Appwrite "tags" field currently accepts only one string. Keep one tag for now, or change schema to String[] (max 50).',
        );
      }

      return await databases.updateDocument(db, questionCollection, question.$id, {
        ...payload,
        tags: tags[0],
      });
    }
  };

  const addTagFromInput = () => {
    const parsedTags = splitTagInput(tag);
    if (parsedTags.length === 0) return;

    const tooLongTag = parsedTags.find((tagValue) => tagValue.length > TAG_MAX_LENGTH);
    if (tooLongTag) {
      setError(
        `Each tag must be ${TAG_MAX_LENGTH} characters or fewer. "${tooLongTag}" is too long.`,
      );
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tags: new Set([...Array.from(prev.tags), ...parsedTags]),
    }));
    setTag("");
    setError("");
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation matches Appwrite constraints
    if (!formData.title || formData.title.length > 100) {
      setError("Title is required and must be under 100 characters.");
      return;
    }
    if (formData.content.length < 20) {
      setError("Please provide more detailed content (min 20 characters).");
      return;
    }
    if (!user) {
      setError("You must be logged in to publish.");
      return;
    }

    const sanitizedTags = Array.from(formData.tags)
      .map((tagValue) => tagValue.trim())
      .filter(Boolean);
    if (sanitizedTags.length === 0) {
      setError("Add at least one tag before publishing.");
      return;
    }
    const tooLongTag = sanitizedTags.find(
      (tagValue) => tagValue.length > TAG_MAX_LENGTH,
    );
    if (tooLongTag) {
      setError(
        `Each tag must be ${TAG_MAX_LENGTH} characters or fewer. "${tooLongTag}" is too long.`,
      );
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = question
        ? await update(sanitizedTags)
        : await create(sanitizedTags);
      if (!question) loadConfetti();
      router.push(`/questions/${response.$id}/${slugify(formData.title)}`);
    } catch (err: any) {
      const message = String(err?.message || "Unable to publish the question.");
      if (isTagTypeMismatchError(message)) {
        setError(
          'Tag schema mismatch: in Appwrite, configure "tags" as a String[] attribute (array enabled), with max length 50 per item. Temporary workaround: publish with one tag.',
        );
        return;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={submit}>
      {error && (
        <div className="rounded-xl border border-destructive/25 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <LabelInputContainer>
        <Label htmlFor="title" className="text-base font-semibold">
          Title
        </Label>
        <p className="text-xs text-muted-foreground -mt-2">
          Be specific. Max 100 characters.
        </p>
        <Input
          id="title"
          value={formData.title}
          maxLength={100} // Matches Appwrite DB limit
          onChange={(e) =>
            setFormData((p) => ({ ...p, title: e.target.value }))
          }
          placeholder="e.g. How to use Appwrite storage with Next.js?"
        />
      </LabelInputContainer>



      <LabelInputContainer>
        <Label className="text-base font-semibold">Problem Details</Label>
        <div className="mt-2 overflow-hidden rounded-xl border border-border bg-background">
          <RTE 
            value={formData.content} 
            onChange={(v) => setFormData(p => ({ ...p, content: v || "" }))} 
          />
        </div>
      </LabelInputContainer>

      <LabelInputContainer>
        <Label
          htmlFor="image"
          className="text-base font-semibold flex items-center gap-2"
        >
          Supporting Image{" "}
          <span className="text-xs font-normal uppercase tracking-widest text-muted-foreground">
            (Optional)
          </span>
        </Label>
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/50 text-muted-foreground">
            <IconUpload className="h-5 w-5" />
          </div>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFormData((p) => ({
                ...p,
                attachment: e.target.files?.[0] || null,
              }))
            }
            className="flex-1 cursor-pointer"
          />
        </div>
      </LabelInputContainer>

      <LabelInputContainer>
        <Label htmlFor="tag" className="text-base font-semibold">
          Tags
        </Label>
        <div className="flex gap-2">
          <Input
            id="tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="e.g. react, nextjs, appwrite"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTagFromInput();
              }
            }}
          />
          <button
            type="button"
            onClick={addTagFromInput}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-secondary px-4 text-sm font-bold hover:bg-secondary/80"
          >
            <IconPlus className="h-4 w-4" /> Add
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Add one or more comma-separated tags. Each tag must be {TAG_MAX_LENGTH}
          {" "}
          characters or fewer.
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {Array.from(formData.tags).map((t, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary"
            >
              {t}{" "}
              <button
                type="button"
                onClick={() =>
                  setFormData((p) => {
                    const n = new Set(p.tags);
                    n.delete(t);
                    return { ...p, tags: n };
                  })
                }
                className="hover:text-foreground"
              >
                <IconX size={14} />
              </button>
            </div>
          ))}
        </div>
      </LabelInputContainer>

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-full bg-primary px-10 text-base font-bold text-primary-foreground shadow-xl transition-all hover:translate-y-[-2px] disabled:opacity-50"
      >
        {loading
          ? "Processing..."
          : question
            ? "Update Question"
            : "Publish Question"}
      </button>
    </form>
  );
};

export default QuestionForm;

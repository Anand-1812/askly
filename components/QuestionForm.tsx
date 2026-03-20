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
import { db, questionAttachmentBucket, questionCollection } from "@/models/name";
import { Confetti } from "@/components/magicui/confetti";

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string; }) => (
  <div className={cn("relative flex w-full flex-col gap-3 rounded-2xl border border-border/60 bg-background/50 p-6 shadow-sm", className)}>
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
    tags: new Set((question?.tags || []) as string[]),
    attachment: null as File | null,
  });

  const loadConfetti = () => {
    const end = Date.now() + 3000;
    const colors = ["#c86a2b", "#0f7a6a", "#5f8f3f", "#f8deb1"];
    const frame = () => {
      if (Date.now() > end) return;
      Confetti({ particleCount: 2, angle: 60, spread: 55, origin: { x: 0, y: 0.5 }, colors });
      Confetti({ particleCount: 2, angle: 120, spread: 55, origin: { x: 1, y: 0.5 }, colors });
      requestAnimationFrame(frame);
    };
    frame();
  };

  const create = async () => {
    let attachmentId: string | null = null;
    if (formData.attachment) {
      const storageResponse = await storage.createFile(questionAttachmentBucket, ID.unique(), formData.attachment);
      attachmentId = storageResponse.$id;
    }
    return await databases.createDocument(db, questionCollection, ID.unique(), {
      title: formData.title,
      content: formData.content,
      authorId: formData.authorId,
      tags: Array.from(formData.tags),
      attachmentId: attachmentId,
    });
  };

  const update = async () => {
    if (!question) throw new Error("Question context missing.");
    const attachmentId = await (async () => {
      if (!formData.attachment) return question?.attachmentId;
      // Only attempt delete if there was a previous attachment
      if (question.attachmentId) {
        await storage.deleteFile(questionAttachmentBucket, question.attachmentId).catch(console.error);
      }
      const file = await storage.createFile(questionAttachmentBucket, ID.unique(), formData.attachment);
      return file.$id;
    })();

    return await databases.updateDocument(db, questionCollection, question.$id, {
      title: formData.title,
      content: formData.content,
      tags: Array.from(formData.tags),
      attachmentId: attachmentId,
    });
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.authorId) {
      setError("Please provide a title and detailed content.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = question ? await update() : await create();
      if (!question) loadConfetti();
      router.push(`/questions/${response.$id}/${slugify(formData.title)}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={submit}>
      {error && <div className="rounded-xl border border-destructive/25 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

      <LabelInputContainer>
        <Label htmlFor="title" className="text-base font-semibold">Title</Label>
        <p className="text-xs text-muted-foreground -mt-2">Be specific and descriptive about your problem.</p>
        <Input id="title" value={formData.title} maxLength={220} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} placeholder="e.g. How to use Appwrite storage with Next.js Server Actions?" />
      </LabelInputContainer>

      <LabelInputContainer>
        <Label className="text-base font-semibold">Problem Details</Label>
        <p className="text-xs text-muted-foreground -mt-2">Minimum 20 characters. Explain your expected vs actual results.</p>
        <div className="overflow-hidden rounded-xl border border-border">
          <RTE value={formData.content} onChange={(v) => setFormData(p => ({ ...p, content: v || "" }))} />
        </div>
      </LabelInputContainer>

      <LabelInputContainer>
        <Label htmlFor="image" className="text-base font-semibold flex items-center gap-2">
          Supporting Image <span className="text-[10px] font-normal uppercase tracking-widest text-muted-foreground">(Optional)</span>
        </Label>
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/50 text-muted-foreground">
            <IconUpload className="h-5 w-5" />
          </div>
          <Input id="image" type="file" accept="image/*" onChange={(e) => setFormData(p => ({ ...p, attachment: e.target.files?.[0] || null }))} className="flex-1 cursor-pointer" />
        </div>
      </LabelInputContainer>

      <LabelInputContainer>
        <Label htmlFor="tag" className="text-base font-semibold">Tags</Label>
        <div className="flex gap-2">
          <Input id="tag" value={tag} onChange={(e) => setTag(e.target.value)} placeholder="e.g. react, nextjs, appwrite" onKeyDown={(e) => {
             if (e.key === 'Enter') { e.preventDefault(); if (tag.trim()) { setFormData(p => ({ ...p, tags: new Set([...Array.from(p.tags), tag.trim()]) })); setTag(""); } }
          }} />
          <button type="button" onClick={() => { if (tag.trim()) { setFormData(p => ({ ...p, tags: new Set([...Array.from(p.tags), tag.trim()]) })); setTag(""); } }} className="inline-flex h-11 items-center gap-2 rounded-xl bg-secondary px-4 text-sm font-bold transition-colors hover:bg-secondary/80">
            <IconPlus className="h-4 w-4" /> Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {Array.from(formData.tags).map((t, i) => (
            <div key={i} className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              {t} <button type="button" onClick={() => setFormData(p => { const n = new Set(p.tags); n.delete(t); return { ...p, tags: n }; })} className="hover:text-foreground"><IconX size={14} /></button>
            </div>
          ))}
        </div>
      </LabelInputContainer>

      <button type="submit" disabled={loading} className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-full bg-primary px-10 text-base font-bold text-primary-foreground shadow-xl transition-all hover:translate-y-[-2px] disabled:opacity-50">
        {loading ? "Processing..." : question ? "Update Question" : "Publish Question"}
      </button>
    </form>
  );
};

export default QuestionForm;

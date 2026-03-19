import { databases } from "@/models/server/config";
import { db, questionCollection } from "@/models/name";
import { Query } from "node-appwrite";
import Link from "next/link";
import slugify from "@/utils/slugify";
import { IconArrowRight, IconSparkles } from "@tabler/icons-react";

export default async function HeroSection() {
  let recentQuestions: any[] = [];

  try {
    const response = await databases.listDocuments(db, questionCollection, [
      Query.orderDesc("$createdAt"),
      Query.limit(5),
    ]);
    recentQuestions = response.documents;
  } catch (error) {
    console.error("HeroSection error:", error);
  }

  return (
    <section className="relative overflow-hidden">
      <div className="absolute left-1/2 top-28 -z-10 h-[26rem] w-[42rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[130px]" />
      <div className="absolute right-[5%] top-[20%] -z-10 h-52 w-52 rounded-full bg-accent/20 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 pb-10 pt-32 sm:px-6 lg:px-8 lg:pt-36">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/35 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <IconSparkles className="h-3.5 w-3.5" />
            Askly Developer Community
          </span>

          <h1 className="mt-6 font-serif text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            Ask better questions.
            <br />
            Build better software.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            One place to ask, answer, and level up with developers who ship. No noise,
            just practical help and clear discussions.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/questions/ask"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-95"
            >
              Ask a Question
              <IconArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/questions"
              className="inline-flex h-11 items-center rounded-full border border-border bg-card/90 px-5 text-sm font-semibold text-foreground transition-all hover:border-primary/35 hover:text-primary"
            >
              Browse Questions
            </Link>
          </div>
        </div>

        {recentQuestions.length > 0 && (
          <div className="mt-12 rounded-2xl border border-border/80 bg-card/70 p-4 shadow-sm sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground/70">
                Fresh from the Community
              </h2>
              <Link
                href="/questions"
                className="text-xs font-semibold text-primary transition-colors hover:brightness-110"
              >
                View all
              </Link>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {recentQuestions.map((question) => (
                <Link
                  key={question.$id}
                  href={`/questions/${question.$id}/${slugify(question.title)}`}
                  className="rounded-xl border border-border/70 bg-background/65 px-3 py-2.5 text-sm text-foreground/85 transition-all hover:border-primary/35 hover:text-primary"
                >
                  <span className="line-clamp-2">{question.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

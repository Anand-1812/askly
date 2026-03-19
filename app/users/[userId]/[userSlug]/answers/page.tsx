import Pagination from "@/components/Pagination";
import { MarkdownPreview } from "@/components/RTE";
import { answerCollection, db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import slugify from "@/utils/slugify";
import Link from "next/link";
import { Query } from "node-appwrite";
import React from "react";

const Page = async ({
    params,
    searchParams,
}: {
    params: Promise<{ userId: string; userSlug: string }>;
    searchParams: Promise<{ page?: string }>;
}) => {
    const { userId } = await params;
    const resolvedSearchParams = await searchParams;
    resolvedSearchParams.page ||= "1";

    const queries = [
        Query.equal("authorId", userId),
        Query.orderDesc("$createdAt"),
        Query.offset((+resolvedSearchParams.page - 1) * 25),
        Query.limit(25),
    ];

    const answers = await databases.listDocuments(db, answerCollection, queries);

    answers.documents = await Promise.all(
        answers.documents.map(async ans => {
            const question = await databases.getDocument(db, questionCollection, ans.questionId, [
                Query.select(["title"]),
            ]);
            return { ...ans, question };
        })
    );

    return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-card/75 px-4 py-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            {answers.total.toLocaleString()}
          </span>{" "}
          {answers.total === 1 ? "answer" : "answers"} posted
        </p>
      </div>

      {answers.documents.length === 0 ? (
        <div className="rounded-xl border border-border bg-card/70 p-10 text-center text-sm text-muted-foreground">
          No answers yet.
        </div>
      ) : (
        <div className="max-w-4xl space-y-4">
          {answers.documents.map((ans) => (
            <div
              key={ans.$id}
              className="rounded-xl border border-border bg-card/80 p-4 shadow-sm"
            >
              <div className="max-h-52 overflow-auto rounded-lg border border-border bg-background/60 p-1">
                <MarkdownPreview source={ans.content} className="rounded-lg p-4" />
              </div>
              <Link
                href={`/questions/${ans.questionId}/${slugify(ans.question.title)}`}
                className="mt-3 inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:brightness-95"
              >
                View question
              </Link>
            </div>
          ))}
        </div>
      )}

      {answers.total > 25 && <Pagination total={answers.total} limit={25} />}
    </div>
    );
};

export default Page;
